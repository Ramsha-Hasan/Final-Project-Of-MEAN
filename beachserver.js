var express = require ('express');
var app = express();
var mongoose = require('mongoose');
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://ramsha:ramsha@ds062889.mlab.com:62889/final-project');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "wah wah wah",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {
  res.render('first');
});
app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
});

// AUTH Routes

//sign up page
app.get("/signup", function(req, res) {
    res.render("signup");
});

// register post
app.post("/signup", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/secret"); 
        });
    });
});
// LOGIN
// render login form
app.get("/login", function(req, res) {
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
   successRedirect: "/beach",
   failureRedirect: "/login" 
}), function(req, res) {
    
});

app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get('/submission',function(req,res){
res.render('submission');
});

app.get('/beach',function(req,res){
res.render('beach');
});

app.get('/contact',function(req,res){
res.render('contact');
});

app.post("/contact", function(req,res){
User.register(new User({username: req.body.username, message: req.body.message}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('contact');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/submission"); 
        });
    });
});




app.get('/map',function(req,res){
res.render('map');
});

app.get('/gallery',function(req,res){
res.render('gallery');
});

app.get('/bookings',function(req,res){
res.render('bookings');
});

app.use(express.static('./public'));




app.listen(5000);
console.log("server has started");