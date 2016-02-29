//conf

var nconf = require('nconf');

nconf.argv().env().file({file: 'config.json'});

//mongoose

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/limo');

//schema

var photoSchema = mongoose.Schema({
	photo_id: {type: Number, required: true},
	likers: {type: [Number], default: []}
}, {strict: true});

var userSchema = mongoose.Schema({
	user_id: {type: Number, required: true},
	photos: {type: [photoSchema], required: true}
}, {strict: true});

var User = mongoose.model('User', userSchema);

//express

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');

var app = express();

app.use(express.static('../client/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(function (err, req, res, next) { res.status(500).send({error: err.message}); });

//auth

var md5 = require('md5');

function authCheck(user, authKey) {
	return authKey == md5(nconf.get('app:id') + '_' + user + '_' + nconf.get('app:secret'));
}

//https

var https = require('https');

var httpsOptions = {
	pfx: fs.readFileSync(nconf.get('pfx:path')),
	passphrase: nconf.get('pfx:pass')
};

https.createServer(httpsOptions, app).listen(433);

//routes

app.post('/', function (req, res, next) {
	console.log(req.body);

	if (!authCheck(req.body.user_id, req.body.auth_key)) {
		return next({message: 'auth error'});
	}

	var clientUser = new User(req.body);

	var err = clientUser.validateSync();
	if (err) return next(err);

	User.findOneAndRemove({user_id: clientUser.user_id}, function (err, serverUser) {
		if (err) return next(err);

		var result = findUnlikers(clientUser, serverUser);

		clientUser.save(function (err) {
			if (err) return next(err);

			var responseBody = {response: result};

			console.log(responseBody);

			res.json(responseBody);
		});
	});
});

//logic

function findUnlikers(clientUser, serverUser) {
	if (!serverUser) return [];

	var clientPhotos = clientUser.photos;
	var serverPhotos = serverUser.photos;

	var unlikePhotos = [];

	clientPhotos.forEach(function (clientPhoto) {
		var pos = serverPhotos.map(function (serverPhoto) {return serverPhoto.photo_id;}).indexOf(clientPhoto.photo_id);
		if (pos == -1) return;
		var serverPhoto = serverPhotos[pos];
		var unlikers = serverPhoto.likers.filter(function (liker) {return clientPhoto.likers.indexOf(liker) == -1});
		if (unlikers.length == 0) return;
		unlikePhotos.push({
			photo_id: clientPhoto.photo_id, unlikers: unlikers
		});
	});

	//todo: remove this debug data
	unlikePhotos.push({
		photo_id: 358693393, unlikers: [176778820,209991765,53083705]
	});

	return unlikePhotos;
}
