"use strict";

require("./server/general/models");
require("./server/bl-brighter-view/models");
require("./server/bl-data-sense/models");

var cluster = require("cluster"),
    express = require("express"),
    multer  = require("multer"),
    path = require("path"),
    favicon = require("static-favicon"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    bodyParser = require("body-parser"),
    config = require("./config/environment"),
    log = require("./server/libs/log")(module),
    utils = require("./server/libs/utils"),
    mongoose = require("mongoose"),
    schedulerJob = require("./server/libs/scheduler-jobs"),
    cpuCount = require("os").cpus().length,
    argv = require("minimist")(process.argv.slice(2)),
    weatherSrvc = require("weather-service"),
    dataProviderSrvc = require("dataprovider-service"),
    coreSrvc = require("core-service-old"),
//semver = require("semver"),
    consts = require("./server/libs/consts"),

//routes
    generalRoutes = require("./server/general/routes"),
    brighterViewRoutes = require("./server/bl-brighter-view/routes"),
    dataSenseRoutes = require("./server/bl-data-sense/routes"),
    brighterSavingsRoutes = require("./server/bl-brighter-savings/routes"),
    energyStarPortfolioManagerRoutes = require("./server/bl-energy-star-portfolio-manager/routes"),
    loadResponseRoutes = require("./server/bl-load-response/routes"),
    programsAndProjectsRoutes = require("./server/bl-programs-and-projects/routes"),
    utilityManagerRoutes = require("./server/bl-utility-manager/routes"),
    verifiedSavingsRoutes = require("./server/bl-verified-savings/routes"),
    helpAndUpdatesRoutes = require("./server/bl-help-and-updates/routes"),
    emsLiteSurfaceRoutes = require("./server/bl-ems-lite-surface/routes"),
    kinesis = require("./server/bl-ems-lite-surface/core/realtime/kinesis"),
    KINESIS_RECORD = "kinesis";

var applicationTitle = config.get("application") || "";
applicationTitle = applicationTitle.toLowerCase();

var weatherWebSrvcConfig = config.get("services:weather");
weatherSrvc.init(weatherWebSrvcConfig);

var dataProviderWebSrvcConfig = config.get("services:dataprovider");
dataProviderSrvc.init(dataProviderWebSrvcConfig);

var coreSrvcConfig = {
    baseUrl: config.get("demobox:url"),
    apiKey: config.get("demobox:createdemouserapi:auth")
};
coreSrvc.init(coreSrvcConfig);

function startServer(port, runScheduler) {
    mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {
        var app = express();
	app.enable("trust proxy");
        app.use(function (req, res, next) {
            var domain = config.get("domain");
            var cookieDomain = config.get("session:cookiedomain");
            var origin = req.header("host");
            if(origin) {
                origin = origin.toLowerCase().indexOf(cookieDomain) > -1 ? req.headers.origin : domain;
                res.header("Access-Control-Allow-Origin", origin);
            } else {
                res.header("Access-Control-Allow-Origin", "*");
            }
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, viewerTZOffset");
            res.header("Access-Control-Expose-Headers", consts.HEADERS.XTotalCount);
            res.header("Access-Control-Allow-Credentials", true);
            next();
        });

        //check if app is on eb and over http, and then redirect to https
        app.use(function (req, res, next) {
            if ((req.originalUrl.indexOf("/presentation?id=") > -1) &&
                (req.get("X-Forwarded-Proto") && req.get("X-Forwarded-Proto") === "https")) {
                res.redirect("http://" + req.get("Host") + req.url);
            }
            else if ((!req.secure) && (req.originalUrl.indexOf("/presentation?id=") < 0) &&
                (req.get("X-Forwarded-Proto") && req.get("X-Forwarded-Proto") !== "https")) {
                res.redirect("https://" + req.get("Host") + req.url);
            }
            else {
                next();
            }
        });

        var envCDN = config.get("cdn:env");
        log.info("CDN Environment: %s", envCDN);

        // Set the CDN options
        var options = {
            publicDir: path.join(__dirname, "/client"),
            viewsDir: path.join(__dirname, "/server/views"),
            domain: config.get("cdn:domain"),
            bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME,
            key: config.get("aws:auth:accesskeyid"),
            secret: config.get("aws:auth:secretaccesskey"),
            hostname: config.get("cdn:domain"),
            port: (envCDN === "production" ? 443 : config.get("port")),
            ssl: envCDN === "production",
            production: envCDN === "production"
        };

        // Initialize the CDN magic
        var CDN = require("express-cdn")(app, options);

        // view engine setup
        app.set("views", path.join(__dirname, "/server/views"));
        app.set("view engine", "jade");

        app.use(favicon());
        app.use(bodyParser.json({
            limit: "5mb"
        }));
        app.use(bodyParser.urlencoded({
            extended: false,
            limit: "5mb"
        }));
        app.use(multer({dest: "./uploads/"}));
        app.use(cookieParser());

        var cookieOptions = utils.getCookieOptionsDefault();
        cookieOptions.httpOnly = true;

        //session parameters
        var sessionParameters = session({
            name: config.get('session:cookiename'),
            secret: config.get('session:key'),
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                db: mongoose.connection.db
            }),
            cookie: cookieOptions
        });
        app.use(sessionParameters);

        app.use(express.static(path.join(__dirname, "client")));
        app.use("/apidocs", express.static(__dirname + "/docs"));
        app.use("/documentation", express.static(__dirname + "/docs"));

        // Add the CDN view helper
        app.locals.CDN = CDN();

        //expressjs integration
        if (config.get("datadog:express") === true) {
            var connectDatadog;
            try {
                var ddOptions = {
                    "response_code": true,
                    "tags": ["assurf:" + config.get("instance")]
                };

                connectDatadog = require("connect-datadog")(ddOptions);
            } catch(er){
                connectDatadog = null;
            }

            if (connectDatadog) {
                app.use(connectDatadog);
            }
        }

        var websockets;

        //register routes based on application type
        switch (applicationTitle) {
            case consts.APPLICATION.ASSurf:
                //api-assurf.brighterlink.io requires general routes without pages
                log.info("Going to run ASSURF");
                websockets = require("./server/bl-analyze-solar-surface/core/realtime/websockets");
                generalRoutes.register(app, [consts.GENERAL_ROUTES.AuthAPI, consts.GENERAL_ROUTES.GeneralAPI]);
                break;
            case consts.APPLICATION.EMSLite:
                //api-ressurf.brighterlink.io, requires general without pages and ems routes
                log.info("Going to run EMS Lite");
                websockets = require("./server/bl-ems-lite-surface/core/realtime/websockets");
                emsLiteSurfaceRoutes.register(app);
                generalRoutes.register(app, [consts.GENERAL_ROUTES.AuthAPI, consts.GENERAL_ROUTES.GeneralAPI]);

                if(runScheduler) {
                    //run scheduler jobs
                    schedulerJob.start();
                }

                break;
            case consts.APPLICATION.DeviceLogs:
                log.info("Going to run device logs receiver");
                //requires general auth routes without pages and general config routes
                websockets = require("./server/general/core/realtime/websockets");//for BPD
                generalRoutes.register(app, [consts.GENERAL_ROUTES.AuthAPI, consts.GENERAL_ROUTES.DeviceLogsAPI]);
                break;
            case consts.APPLICATION.Core:
                log.info("Going to run auth server");
                //brighterlink.io, requires general auth routes and general pages
                generalRoutes.register(app, [
                    consts.GENERAL_ROUTES.AuthAPI,
                    consts.GENERAL_ROUTES.Pages,
                    consts.GENERAL_ROUTES.DemoAPI
                ]);
                break;
            case consts.APPLICATION.Demo:
                log.info("Going to run Demo Box");
                generalRoutes.register(app, [
                    consts.GENERAL_ROUTES.AuthAPI,
                    consts.GENERAL_ROUTES.Pages,
                    consts.GENERAL_ROUTES.DemoAPI
                ]);
                break;
            default:
                //old brighterlink.brightergy.com and blmobile, requires all routes
                log.info("Going to run default");
                websockets = require("./server/general/core/realtime/websockets");

                generalRoutes.register(app, [
                    consts.GENERAL_ROUTES.AuthAPI,
                    consts.GENERAL_ROUTES.Pages,
                    consts.GENERAL_ROUTES.GeneralAPI
                ]);
                brighterViewRoutes.register(app);
                brighterSavingsRoutes.register(app);
                energyStarPortfolioManagerRoutes.register(app);
                loadResponseRoutes.register(app);
                programsAndProjectsRoutes.register(app);
                utilityManagerRoutes.register(app);
                verifiedSavingsRoutes.register(app);

                var enableAnalyze = config.get("enable:analyze");
                if (enableAnalyze) {
                    dataSenseRoutes.register(app);
                }
                helpAndUpdatesRoutes.register(app);
                break;
        }

        log.info("EMAIL PASS: " + config.get("email:password"));

        // catch 404
        app.use(function (req, res, next) {
            var err = new Error("Invalid API endpoint");
            err.url = req.protocol + "://" + req.get("host") + req.originalUrl;
            err.status = 404;

            /* If invalid url is api url, send error response in json format
             * else render 404 jade
             */
            var subDomains = req.subdomains;
            if (subDomains.indexOf("api") > -1) {
                res.send(new utils.serverAnswer(false, err));
            } else {
                res.render('404', {errors: err.message});
            }
        });

        // error handlers
        app.use(function (err, req, res, next) {
            //utils.setAccessControlAllowOrigin(req, res, true);
            res.status(err.status || 500);
            res.send(new utils.serverAnswer(false, err));
        });

        var workerId = cluster.isMaster ? "master" : cluster.worker.id;

        var server = app.listen(port, function () {
            log.info("Express server listening on port: %s worker id: %s", server.address().port, workerId);
            log.info("Environment: %s", config.get("env"));
            log.info('application: ' + applicationTitle);
            log.info("process pid: " + process.pid);
        });

        if(websockets) {
            var io = require("socket.io").listen(server,
                {
                    "transports": [
                        "websocket",
                        "flashsocket",
                        "htmlfile",
                        "xhr-polling",
                        "jsonp-polling",
                        "polling"],
                    "pingTimeout": 500000
                });

            websockets.run(io, sessionParameters);
        }
    });
}

//we will read kinesis records only in one master thread
//all messages will send to workers
function startKinesis() {
    if(applicationTitle === consts.APPLICATION.EMSLite) {
        kinesis.run(function(message) {

            if(argv.nocluster) {
                //process message in the same thread
                kinesis.recordCallback(message);
            } else {

                //send message to all cluster workers
                for (var id in cluster.workers) {
                    cluster.workers[id].send({
                        "type": KINESIS_RECORD,
                        record: message
                    });
                }
            }
        })
    }
}

var basePort =  process.env.PORT || config.get("port");
if (argv.nocluster) {
    startServer(basePort, true);
    startKinesis();
} else if (cluster.isMaster) {
    var isEMS = applicationTitle === consts.APPLICATION.EMSLite;
    if (isEMS) {
        //in case of cluster run scheduler jobs in master thread, if it is ems backend
        //scheduler jobs requires connection to db
        mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {
            schedulerJob.start();
        });
    }

    log.info("CPU count: %s", cpuCount);

    basePort = parseInt(basePort);
    var appPorts = {};

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i++) {
        var worker = cluster.fork();
        var workerPort = basePort + i;

        appPorts[worker.id] = workerPort;//save port for reusing if worker die

        worker.send({
            port: workerPort
        })
    }

    cluster.on("exit", function (diedWorker) {
        //Replace the dead worker
        log.info("Worker " + diedWorker.id + " died");
        var worker = cluster.fork();

        var reusedPort = appPorts[diedWorker.id];//find port to reuse
        delete appPorts[diedWorker.id];//delete died worker id
        appPorts[worker.id] = reusedPort;//save port with new worker id

        console.log(appPorts);

        worker.send({
            port: reusedPort
        })
    });

    startKinesis();
} else {
    process.on("message", function(msg) {

        if(msg.port) {
            startServer(msg.port, false);
        }

        if(msg.type === KINESIS_RECORD && msg.record) {
            kinesis.recordCallback(msg.record);
        }
    });
}
