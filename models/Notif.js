var mongoose = require('mongoose');

var notifSchema = mongoose.Schema({
	subject:{
		type:String,
		required:true
	},
	applicant:{
		name:{type:String},
		id:{type:String,required:true}
	},
	recipient:{
		name:{type:String},
		id:{type:String,required:true}
	},
	amount:{
		type:Number,
		required:true,
		default:0
	},
	accept:{
		type:Boolean,
		default:false
	},
	reject:{
		type:Boolean,
		default:false
	},
	done:{
		type:Boolean,
		default:false
	}
},{collection:'notif'});

var Notif = module.exports =mongoose.model('Notif',notifSchema);