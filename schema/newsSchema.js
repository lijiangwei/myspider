/**
 * 新闻资讯schema 
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var newsSchema = new Schema({
	id: {type:String,unique:true},
	title: String,		//标题
	author: String,		//作者
	publishTime: {type: Date, 'default': Date.now},		//发布时间
	readTimes: { type: Number, min: 0},		//阅读次数
	remindTimes: { type: Number, min: 0},		//引用次数
	src: String,				//原文地址
	imgSrc: String,				//图片地址
	content: String,
	reminds: { type: Number, },	//阅读数
	scores: { type: Number },		//分数
	eventScore: { type: Number },	//事件分
	zlScore: { type: Number }		//质量分
});

module.exports = newsSchema;
