var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	room:{
		type:String,
		required:true
	},
	branch:{
		type:String
	},
	username:{
		type:String,
		required:true
	},
	password:{
		type:String
	},
	debt:{
		type:Number,
		default:0
	}
},{collection:'users'});

var User = module.exports =mongoose.model('User',userSchema);