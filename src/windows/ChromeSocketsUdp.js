
module.exports=
    {
    test: function (testCallback, null, args){
        console.log("testtttt");
        console.dir(args);
    }
    registerReceiveEvents: function(args){
        console.log("registerReceiveEvents");
    }
    
}
require("cordova/exec/proxy").add("ChromeSocketsUdp", module.exports);