"use strict";

// TODO:: moved to core-service

var _ = require("lodash");

// check if the end of date range is now ...


function Locker() {
    this.defaultTimeout = 5000; // 5 seconds
    this.locks = {};
}


/**
 * Monkey patcher for socket.emit so that channel lock was removed when data emmited
 *
 * @param socketIO socket to patch
 * @return patched socket
 */

Locker.prototype.bindSocket = function(socketIO) {
    // Monkey patch socket
    socketIO.__emitBeforeChannelLockerSocket = socketIO.emit;
    this._socket = socketIO.id; // For testing purposes

    var channelLocker = this;

    socketIO.emit = function(event, message) {
        // Need to lock the channel when data is emited
        //console.log("Unlock emit", event, channelLocker._socket);
        channelLocker.unlock(event);
        this.__emitBeforeChannelLockerSocket.apply(this, arguments);
    };
    return socketIO;
};


Locker.prototype.unlock = function(event) {
    var key = event;
    if (!_.isUndefined(this.locks[key])) {
        // when event is emited back to user lock is released
        clearTimeout(this.locks[key]);
        delete this.locks[key];
    }
};


Locker.prototype.tryLockAndRun = function(event, eventEmitter, _timeout) {
    var shouldRun = false;
    var timeout = _timeout ? _timeout : this.defaultTimeout;
    var keys;
    if (_.isArray(event)) {
        keys = event;
    } else {
        keys = [event];
    }
/*
    _.forEach(event, function(key){
        if (_.isUndefined(this.locks[key])) {
            this.locks[key] = setTimeout((function() {
                this.unlock(event);
            }).bind(this), timeout);
            shouldRun = true; // Run if at least one channel is vacant
        }
    }, this);
*/

    keys.forEach(function(key) {
        if (_.isUndefined(this.locks[key])) {
            this.locks[key] = setTimeout((function() {
                // console.log("Unlock timeout", event, this._socket);
                this.unlock(event);
            }).bind(this), timeout);
            // console.log("Lock", event, this._socket);
            shouldRun = true; // Run if at least one channel is vacant
        }
    }.bind(this));

    if (shouldRun) {
        eventEmitter();
    }
    // console.log("Try lock", event, this._socket);
};


exports.Locker = Locker;