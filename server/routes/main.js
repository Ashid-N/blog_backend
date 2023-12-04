const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/blogsstorage")

var blog = require("../../model/blog");
var admin = require("../../model/admin");
var Add = require("../../model/create");
const { create } = require('connect-mongo');
const bcrypt = require('bcrypt');
const manager = require('../../model/manager');
const saltRounds = 10; 


router.use(function(req, res, next) {   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');   next(); });

router.get('/new', (req, res)=>{
  res.render('try');
})


// DASHBORD

router.get("/dashboard",checkSignIn, function (req, res) {
  Add.find(function (err, store) {  // Use the correct model name
    res.render("dashboard", { store: store}); 
  });
});

router.get("/createblog",checkSignIn, function (req, res) {
  res.render("createblog");
});


// CREATE BLOG

router.post("/createblog", function (req, res) {
  var personInfo = req.body;

  if (!personInfo.title ||!personInfo.topic || !personInfo.content) {
    res.send("Sorry, you provided wrong info");
  } else {
    var addInstance = new Add({  // Use a different variable name

      title: personInfo.title,
      topic: personInfo.topic,
      content: personInfo.content,
    });

    addInstance.save(function (err, createdItem) {
      if (err) res.send("Database error");
      else res.redirect("/dashboard");
    });
  }
});

// REMOVE BLOG

router.get("/remove/:id", function (req, res) {
  console.log(req.params.id);
  Add.findByIdAndRemove(req.params.id, function (err, store) {
      if (err) {
          res.json({ message: "Error in deleting record id " + req.params.id });
      } else {
          res.redirect("/dashboard");
      }
  });
});


function checkSignIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    const err = new Error('Unauthorized');
    next(err);
  }
}

router.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('login');
});


//SIGNUP

router.get('/signup', function(req, res){
  res.render('signup');
});

router.post("/signup", async function (req, res) {
  var personInfo = req.body;

  if (!personInfo.name || !personInfo.email || !personInfo.password) {
    res.send("Sorry, you provided wrong info");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(personInfo.password, saltRounds);

      blog.findOne({ email: personInfo.email }, function (err, data) {
        if (err) {
          res.send("Database error");
        } else if (data) {
          res.render("signup", { message: "You have an account, please login" });
        } else {
          var newblog = new blog({
            name: personInfo.name,
            email: personInfo.email,
            password: hashedPassword
          });

          newblog.save(function (err, blog) {
            if (err) {
              res.send("Database error");
            } else {
              req.session.user = newblog;

              console.log(newblog);
              res.redirect("/dashboard");
            }
          });
        }
      });
    } catch (err) {
      res.send("Error hashing password");
    }
  }
});


// ADMIN LOGIN

router.get('/adminlogin', function(req, res){
  res.render('adminlogin');
})


// LOGIN


router.get('/login', function(req, res){
  res.render('login',{
    data: " "
  });
});

router.post("/login", async (req, res) => {
  var personInfo = req.body;
  var message = "Invalid email or password";

  try {
    const user = await blog.findOne({ email: personInfo.email });
    console.log(user)

    if (user) {
      const passwordMatch = await bcrypt.compare(personInfo.password, user.password);

      if (passwordMatch) {
        if (user.status === 1) {
          req.session.user = user;
          res.redirect("/dashboard");
        } else {
          res.render("login", { data: 'You have been banned by the admin' });
        }
      } else {
        res.render("login", { data: 'Invalid email or password' });
      }
    } else {
      res.render("login", { data: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.send("Error checking login credentials");
  }
});


// LOGOUT


router.get('/logout',  function(req, res){
  if(req.session){
    req.session.destroy(function(err){
      console.log("user logged out.")
      if(err){
        return next(err);
      }else{
        return res.render('login');
      }
      
    });
  }

});




module.exports = router;
