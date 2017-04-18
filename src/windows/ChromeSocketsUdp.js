
module.exports=
    {
    function test(testCallback, null, args){
        console.log("testtttt");
        console.dir(args);
    }
    
}
require("cordova/exec/proxy").add("ChromeSocketsUdp", module.exports);