// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var Event = require('cordova-plugin-chrome-apps-common.events');
var platform = cordova.require('cordova/platform');
var exec = cordova.require('cordova/exec');
var callbackWithError = require('cordova-plugin-chrome-apps-common.errors').callbackWithError;

var checkBufferSize = function (bufferSize) {

    if (bufferSize === null)
        return;

    if (bufferSize > 65535) {
        console.warn('Buffer size exceeds IPv4 UDP 65535 size limit.');
    }

    if (bufferSize > 4294967295) {
        console.warn('Buffer size exceeds IPv6 UDP 4294967295 size limit.');
    }
};

var testCallback = function () {
    console.log('testCallback success');
};

exports.create = function (properties, callback) {
    if (typeof properties == 'function') {
        callback = properties;
        properties = {};
    }
    var win = callback && function (socketId) {
        var createInfo = {
            socketId: socketId
        };
        callback(createInfo);
    };
    checkBufferSize(properties.bufferSize);
    exec(win, null, 'ChromeSocketsUdp', 'create', [properties]);
};

exports.test = function (socketId, data) {
    exec(testCallback, null, 'ChromeSocketsUdp', 'test', [socketId, data]);
};

exports.update = function (socketId, properties, callback) {
    checkBufferSize(properties.bufferSize);
    exec(callback, null, 'ChromeSocketsUdp', 'update', [socketId, properties]);
};

exports.setPaused = function (socketId, paused, callback) {
    exec(callback, null, 'ChromeSocketsUdp', 'setPaused', [socketId, paused]);
};

exports.bind = function (socketId, address, port, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callbackWithError(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'bind', [socketId, address, port]);
};
exports.startInterval = function (socketId, data, address, port, interval, callback, errorCallback) {
    var type = Object.prototype.toString.call(data).slice(8, -1);
    if (type != 'ArrayBuffer') {
        throw new Error('chrome.sockets.udp.send - data is not an ArrayBuffer! (Got: ' + type + ')');
    }
    var win = callback && function (bytesSent) {
        var sendInfo = {
            bytesSent: bytesSent,
            resultCode: 0
        };
        callback(sendInfo);
    };
    var fail = callback && function (error) {
        var sendInfo = {
            bytesSent: 0,
            resultCode: error
        };
        //callbackWithError(error, callback, sendInfo);
        errorCallback(error);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'startInterval', [socketId, address, port, data, interval]);
};
exports.stopInterval = function () {
    exec(null, null, 'ChromeSocketsUdp', 'stopInterval', []);
}
exports.updateIntervalData = function (data, extraLen, extraData, errorCallback) {
    var args = [data, extraLen];
    for (var i = 0; i < extraLen; i++)
        args.push(extraData[i]);
    var fail = errorCallback && function (error) {
        var sendInfo = {
            bytesSent: 0,
            resultCode: error.resultCode
        }
        errorCallback(error);
    };
    exec(null, fail, 'ChromeSocketsUdp', 'updateIntervalData', args);
}
exports.send = function (socketId, data, address, port, callback, errorCallback) {
    var type = Object.prototype.toString.call(data).slice(8, -1);
    if (type != 'ArrayBuffer') {
        throw new Error('chrome.sockets.udp.send - data is not an ArrayBuffer! (Got: ' + type + ')');
    }
    var win = callback && function (bytesSent) {
        var sendInfo = {
            bytesSent: bytesSent,
            resultCode: 0
        };
        callback(sendInfo);
    };
    var fail = callback && function (error) {
        var sendInfo = {
            bytesSent: 0,
            resultCode: error.resultCode
        };
        //callbackWithError(error.message, callback, sendInfo);
        errorCallback(error);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'send', [socketId, address, port, data]);
};

exports.close = function (socketId, callback) {
    exec(callback, null, 'ChromeSocketsUdp', 'close', [socketId]);
};

//-------------- Windows -------------------------------------------------------------------

exports.closeSocket = function () {
    exec(null, null, 'ChromeSocketsUdp', 'closeSocket', []);
};

exports.openSocket = function (successCallback, errorCallback, ip, port) {
    exec(successCallback, errorCallback, "ChromeSocketsUdp", "openSocket", [ip, port]);
};

exports.sendWin = function (successCallback, errorCallback, data) {
    exec(null, null, "ChromeSocketsUdp", "send", [data]);
};

exports.startWinInterval = function (successCallback, errorCallback, ip, port, data, interval) {
    exec(null, null, "ChromeSocketsUdp", "startWinInterval", [ip, port, data, interval]);
};

exports.stopWinInterval = function (successCallback, errorCallback) {
    exec(null, null, "ChromeSocketsUdp", "stopWinInterval", []);
};

exports.updateWinIntervalData = function (successCallback, errorCallback, newData) {
    exec(null, null, "ChromeSocketsUdp", "updateWinIntervalData", [newData]);
};

//-------------- Windows - End -------------------------------------------------------------------


exports.getInfo = function (socketId, callback) {
    var win = callback && function (result) {
        result.persistent = !!result.persistent;
        result.paused = !!result.paused;
        callback(result);
    };
    exec(null, null, "WindowsUdp", "closeSocket", []);
};

exports.getSockets = function (callback) {
    var win = callback && function (results) {
        for (var result in results) {
            result.persistent = !!result.persistent;
            result.paused = !!result.paused;
        }
        callback(results);
    };
    exec(win, null, 'ChromeSocketsUdp', 'getSockets', []);
};

exports.setBroadcast = function (socketId, enabled, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callback(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'setBroadcast', [socketId, enabled]);
};

exports.joinGroup = function (socketId, address, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callback(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'joinGroup', [socketId, address]);
};

exports.leaveGroup = function (socketId, address, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callback(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'leaveGroup', [socketId, address]);
};

exports.setMulticastTimeToLive = function (socketId, ttl, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callback(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'setMulticastTimeToLive', [socketId, ttl]);
};

exports.setMulticastLoopbackMode = function (socketId, enabled, callback) {
    var win = callback && function () {
        callback(0);
    };
    var fail = callback && function (error) {
        callback(error.message, callback, error.resultCode);
    };
    exec(win, fail, 'ChromeSocketsUdp', 'setMulticastLoopbackMode', [socketId, enabled]);
};

exports.getJoinedGroups = function (socketId, callback) {
    exec(callback, null, 'ChromeSocketsUdp', 'getJoinedGroups', [socketId]);
};

exports.onReceive = new Event('onReceive');
exports.onReceiveError = new Event('onReceiveError');

function registerReceiveEvents() {

    var win = function () {
        var info = {
            socketId: arguments[0],
            data: arguments[1],
            remoteAddress: arguments[2],
            remotePort: arguments[3]
        };
        exports.onReceive.fire(info);
    };

    // TODO: speical callback for android, DELETE when multipart result for
    // android is avaliable
    if (platform.id == 'android') {
        win = (function () {
            var data;
            var call = 0;
            return function (arg) {
                if (call === 0) {
                    data = arg;
                    call++;
                } else {
                    var info = {
                        socketId: arg.socketId,
                        data: data,
                        remoteAddress: arg.remoteAddress,
                        remotePort: arg.remotePort
                    };

                    call = 0;

                    exports.onReceive.fire(info);
                }
            };
        })();
    }


    var fail = function (info) {
        var error = function () {
            exports.onReceiveError.fire(info);
        };
        callbackWithError(info.message, error);
    };

    if (platform.id == 'windows') {
        fail = function (info) {
            var error = function () {

            };

        };
    }

    exec(win, fail, 'ChromeSocketsUdp', 'registerReceiveEvents', []);
}

require('cordova-plugin-chrome-apps-common.helpers').runAtStartUp(registerReceiveEvents);
