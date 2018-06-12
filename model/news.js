
var mongoose = require("mongoose"),
	newsSchema = require('../schema/newsSchema');

var NewsModel = mongoose.model("NewsModel",newsSchema);

/**
 * 保存新闻到数据库 
 * @param {newsModel} news
 * @param {Function} callback
 */
function saveNews(news, callback){
	NewsModel.findOne({"id": news.id},function(err,item){
		if(err){
			callback(err);
			return;
		}
		if(!item){
			var _news = new NewsModel(news);
			_news.save(function(err){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	});
}

/**
 * 查询新闻列表 
 * @param {Function} callback
 */
function findNewsList(options,callback){
	NewsModel.find()
		.skip(options.currentIndex)
		.limit(options.pageSize)
		.exec(function(err,list){
			if(err){
				console.log(err);
				callback(null,null);
			}else{
				NewsModel.count(function(err,count){
					if(err){
						console.log(err);
						//callback(err,null,null);
					}
					callback(list,count);
				});
			}
		});
}

exports.saveNews = saveNews;
exports.findNewsList = findNewsList;
