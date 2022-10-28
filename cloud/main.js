"use strict";

require("../core/server/general/models");
require("../core/server/bl-brighter-view/models");
require("../core/server/bl-data-sense/models");

var cluster = require("cluster"),
    express = require("express"),
    multer = require("multer"),
    path = require("path"),
    favicon = require("static-favicon"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    bodyParser = require("body-parser"),
    config = require("../config/environment"),
    log = require("./helpers/log")(module),

    coreUtils = require("../core/server/libs/utils"),
    mongoose = require("../core/node_modules/mongoose"),
    cpuCount = require("os").cpus().length,
    argv = require("minimist")(process.argv.slice(2)),
    coreConsts = require("../core/server/libs/consts"),

//routes
    generalRoutes = require("../core/server/general/routes"),
    aSSurfPageRoutes = require("./routes"),
    websockets = require("../core/server/bl-analyze-solar-surface/core/realtime/websockets"),
    healthChecker = require("../core/server/general/routes/apis/health-check");

function startServer(port, runScheduler) {
  mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {

    //we don't need schedular jobs on app server
    /*if(runScheduler) {
     schedulerJob.start();
     }*/

    var app = express();
    app.enable("trust proxy");
    app.use(function (req, res, next) {
      var domain = config.get("domain");
      var cookieDomain = config.get("session:cookiedomain");
      if (req.header("host")) {
        var origin = req.header("host").toLowerCase().indexOf(cookieDomain) > -1 ? req.headers.origin : domain;
        res.header("Access-Control-Allow-Origin", origin);
      }
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, viewerTZOffset");
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
      publicDir: path.join(__dirname, "../front"),
      viewsDir: path.join(__dirname, "/views"),
      domain: config.get("cdn:domain"),
      bucket: config.get("cdn:bucket"),
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
    app.set("views", [path.join(__dirname, "/views"), path.join(__dirname, "../core/server/views")]);
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
    app.locals.pretty = true;

    //session parameters

    var sessionParameters = session({
      name: config.get("session:cookiename"),
      secret: config.get("session:key"),
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({mongooseConnection: mongoose.connection}),
      cookie: {
        path: "/",
        domain: coreUtils.isDevelopmentEnv() ? null : config.get("session:cookiedomain"),
        httpOnly: true,
        secure: config.get("cookie:secure")
      }
    });

    app.use(sessionParameters);

    app.use(express.static(path.join(__dirname, "../front")));
    app.use("/apidocs", express.static(__dirname + "/docs"));
    app.use("/documentation", express.static(__dirname + "/docs"));
    app.use(healthChecker);

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
      } catch (er) {
        connectDatadog = null;
      }

      if (connectDatadog) {
        app.use(connectDatadog);
      }
    }

    if (coreUtils.isDevelopmentEnv()) {
      //include core apis if it is development mode or WB/BB/Staging
      //on production/WB/BB/Staging core apis will be runned on separate server

      var weatherSrvc = require("../core/node_modules/weather-service"),
          weatherWebSrvcConfig = config.get("services:weather"),
          dataProviderSrvc = require("../core/node_modules/dataprovider-service"),
          dataProviderWebSrvcConfig = config.get("services:dataprovider");

      weatherSrvc.init(weatherWebSrvcConfig);
      dataProviderSrvc.init(dataProviderWebSrvcConfig);

      generalRoutes.register(app, [
        /*
         coreConsts.GENERAL_ROUTES.Pages,*/
        coreConsts.GENERAL_ROUTES.AuthAPI,
        coreConsts.GENERAL_ROUTES.GeneralAPI
      ]);
    }
    aSSurfPageRoutes.register(app);

    // catch 404
    app.use(function (req, res, next) {
      var err = new Error("Invalid API endpoint");
      err.url = req.protocol + "://" + req.get("host") + req.originalUrl;
      err.status = 404;

      console.log(err);

      /* If invalid url is api url, send error response in json format
       * else render 404 jade
       */
      var subDomains = req.subdomains;
      if (subDomains.indexOf("api") > -1) {
        res.send(new coreUtils.serverAnswer(false, err));
      } else {
        res.render("404", {errors: err.message});
      }
    });

    // error handlers
    app.use(function (err, req, res, next) {
      //utils.setAccessControlAllowOrigin(req, res, true);
      res.status(err.status || 500);
      res.send(new coreUtils.serverAnswer(false, err));
    });

    var workerId = cluster.isMaster ? "master" : cluster.worker.id;

    var server = app.listen(port, function () {
      log.info("Express server listening on port: %s worker id: %s", server.address().port, workerId);
      log.info("Environment: %s", config.get("env"));
    });

    if (coreUtils.isDevelopmentEnv()) {
      //run websockets on the same instance if it is development mode
      //on production/WB/BB/Staging  websockets will be runned on separate server
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
var basePort = process.env.PORT || config.get("port");

if (argv.nocluster) {
  startServer(basePort, true);
} else if (cluster.isMaster) {
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
    });
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
    });
  });
} else {
  process.on("message", function (msg) {

    if (msg.port) {
      startServer(msg.port, false);
    }
  });
}
