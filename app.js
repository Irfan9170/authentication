//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose")
const bodyparser = require("body-parser");
const ejs = require("ejs");



const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/users",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})
const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",(req,res)=>{
    const newUser=  new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render("secrets")
        }
    });
})

app.post("/login",(req,res)=>{
     User.findOne({email:req.body.username},(err,user)=>{
         if(err){
             console.log(err)
         }else{
             if(user.password===req.body.password){
                 res.render("secrets")
             }
         }
     })
})
app.listen(8000,()=>{
    console.log("Server Started")
})




