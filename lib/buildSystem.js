"use strict";
let CMake = require("./cMake");
let CMLog = require("./cmLog");
let appCMakeJSConfig = require("./appCMakeJSConfig");
let path = require("path");
let _ = require("lodash");
let Toolset = require("./toolset");

function BuildSystem(options) {
    this.options = options || {};
    this.options.directory = path.resolve(this.options.directory || process.cwd());
    this.log = new CMLog(this.options);
    let appConfig = appCMakeJSConfig(this.options.directory, this.log);
    if (_.isPlainObject(appConfig)) {
        if (_.keys(appConfig).length) {
            this.log.verbose("CFG", "Applying CMake.js config from root package.json:");
            this.log.verbose("CFG", JSON.stringify(appConfig));
            this.options.arch = this.options.arch || appConfig.arch;
        }
    }
    this.log.verbose("CFG", "Build system options:");
    this.log.verbose("CFG", JSON.stringify(this.options));
    this.cmake = new CMake(this.options);
    this.toolset = new Toolset(this.options);
}

BuildSystem.prototype._ensureInstalled = async function () {
    try {
        await this.toolset.initialize(true);
    }
    catch (e) {
        this._showError(e);
        throw e;
    }
};

BuildSystem.prototype._showError = function (e) {
    if (this.log.level === "verbose" || this.log.level === "silly") {
        this.log.error("OMG", e.stack);
    }
    else {
        this.log.error("OMG", e.message);
    }
};

BuildSystem.prototype._invokeCMake = async function (method) {
    try {
        await this._ensureInstalled();
        return await this.cmake[method]();
    }
    catch (e) {
        this._showError(e);
        throw e;
    }
};

BuildSystem.prototype.getConfigureCommand = function () {
    return this._invokeCMake("getConfigureCommand");
};

BuildSystem.prototype.configure = function () {
    return this._invokeCMake("configure");
};

BuildSystem.prototype.getBuildCommand = function () {
    return this._invokeCMake("getBuildCommand");
};

BuildSystem.prototype.build = function () {
    return this._invokeCMake("build");
};

BuildSystem.prototype.getCleanCommand = function () {
    return this._invokeCMake("getCleanCommand");
};

BuildSystem.prototype.clean = function () {
    return this._invokeCMake("clean");
};

BuildSystem.prototype.reconfigure = function () {
    return this._invokeCMake("reconfigure");
};

BuildSystem.prototype.rebuild = function () {
    return this._invokeCMake("rebuild");
};

BuildSystem.prototype.compile = function () {
    return this._invokeCMake("compile");
};

module.exports = BuildSystem;
