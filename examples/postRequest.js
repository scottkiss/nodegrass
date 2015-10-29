var nodegrass = require('../');
nodegrass.post("http://127.0.0.1:8888/hello",function(data,status,headers){
	console.log(status);
	console.log(headers);
	console.log(data);
},null,{hello:"world"},'utf8').on('error', function(e) {
    console.log("Got error: " + e.message);
});