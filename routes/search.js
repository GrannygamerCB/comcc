var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

var Users = mongoose.model('Users');
var Comics = mongoose.model('Comics');

//Case when user tries to access user page without searching
router.get('/', function(req, res, next) {
	if (req.session.login) {
		res.render('search', {nosearch: true});
	}
	else{
		res.redirect('/');
	}
});

router.post('/', function(req, res, next) {
	if (req.session.login) {
		//Check which radio button was pressed
		//If user, search by email or by display name
		if (req.body.searchtype == 'user'){
			Users.find(
				//Find users based on email or displayname
				{$or: [{username: new RegExp('.*'+req.body.search+'.*', "i")}, {displayName: new RegExp('.*'+req.body.search+'.*', "i")}]},
				'username displayName',
				//{username: new RegExp('.*'+req.body.search+'.*', "i")},
				function(err, users){
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
					if (users.length == 0) res.render('search', {title: 'COMC', exists: false, searchtype: 'user', searched:req.body.search, login: req.session.login});
					else res.render('search', {exists: true, searchtype: 'user', data: users, searched:req.body.search, login: req.session.login});
				}
			);
		}
		//If comic, search by name, genre or description
		else if (req.body.searchtype == 'comic'){
			Comics.find(
				//Find comics based on title, description or genre
				{$or: [
					{title: new RegExp('.*'+req.body.search+'.*', "i")}, 
					{author: new RegExp('.*'+req.body.search+'.*', "i")}, 
					{description: new RegExp('.*'+req.body.search+'.*', "i")}, 
					{genre: new RegExp('.*'+req.body.search+'.*', "i")}
				]},
				'_id title author genre',
				function(err, comics){
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
					if (comics.length == 0) res.render('search', {title: 'COMC', exists: false, searchtype: 'comic', searched:req.body.search, login: req.session.login});
					else res.render('search', {exists: true, searchtype: 'comic', data: comics, searched:req.body.search, login: req.session.login});
				}
			);
		};
	}
	else{
		res.redirect('/');
	}
});

module.exports = router;