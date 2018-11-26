const express = require('express');
const router = require("express").Router();
const Post = require("../models/Post");


function checkIfIs(role){
  return function(req, res, next) {
    if(req.user.role === role || req.user.role("ADMIN")) return next();
    return res.send({message: `No tienes permiso, no eres un ${role}`})
  }
}

function isAuth(req, res, next) {
  if(req.isAuthenticated()) return next();
  return res.redirect("auth/login");
}

function canPublish(req, res, next){
  if(req.user.role !== "GUEST") return next()
  return res.redirect("/posts");
}

function canDelete(req, res, next) {
  if(req.user.role === "ADMIN" || req.user.role ==="EDITOR") return next()
}

router.post('/new', isAuth, checkIfIs("ADMIN"), (req,res, next) => {
  req.body.user = req.user._id;
  Post.create(req.body).then(post => {
    res.redirect("/posts");
  });
});

router.get('/new', isAuth, checkIfIs("ADMIN"), canPublish, (req,res, next) => {
  res.render('posts/new');
})


router.get("/", (req, res, next) => {
  Post.find().then(posts => {
    res.render("posts/list", {posts})
  })
})



module.exports = router;