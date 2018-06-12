
/*
 * GET home page.
 */
var path = require("path");

var http = require("http"),
	cheerio = require("cheerio"),
	iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper'),
	fs = require("fs"),
	saveImg = require("./saveImg"),
	async = require("async");
	
//config
//var downloadPath = "download/images/"; 

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  var html = path.normalize(__dirname + '/../views/index.html');
  res.sendfile(html);
};

exports.getBlog = function(req, res){
	var page = req.param("page") || 1;
	var _res = res;
	
	http.get("http://www.cnblogs.com/axes/default.html?page=" + page,function(res){
		var chunks = [], size = 0;
		var bufferHelper = new BufferHelper();
		
		res.on("data", function(chunk){
			chunks.push(chunk);
			size += chunk.length;
		});
		
		res.on("end", function(){
			var data = Buffer.concat(chunks, size);
				data = iconv.decode(data, 'gbk');
			var html = data.toString();
				// html = iconv.decode(html, 'gbk');
			var $ = cheerio.load(html);
			var blogs = [];
			
			for(var i=0; i<$('.postTitle2').length; i++){
				var blog = {};
				blog.title = $('.postTitle2').eq(i).html();
				blog.src = $('.postTitle2').eq(i).attr("href");
                blog.content = $(".c_b_p_desc").eq(i).html();
                
                var mess = $(".postDesc").eq(i).html().split("<a")[0].split(" ");

                blog.time = mess[2]+" "+mess[3];
                blog.read = mess[5];
                blog.say = mess[6];
                
                blogs.push(blog);
			}
			_res.json({
                blogs:blogs
            });
		}).on('error',function(e){
			console.log("error: " + e.message);
		});
	});
};

//下载cbbeta页面图片
exports.downloadCnbetaImg = function(callback){
	
	http.get("http://www.cnbeta.com",function(res){
		var bufferHelper = new BufferHelper();
		res.on("data", function(chunk){
			bufferHelper.concat(chunk);
		});
		
		res.on("end", function(){
			var data = iconv.decode(bufferHelper.toBuffer(),'utf-8')
			var $ = cheerio.load(data);
			var list = [], newsList = $("#allnews_all > div.items_area dl");
			newsList.each(function(index, e){
				//if(index < 5){
					var news = {};
					news.imgSrc = $(e).find("img").attr("src");
					// saveImg(news.imgSrc,function(){
						// console.log(news.imgSrc + "下载完成.");
					// });
					list.push(news.imgSrc);
				//}
			});
			//list = list.splice(0,3);
			console.log("需要下载的图片数量: " + list.length);
			//var beginDate = new Date().getTime();
			
			//集合
			/*
			async.each(list, function(url, callback){
				saveImg(url, callback);
			}, function(err){
				if(err){
					console.log(err);
				} else {
					var endDate = new Date().getTime();
					console.log("所有图片下载完成. " + (endDate-beginDate) + "ms");
				}
			});
			*/
			
			//队列
			var q = async.queue(function (task, callback) {
    			saveImg(task, callback);
			}, 10);
			var beginDate = new Date().getTime();
			q.drain = function() {
			    var endDate = new Date().getTime();
				console.log("所有图片下载完成. " + (endDate-beginDate) + "ms");
			}
			q.push(list);
		});
	});
	
};
