/*!
 * Http-Https Request - nodegrass
 * Copyright(c) 2012 Sk ScottKiss
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var http = require('http'),
	 https = require('https'),
	 querystring = require('querystring'),
	 iconv = require('iconv-lite');
	 


function NodeGrass(){}
//Get Method Request
//Support HTTP and HTTPS request,and Automatic recognition
//@Param url
//@Param callback
NodeGrass.prototype.get = function(url,callback,charset){
	 var protocol = getProtocol(url);
	 var _defaultCharSet = 'utf8';
	 var content = "";
	 if(typeof charset === 'string' ){
			_defaultCharSet = charset;
	 }
	// console.log(_defaultCharSet);
	 if(protocol === 'http'){
		return http.get(url,function(res){
			if(_defaultCharSet==="gbk"){
				res.setEncoding('binary');
			}else{
				res.setEncoding(_defaultCharSet);
			}
			var status = res.statusCode;
			var headers = res.headers;
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
		
	 }else if(protocol === 'https'){
		return https.get({host:getHost(url),path:getPath(url)},function(res){
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
	 var content = "";
	 if(typeof charset === 'string' ){
			_defaultCharSet = charset;
	 }
	 
	//console.log(reqheaders);
	data = querystring.stringify(data);
	console.log(data);
	if(protocol==='http'){
		var options={
			host:getHost(url),
			port:80,
			path:getPath(url),
			method:'POST',
			headers:reqheaders
		};
		var req = http.request(options,function(res){
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
		
		
	 }else if(protocol==='https'){
		var options={
			host:getHost(url),
			port:443,
			path:getPath(url),
			method:'POST',
			headers:reqheaders
		};
		var req = https.request(options,function(res){
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

//Parse the url,get the host name
//e.g. http://www.google.com/path/another -> www.google.com
function getHost(url){
	var hostPattern = /\w+:\/\/([^\/]+)(\/)?/i;
	var domain = url.match(hostPattern);
	//console.log(domain[1]);
	return domain[1];
}

//Get the Protocol
//http://www.google.com/path/another => http
function getProtocol(url){
	return url.substring(0,url.indexOf(":"));
}
var nodegrass = new NodeGrass();
nodegrass.NodeGrass = NodeGrass;
module.exports = nodegrass;

