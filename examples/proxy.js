var ng = require('../'),
	 http=require('http'),
	 url=require('url');

	 http.createServer(function(req,res){
		var pathname = url.parse(req.url).pathname;
		
		if(pathname === '/'){
			ng.get('http://stackoverflow.com/',function(data){
				res.writeHeader(200,{'Content-Type':'text/html;charset=utf-8'});
				res.write(data+"\n");
				res.end();
				},null,'utf8');
			}
	 }).listen(8088);
	 console.log('server listening 8088...');