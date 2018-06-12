/**
 * 查询新闻服务 
 */

var http = require("http"),
	cheerio = require("cheerio"),
	iconv = require('iconv-lite'),
	BufferHelper = require('bufferhelper'),
	NewsModel = require("../model/news"),
	async = require("async");

/**
 * 查询新闻列表 
 * @param {Object} options
 * @param {Function} callback
 */
function queryNewsList(options,callback){
	options.currentIndex = options.currentIndex || 0;
	options.pageSize = options.pageSize || 10;
	NewsModel.findNewsList(options,function(list,count){
		if(!list) list = [];
		var data = {
			"List": list,
			"currentIndex": options.currentIndex,
			"recordNumber": count
		};
		callback(data);
	});
} 

/**
 * 获取cnBeta新闻 
 */
function saveNewsList(){
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
				var news = {};
				news.id = $(e).attr("id"); 
				news.title = $(e).find("dt > a").text();
				news.author = ($(e).find("dt span").eq(0).text()).split(" ")[0];
				news.publishTime = $(e).find("dt em").eq(0).text();
				news.readTimes = $(e).find("dt em").eq(1).text();
				news.remindTimes = $(e).find("dt em").eq(2).text();
				news.src = $(e).find("dt > a").attr("href");
				news.imgSrc = $(e).find("img").attr("src");
				news.content = $(e).find("div.newsinfo > p").text();
				
				news.reminds = $(e).find("ul > li").eq(1).find("em").text(); //意见
				news.scores = $(e).find("ul > li").eq(2).find("em").text();		//打分次数
				news.eventScore = $(e).find("ul > li").eq(3).find("em").text();		//事件分
				news.zlScore = $(e).find("ul > li").eq(4).find("em").text();	//质量分
				list.push(news);
			});
			async.each(list,function(news, callback){
				NewsModel.saveNews(news, function(err){
					if(err){
						console.log(err);
					} 
					callback();
				});
			},function(err){
				if(err){
					console.log(err);
				} else {
					console.log("抓取结束.");
				}
			});
		});
	}).on("error",function(err){
		console.log(err.message);
	});
}

exports.saveNewsList = saveNewsList;
exports.queryNewsList = queryNewsList;