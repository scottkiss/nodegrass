var nodegrass = require('../');
nodegrass.getFile('http://cdn.shopify.com/s/files/1/0051/4802/products/octodex_pack_preview_1024x1024.jpg?v=1327619907','d:/cccc/yep.jpg',function(e){
	if(e){
		console.log(e);
	}
	console.log('download success!');
});