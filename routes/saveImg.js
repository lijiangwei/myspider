/*
 *  保存图片
 * @param url 图片路径
 * @param callback
 */
var http = require("http"),
	fs = require("fs");

var downloadPath = "download/images/";

function saveImg(url, callback){	'use strict';
	console.log("开始下载图片: " + url);
	var fileName = downloadPath + url.substr(url.lastIndexOf("/") + 1);
	http.get(url, function(res){
		var imgData = "";
		res.setEncoding("binary");
		res.on("data",function(chunk){
			imgData += chunk;
		});
		res.on("end",function(){
			fs.writeFile(fileName, imgData, "binary", function(err){
				if (err){
					console.log(err);
					callback(err);	
				} else {
					console.log(url + "下载完成.");
					callback();
				}
			});
		});
	});
}

module.exports = saveImg;
