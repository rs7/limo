//conf

var nconf = require('nconf');

nconf.argv().env().file({file: 'config.json'});

//mongoose

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/limo');

//schema

var likesSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    likes: {type: [Number], default: []}
}, {strict: true});

var snapshotSchema = mongoose.Schema({
    date: {type: Date, required: true},
    items: {type: [likesSchema], default: []}
});

var historySchema = mongoose.Schema({
    photo: {type: Number, required: true},
    user: {type: Number, required: true},
    date : {type: Date, default: Date.now},
    period: {
        from : {type: Date, required: true},
        to : {type: Date, required: true}
    }
}, {strict: true});

var userSchema = mongoose.Schema({
    id: {type: Number, required: true},
    snapshot: {type: snapshotSchema, required: true},
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

    if (authCheck(req.query.user_id, req.query.auth_key)) {
        return next();
    }

    res.status(403).json({error: 'auth error'});
});

app.use(function (err, req, res, next) {
    res.status(500).send({error: err.message});
});

app.listen(1337, function () {
    console.log('1337 listening');
});

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

https.createServer(httpsOptions, app).listen(433, function () {
    console.log('433 listening');
});

//routes

//save snapshot
app.post('/api', function (req, res, next) {
    var input = req.body;

    console.log(input);

    var userId = input.user_id;
    var snapshot = {
        date: new Date(),
        items: input.snapshot
    };

    User.findOne({id: userId}, function (err, user) {
        if (err) return next(err);

        if (!user) {
            user = new User({
                id: userId,
                snapshot: {
                    date: new Date(0),
                    items: []
                },
                history: []
            });
        }

        var history = createHistory(user.snapshot, snapshot);

        console.log(history);

        history.forEach(function (like) {
            user.history.unshift(like);
        });

        snapshot.items = snapshot.items.filter(function (item) {
            return item.likes.length > 0;
        });

        user.snapshot = snapshot;
        user.last_seen = new Date();

        user.save(function (err) {
            if (err) return next(err);

            res.json({response: 1});
        });
    });
});

//get history
app.get('/api', function (req, res, next) {
    var input = req.query;

    console.log(input);

    var userId = input.user_id;
    var page = input.page;

    User.findOne({id: userId}, function (err, user) {
        if (err) return next(err);

        if (!user) {
            res.status(404).json({error: 'not fount user'});
            return;
        }

        var count = 10;
        var offset = page * count;
        var history = user.history.slice(offset, offset + count).map(function (like) {
            return {
                id: like._id.valueOf(),
                photo: like.photo,
                user: like.user,
                date: like.date,
                period: like.period
            };
        });

        console.log(history);

        res.json({response: history});
    });
});

//logic

var diff = require('simple-array-diff');

function createHistory(snapshotOld, snapshotNew) {
    var period = {
        from: snapshotOld.date,
        to: snapshotNew.date
    };

    var photosOld = snapshotOld.items.map(function (like) {
        return like.photo;
    });
    var photosNew = snapshotNew.items.map(function (like) {
        return like.photo;
    });

    var photosMapOld = mapByField(snapshotOld.items, 'photo');
    var photosMapNew = mapByField(snapshotNew.items, 'photo');

    var photosCom = diff(photosOld, photosNew).common;

    var history = [];

    photosCom.forEach(function (photo) {
        var likesOld = photosMapOld[photo].likes;
        var likesNew = photosMapNew[photo].likes;

        var unlikes = diff(likesOld, likesNew).removed;

        if (unlikes.length == 0) {
            return;
        }

        unlikes.forEach(function (user) {
            history.push({
                photo: photo,
                user: user,
                period: period
            });
        });
    });

    return history;
}

function mapByField(array, field) {
    var map = {};

    array.forEach(function (item) {
        map[item[field]] = item;
    });

    return map;
}
