//conf

var nconf = require('nconf');

nconf.argv().env().file({file: 'config.json'});

//mongoose

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/limo');

//schema

var historySchema = mongoose.Schema({
	photo: Number,
	user: Number,
	date: {type: Date, required: true}
}, {strict: true});

var photoSchema = mongoose.Schema({
	photo_id: {type: Number, required: true},
	likers: {type: [Number], default: []}
}, {strict: true});

var userSchema = mongoose.Schema({
	user_id: {type: Number, required: true},
	photos: {type: [photoSchema], required: true},
	last_seen: {type: Date, required: true},
	history: {type: [historySchema], default: []}
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

app.use(function (req, res, next) {
	if (authCheck(req.body.user_id, req.body.auth_key)) {
		return next();
	}

	res.status(403).json({error: 'auth error'});
});

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

	var input = req.body;

	User.findOne({user_id: input.user_id}, function (err, userVO) {
		if (err) return next(err);

		if (!userVO) {
			userVO = new User({
				user_id: input.user_id,
				last_seen: new Date(0)
			});
		}

		findUnlikers(input.photos, userVO.photos).forEach(function (photo) {
			photo.unlikers.forEach(function (user) {
				var item = {
					photo: photo.photo_id,
					user: user,
					date: new Date()
				};
				userVO.history.push(item);
			});
		});

		var response = {
			items: userVO.history,
			last_seen: userVO.last_seen
		};

		userVO.photos = input.photos;
		userVO.last_seen = new Date();

		userVO.save(function (err) {
			if (err) return next(err);

			console.log(response);

			res.json({response: response});
		});
	});
});

//logic

function findUnlikers(clientPhotos, serverPhotos) {
	if (!serverPhotos) return [];

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

	return unlikePhotos;
}
