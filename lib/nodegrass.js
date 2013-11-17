/*!
 * Http-Https Request - nodegrass
 * Copyright(c) 2012 - 2013 Sk ScottKiss
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    iconv = require('iconv-lite'),
	 fs = require('fs');



function NodeGrass(){}

//download file
NodeGrass.prototype.getFile = function(url,output,callback){
   var header = {accept : '*/*'};
   var options = {
        host:getHost(url),
        port:getPort(url),
        path:getPath(url),
        headers:header
    };
	 var content = '';
	 var protocol = getProtocol(url);
    protocol.get(options,function(res){
            res.setEncoding('binary');
            var status = res.statusCode;
            var headers = res.headers;
            res.on('data',function(chunk){
                content += chunk;
            });
            res.on('end',function(){
						 var resp = new Buffer(content,'binary');
                fs.writeFile(output, resp, function(e) {
			         if(typeof callback === 'function'){
		                callback(e);
		            }
       
                 });
            });
        });

}
//Get Method Request
//Support HTTP and HTTPS request,and Automatic recognition
//@Param url
//@Param callback
NodeGrass.prototype.get = function(url,callback, reqheaders, charset){
    var protocol = getProtocol(url);
    var _defaultCharSet = 'utf8';
    
    if(typeof charset === 'string' ){
        _defaultCharSet = charset;
    }
    if(typeof(reqheaders) === "string" && charset === undefined) {
        _defaultCharSet = reqheaders;
    }
    var newheader = {};
    if(reqheaders !== undefined && typeof(reqheaders) === "object") {
        for(var ele in reqheaders) {
            newheader[ele.toLowerCase()] = reqheaders[ele];
        }
    }
    newheader["content-length"] = 0;
    var options = {
        host:getHost(url),
        port:getPort(url),
        path:getPath(url),
        headers:newheader
    };
	 
    if(protocol === http || protocol === https){
       return _sendGetReq(protocol,options,_defaultCharSet,callback);
    }else{
        throw "sorry,this protocol do not support now";
    }

}

//Post Method Request
//Support HTTP and HTTPS request,and Automatic recognition
//@Param url
//@Param callback
//@Param header
//@param postdata
NodeGrass.prototype.post = function(url,callback,reqheaders,data,charset){
    var protocol = getProtocol(url);
    var _defaultCharSet = 'utf8';
    
    if(typeof charset === 'string' ){
        _defaultCharSet = charset;
    }

    data = querystring.stringify(data);
    var options={
            host:getHost(url),
            port:getPort(url),
            path:getPath(url),
            method:'POST',
            headers:reqheaders
      };
    if(protocol === http || protocol === https){
        return _sendPostReq(protocol,data,options,_defaultCharSet,callback)
    }else{
        throw "sorry,this protocol do not support now";
    }
}

//Parse the url,get the path
//e.g. http://www.google.com/path/another -> /path/another
function getPath(url){
    var pathPattern = /\w+:\/\/([^\/]+)(\/.+)(\/$)?/i;
    var fullPath = url.match(pathPattern);
    return fullPath?fullPath[2]:'/';
}


function _sendPostReq(protocol,data,options,_defaultCharSet,callback){
    var content = "";
    var req = protocol.request(options,function(res){
    var status = res.statusCode;
    var headers = res.headers;
    if(_defaultCharSet==="gbk"){
        res.setEncoding('binary');
    }else{
        res.setEncoding(_defaultCharSet);
    }
    res.on('data',function(chunk){
        content+=chunk;
    });
    res.on('end',function(){
        if(_defaultCharSet==="gbk"){
            content = iconv.decode(new Buffer(content,'binary'),'gbk');
         }
        callback(content,status,headers);
        });
    });
    req.write(data+"\n");
    req.end();
    return req;
}

function _sendGetReq(protocol,options,_defaultCharSet,callback){
    var content = "";
    return protocol.get(options,function(res){
        if(_defaultCharSet==="gbk"){
            res.setEncoding('binary');
        }else{
            res.setEncoding(_defaultCharSet);
        }
        var status = res.statusCode;
        var headers = res.headers;
        res.on('data',function(chunk){
            content += chunk;
        });
        res.on('end',function(){
        if(_defaultCharSet==="gbk"){
            content = iconv.decode(new Buffer(content,'binary'),'gbk');
        }
		
        callback(content,status,headers);
        });
    });
    
}
//Parse the url, get the port
//e.g. http://www.google.com/path/another -> 80
//     http://foo.bar:8081/a/b -> 8081
function getPort(url) {
    var hostPattern = /\w+:\/\/([^\/]+)(\/)?/i;
    var domain = url.match(hostPattern);

    var pos = domain[1].indexOf(":");
    if(pos !== -1) {
        domain[1] = domain[1].substr(pos + 1);
        return parseInt(domain[1]);
    } else if(url.toLowerCase().substr(0, 5) === "https") return 443;
    else return 80;
}

//Parse the url,get the host name
//e.g. http://www.google.com/path/another -> www.google.com
function getHost(url){
    var hostPattern = /\w+:\/\/([^\/]+)(\/)?/i;
    var domain = url.match(hostPattern);

    var pos = domain[1].indexOf(":");
    if(pos !== -1) {
        domain[1] = domain[1].substring(0, pos);
    }
    return domain[1];
}

//Get the Protocol
//http://www.google.com/path/another => http
function getProtocol(url){
    return url.substring(0,url.indexOf(":")) === 'https' ? https : http;;
}
var nodegrass = new NodeGrass();
module.exports = nodegrass;
