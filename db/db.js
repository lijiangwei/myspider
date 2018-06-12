/**
 * 数据库启动 
 */

var mongoose = require("mongoose"),
	config = require("../config/config.json");

mongoose.connect(config.db_url);
var db = mongoose.connection;

/**
 * 启动数据库 
 */
function start(){
	db.on('error', console.error.bind(console, 'connection error.'));
	db.once('open', function callback() {
		console.log("mongodb is open");
	});
}

/**
 * 关闭数据库 
 */
function stop(){
	db.close();
}

exports.start = start;
exports.stop = stop;

