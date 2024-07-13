var logger = function(){
    var loggedFunctionArray = [];
    var loggerObj = {
    enableLog:false,
    showTiming :false,
    log: function(){
        var prefix = "";
        for (var i = 1; i < loggedFunctionArray.length; i++) 
        prefix += "\t";
        var args = [prefix + loggedFunctionArray[loggedFunctionArray.length - 1] + " : "];
        Array.prototype.push.apply(args,arguments);
        console.log.apply(console,args);
    },//log
    warn: function(){
        var prefix = "";
        for (var i = 1; i < loggedFunctionArray.length; i++) 
        prefix += "\t";
        var args = [prefix + loggedFunctionArray[loggedFunctionArray.length - 1] + " : "];
        Array.prototype.push.apply(args,arguments);
        console.warn.apply(console,args);
    },//warn
    error: function(){
        var prefix = "";
        for (var i = 1; i < loggedFunctionArray.length; i++) 
        prefix += "\t";
        var args = [prefix + loggedFunctionArray[loggedFunctionArray.length - 1] + " : "];
        Array.prototype.push.apply(args,arguments);
        console.warn.apply(console,args);
    },//error
    trace: function(){
        console.trace();
    },//trace
    dir: function(obj){
        console.dir(obj);
    },//dir
    assert:function(){
        console.assert.apply(console,arguments);
    },//assert
    count:function(){
        console.count.apply(console,arguments);
    },//assert

    profile:function(){
        console.profile.apply(console,arguments);
    },//profile
    profileEnd:function(){
        console.profileEnd();
    },//profileEnd
    startLog: function(functionName){
        loggedFunctionArray.push(functionName);
        console.group(functionName);
        this.log("Start");
        if(this.showTiming === true && console.time)
            console.time(functionName);
    },//startLog
    endLog: function(){
        this.log("End");
        if(this.showTiming === true && console.time)
            console.timeEnd(loggedFunctionArray.pop());
        else
            loggedFunctionArray.pop();
        console.groupEnd();
    }//endLog
    };//loggerObj
    //add a switch to all logger functions.
    for(attr in loggerObj)
    if(loggerObj.hasOwnProperty(attr) && typeof loggerObj[attr] == 'function'){
        loggerObj[attr] = function(func){
        return function(){
            if (this.enableLog === true && window.console != undefined)
            func.apply(this,arguments);
        };
        }(loggerObj[attr]);
    };
    return loggerObj;
}();