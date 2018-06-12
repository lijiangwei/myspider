/**
 * mongodb 数据库测试
 */

var mongoose = require("mongoose");

function init() { 'use strict';
	
	mongoose.connect("mongodb://localhost/test");
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error.'));
	db.once('open', function callback() {

		var kittySchema = mongoose.Schema({
			name : String
		});
		kittySchema.methods.speak = function(){
			var greeting = this.name ? "Meow name is " + this.name : "I don`t hava a name";
			console.log(greeting);
		}
		var kittyModel = mongoose.model('kittyModel', kittySchema);
		var kitty = new kittyModel({
			name : 'kitty'
		});
		
		var fluffy = new kittyModel({ name: 'fluffy' });
		fluffy.save(function(err, fluffy){
			if(err) return console.error(err);
			fluffy.speak();	
		});
		
		kittyModel.find(function(err, kittys){
			if(err) return console.error(err);
			console.log(kittys);
		});
		db.close();
	});
}

exports.init = init;

