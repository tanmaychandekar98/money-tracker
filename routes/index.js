var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var passport = require('passport');

var User = require('../models/User');
var Notif = require('../models/Notif');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Local Money Tracker' });
});

router.get('/userlist', function(req,res){
	User.find({},function(err,users){
		res.render('userlist',{
			users:users
		});
	})
});

router.get('/register',function(req,res){
	res.render('register',{title:"Register here"});
});

router.get('/login',function(req,res){
	res.render('login',{title:"Login"});
});

router.post('/login',function(req,res,next){
	passport.authenticate('local',{
		successRedirect:'/userlist',
		failureRedirect:'/login',
		failureFlash:true
	})(req,res,next);
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/login');
});

router.get('/user/:id',function(req,res){
	User.findById(req.params.id,function(err,user){
		if (err) {throw err;}
		Notif.find({"recipient.id":user._id},function(err,recipientnotifs){
			Notif.find({"applicant.id":user._id},function(err,applicantnotifs){
				if (err) {throw err;}
				res.render('profile',{
				userl:user,
				r_notifs:recipientnotifs,
				a_notifs:applicantnotifs
				});
			});
		});
	});
});

router.post('/adduser',function(req,res){
	var user= new User();
	user.name=req.body.name;
	user.room=req.body.room;
	user.branch=req.body.branch;
	user.username=req.body.username;
	user.password=req.body.password;
	user.save(function(err){
		if (err) {
			console.log(err);
			res.send(err);
		}else{
			res.redirect('/login');
		}
	});
});


router.post('/request/:id',function(req,res){
	User.findById(req.params.id,function(err,user){
		if(err) res.send(err);
		var notif1 = new Notif();
		notif1.subject=req.body.subject;
		notif1.recipient.id=req.params.id;
		notif1.applicant.id=req.user._id;
		notif1.recipient.name=user.name;
		notif1.applicant.name=req.user.name;
		notif1.amount=req.body.amount;
		notif1.save(function(err){
			if (err) {
				console.log(err.message);
				res.redirect('back');
			}
			else {
				res.redirect('back');
			}
		});
	});
	
});

router.get('/user/accept/:id',function(req,res){
	Notif.findById(req.params.id,function(err,notif){
		User.findById(notif.recipient.id,function(err,user){
			user.debt+=Number(notif.amount);
			user.save();
			notif.accept=true;
			notif.save(function(err){
				res.redirect('back');
			});
		});
	});
});

router.get('/user/reject/:id',function(req,res){
	Notif.findById(req.params.id,function(err,notif){
		notif.reject=true;
		notif.save(function(err){
			if (err) {throw err;}
			res.redirect('back');
		});
		
	});
});

router.get('/user/accept/done/:id',function(req,res){
	Notif.findById(req.params.id,function(err,notif){
		if (err) {throw err;}
		notif.done=true;
		User.findById(notif.recipient.id,function(err,user){
			if (err) {throw err;}
			user.debt-=notif.amount;
			user.save();
		});
		notif.save(function(err){
			if (err) {throw err;}
			res.redirect('back');
		});
	});
});

module.exports = router;
