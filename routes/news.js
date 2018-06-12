/**
 * 新闻路由 
 */

var http = require("http"),
	newsService = require("../service/news");

/**
 * 查询新闻列表交易 
 * @param {Object} req
 * @param {Object} res
 */
function queryNewsList(req, res){
	newsService.queryNewsList(req.body, function(data){
		res.json(data)
	});
}

exports.queryNewsList = queryNewsList;
