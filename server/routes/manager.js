const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var manager = require("../../model/manager");
const topic = require('../../model/topic');
const Add = require('../../model/create');





router.get('/sports',checkSignIn,function(req,res){
	Add.find(function(err, response){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('sports', {
                data: response
            });
        }
    });
});


router.get('/politics',checkSignIn,function(req,res){
	Add.find(function(err, response){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('politics', {
                data: response
            });
        }
    });
});


router.get('/travel',checkSignIn,function(req,res){
	Add.find(function(err, response){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('travel', {
                data: response
            });
        }
    });
});

router.get('/food',checkSignIn,function(req,res){
	Add.find(function(err, response){
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('food', {
                data: response
            });
        }
    });
});


function checkSignIn(req, res, next) {
  if (req.session.manager) {
    next();
  } else {
    const err = new Error('Unauthorized');
    next(err);
  }
}

router.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('managerlogin');
});


// MANAGER LOGIN

router.get('/manager_login', function(req , res){
  res.render("managerlogin",{
    managers : " "
  })
})


router.post('/manager_login', function (req, res) {
    const { email, password } = req.body;

    manager.findOne({ email, password }, function (err, response) {
        if (err) {
    
            console.error(err);
            res.render('managerlogin', { message: "Error occurred while logging in" });
        } else {
            if (response) {
              console.log(response)
            
                req.session.manager = response;

                if (response.topic === 'sports' && response.status === 1) {
                    res.redirect('/sports/?msg=opened sports');

                  }else if(response.topic === 'politics' && response.status === 1) {
                  res.redirect('/politics/?msg=opemned politics');

                }else if(response.topic === 'travel' && response.status === 1){
                  res.redirect('travel/?msg=opemned travel');

                }else if(response.topic === 'food' && response.status === 1){
                  res.redirect('food/?msg=opemned food');

                } else {
                    res.render('managerlogin', { message : "You have banned by the admin"});
                }
            } else {
                
                res.render('managerlogin', { message: "Invalid email or password" });
            }
        }
    });
});

router.get('/manager_logout', function (req, res) {
  if (req.session) {
    req.session.destroy(function (err) {
      console.log("User logged out.")
      if (err) {
        return next(err);
      } else {
        return res.render('managerlogin');
      }
    });
  }
});





module.exports = router;
