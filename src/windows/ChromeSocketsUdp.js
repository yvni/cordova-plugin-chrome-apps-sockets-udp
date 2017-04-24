var cordova = require('cordova');
var socketsSample = {};

var msgRecieved = function () {
        console.log("ping");
    };
module.exports = {
    openSocket: function(successCallback, errorCallback,args){
        var ip = args[0];
        var port = args[1];
        var onError = function (reason) {
            if (socketsSample.bindingToService) {
                socketsSample.listener = null;
                socketsSample.bindingToService = false;
            }
            if (!socketsSample.closing) {
                WinJS.log && WinJS.log(reason, "sample", "error");
            }
			errorCallback();
        };
        var hostName;
        try {
            hostName = new Windows.Networking.HostName(ip);
        } catch (error) {
            WinJS.log && WinJS.log("Error: Invalid host name.", "sample", "error");
            return;
        }
        socketsSample.clientSocket = new Windows.Networking.Sockets.DatagramSocket();
        socketsSample.clientSocket.addEventListener("messagereceived", msgRecieved);
        socketsSample.clientDataWriter = null;
        socketsSample.closing = false;
        socketsSample.serviceNameAccept = port;
        socketsSample.hostNameConnect = hostName;
        socketsSample.serviceNameConnect = port;
        socketsSample.clientSocket.connectAsync(socketsSample.hostNameConnect, socketsSample.serviceNameConnect).done(function () {
            WinJS.log && WinJS.log("Client: connection completed.", "sample", "status");
            socketsSample.connected = true;
        }, onError);
    },
    send: function (successCallback, errorCallback,args){
        data = args[0];
            var onError = function(reason) {
                // When we close a socket, outstanding async operations will be canceled and the
                // error callbacks called.  There's no point in displaying those errors.
                if (!socketsSample.closing) {
                    WinJS.log && WinJS.log(reason, "sample", "error");
                }
            };
        if (socketsSample.clientDataWriter === null) {
            socketsSample.clientDataWriter =
                new Windows.Storage.Streams.DataWriter(socketsSample.clientSocket.outputStream);
            }
        var len = data.byteLength;
        var bytearray = new Uint8Array(len);
        var view = new DataView(data);
        for (var i = 0; i < len; ++i) {
            bytearray[i] = view.getUint8(i);
        }
        socketsSample.clientDataWriter.writeBytes(bytearray);

        socketsSample.clientDataWriter.storeAsync().done(function () {
            console.log("in send done");
        }, onError);
    },
    closeSocket: function (successCallback, errorCallback,args){
        socketsSample.closing = true;
        if (socketsSample.listener) {
            socketsSample.listener.close();
        }
        if (socketsSample.clientSocket) {
            socketsSample.clientSocket.close();
            socketsSample.clientSocket.removeEventListener("messagereceived", msgRecieved);
            socketsSample.clientSocket = null;
        }
        if (socketsSample.clientDataWriter) {
            socketsSample.clientDataWriter.close();
            clientDataWriter = null;
        }
        if (socketsSample.listenerOutputStream) {
            socketsSample.listenerOutputStream.close();
            socketsSample.listenerOutputStream = null;
        }
        socketsSample.connected = false;
    }
};
cordova.commandProxy.add("ChromeSocketsUdp", module.exports);
