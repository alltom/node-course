// postgres

var pg = require('pg');
var pgconnstring = "tcp://node-course:node-course password@alltom.com/node-course";

pg.connect(pgconnstring, function (err, client, done) {
    if (err) {
        console.log('err 1', err);
        done();
    } else {
        client.query('SELECT password FROM users WHERE username=$1', ['tom'], function (err, result) {
            if (err) {
				console.log('err 2', err);
                // error!
            } else if (result.rows.length < 1) {
                // no user found with that username!
				console.log('no users');
            } else {
                console.log('password', result.rows[0].password)
            }
            done();
        });
    }
});

// redis

var redis = require('redis');
var redisClient = redis.createClient(6379, 'alltom.com');

// HTTP

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var cookieParser = express.cookieParser('some secret');
var sessionStore = new express.session.MemoryStore;

var messages = [];

//app.configure(function () {
    app.use(express.logger());
    app.use(express.static(__dirname + '/public'));
    app.use(cookieParser);
    app.use(express.bodyParser());
    app.use(express.session({ key: 'sessionid', store: sessionStore })); // cookie: { path: '/', httpOnly: false, maxAge: 14400000 }
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
//});

passport.use(new LocalStrategy(function (username, password, done) {
    if (password === 'pass') {
        return done(null, { username: username });
    }
    return done(null, false, { message: 'Incorrect password.' });
}));
passport.serializeUser(function (user, done) { done(null, user.username) });
passport.deserializeUser(function (id, done) { done(null, { username: id }) });

function requireLogin(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login.html');
}

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login.html' }));

app.get('/', requireLogin, function (req, res) {
    res.end('Hello, World!');
});

app.get(/^\/public\/(.+)/, function (req, res) {
    res.redirect('/' + req.params[0]);
});

app.get('/chat-history', function (req, res) {
	redisClient.lrange('messages-01401', 0, -1, function (err, messages) {
		res.send(messages || []);
	});
});

server.listen(3000, function () {
    console.log('Server started at http://localhost:3000/');
});

// SOCKETS

var io = require('socket.io').listen(server);
var passportIo = require('passport.socketio');

//io.set('authorization', passportIo.authorize({
//    key: 'sessionid',
//    secret: 'some secret',
//    store: sessionStore,
//}));

var numVisitors = 0;
io.sockets.on('connection', function (socket) {
    socket.emit('number of visitors', ++numVisitors);
	socket.broadcast.emit('number of visitors', numVisitors);
	
	socket.on('chat message', function (message, callback) {
		//messages.push(message);
		redisClient.rpush('messages-01401', message, function (err) {
			socket.broadcast.emit('chat message', message);
			callback();
		});
	});
	socket.on('disconnect', function () {
		socket.broadcast.emit('number of visitors', --numVisitors);
	});
});
