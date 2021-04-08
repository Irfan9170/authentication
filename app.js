//jshint esversion:6
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose")
const bodyparser = require("body-parser");
const ejs = require("ejs");
// const encrypt = require("mongoose-encryption")
// // const md5=require("md5")
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { serialize } = require('bson');

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));

app.use(session({
    secret:'this is my first secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// userSchema.plugin(encrypt, { secret:process.env.KEY,encryptedFields: ['password'] });
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register")
})
// app.post("/register",(req,res)=>{
//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//         const newUser=  new User({
//             email:req.body.username,
//             password:hash
//         })
//         newUser.save((err)=>{
//             if(err){
//                 console.log(err)
//             }
//             else{
//                 res.render("secrets")
//             }
//         });
//     });
   
// })
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.render("home")
    }
})
app.post("/register",(req,res)=>{
    User.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/");
        } else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets")
            })

        }
    })
})
app.get("/logout",(req,res)=>{
        req.logout();
        res.redirect("/")
})
// app.post("/login",(req,res)=>{
//      User.findOne({email:req.body.username},(err,user)=>{
//          if(err){
//              console.log(err)
//          }else{
//             bcrypt.compare(req.body.password, user.password, function(err, result) {
//                 if(result===true){
//                     res.render("secrets")
//                 }
                
//             });
            
//          }
//      })
// })

app.post("/login",(req,res)=>{
    const user = new User({
        username:req.body.username,
        password:req.body.password
            });
        req.login(user,(err)=>{
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,()=>{
                    res.redirect("/secrets");
            });
        }
});
});

app.listen(8000,()=>{
    console.log("Server Started")
});




