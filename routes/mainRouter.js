var express = require('express');
var router = express.Router();
var uuid = require('uuid/v4');

function generateToken() {
    return uuid();
}

/* GET login page. */
router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.render('../public/views/home');
    } else {
        res.redirect('login');
    }
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('../public/views/login', {message: ''});
});

/* GET home page. */
router.get('/home', function (req, res, next) {
    if (req.session.user) {
        res.render('../public/views/home');
    } else {
        res.send(401);
    }
});

/* GET token. */
router.get('/token', function (req, res, next) {
    res.json(req.session.csrf);
});

/* POST login. */
router.post('/login', function (req, res, next) {
    if (req.body.username == "admin" && req.body.password == "admin") {
        req.session.csrf = generateToken();
        req.session.user = req.body.username;
        res.redirect('home');
    } else {
        res.render('../public/views/login', {message: 'Invalid username or password!'});
    }
});

/* POST message. */
router.post('/message', function (req, res, next) {
    var message = '';
    var className = '';
    if (req.session.csrf == req.body.csrf) {
        message = 'CSRF token is valid.';
        className = 'message-success';
    } else {
        message = 'Invalid CSRF token!';
        className = 'message-fail';
    }
    res.render('../public/views/response', {message: message, className: className});
});


module.exports = router;
