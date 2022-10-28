"use strict";

function getConfig(mainDir, cwd) {
    if (!cwd) {
        cwd = "";
    }

    return {
        basePath: cwd + mainDir,
        Default: {
            serverRoot: cwd + mainDir + "server",
            testRoot: cwd + mainDir + "test"
        },
        TestVals: {
            knownObjectId: "52ffef5e3242c4a82909c53f"
        },
        database: {
            host: "localhost",
            port: 27017,
            name: "thoughts"
        },
        server: {
            port: 8080
        }
    };
}
module.exports = function (key) {
    var mainDir = "/";
    var cwd = process.env.HOME;
    var configs = getConfig(mainDir,cwd);
    return configs[key];
};