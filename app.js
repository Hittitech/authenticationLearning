//jshint esversion:6
require('dotenv').config()
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose")
mongoose.set('strictQuery', false);
const encrypt=require("mongoose-encryption")
const app=express();
console.log(process.env.API_KEY);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true}); 

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
const secret=process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
             console.log("created successfully");
             res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets")
                }
            }
        }
    })
})

app.listen(3000,function(){
    console.log("server started on port 3000");
})