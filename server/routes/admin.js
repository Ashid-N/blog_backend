const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')


var admin = require("../../model/admin");
var blog = require("../../model/blog");
const Add = require('../../model/create');
var topic = require("../../model/topic");


// MANAGER DETAILES

router.get('/manager',checkSignIn, function (req, res) {
  manager.find(function (err, data) {
    if (err) {
      console.error(err);
      res.send('Error fetching manager data');
    } else {
      res.render('manager', { manager: data });
    }
  });
});

// MANAGER APPROVE

router.get('/managerapprove/:id',function(req, res){
console.log('approved:',req.params.id)
manager.findByIdAndUpdate({_id:req.params.id},{status:1},(err,manager)=>{
   if(err){
      console.log('error')
   }else{
       res.redirect('/manager/?msg=approved')
      }
   })
   });

// MANAGER REJECT

router.get('/managerreject/:id',function(req, res){
console.log('rejected:',req.params.id)
manager.findByIdAndUpdate({_id:req.params.id},{status:0},(err,manager)=>{
if(err){
   console.log('error')
}else{
    res.redirect('/manager/?msg=rejected')
   }
})
});

// MANAGER VIEW

router.get('/viewprofile/:id', (req, res) => {
   var userId = req.params.id;
 
   
   manager.findById(userId, (err, user) => {
     if (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
     } else {
       res.render('viewprofile', { user });
     }
   });
       });

//ADD MANAGER

router.get('/add_manager',checkSignIn, function(req , res){
  res.render("addmanager",{error : " "})
})

router.post('/add_manager', async (req, res) => {
  const { name, email, topic, password } = req.body;

  try {
      const existingEmail = await manager.findOne({ email });
      if (existingEmail) {
          return res.status(400).render('addmanager', { error: "This email already exists" });
      }

      const existingTopic = await manager.findOne({ topic });
      if (existingTopic) {

          if (existingTopic.status !== 2) {
              return res.status(400).render('addmanager', { error: "There is already a topic manager for this topic" });
          }
      }

      const newManager = new manager({
          name,
          email,
          topic,
          password,
          status: 1,
      });

      await newManager.save();

      res.redirect('/manager');
  } catch (error) {
      console.error('Error inserting data into the manager schema:', error);
      res.status(500).send('Internal Server Error');
  }
});

// ADMIN DASHBOARD

router.get('/admindashboard',checkSignIn, function(req, res){
  res.render('admindashboard')
})

// ADD TOPIC

router.get('/addtopic',checkSignIn, function(req, res){
  topic.find(function(req , response){
  res.render('addtopic')
});
})

router.post("/addtopic", function (req, res) {
  var personInfo = req.body;

  if (!personInfo.topic) {
    res.render("/addtopic");
  } else {
    var addtopic = new topic({ 

      topic: personInfo.topic
    });

    addtopic.save(function (err, createdItem) {
      if (err) res.send("Database error");
      else res.redirect("addtopic");
    });
  }
});

// USER DETAILES

router.get("/admin",checkSignIn, function (req, res) {
  blog.find(function (err, admin) { 
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("admin", { admin: admin }); 
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
  res.status(500).render('adminlogin');
});



// ADMIN LOGIN

router.get('/adminlogin', function(req, res){
  res.render('adminlogin');
})

router.post('/adminlogin', async (req, res) => {
  const personInfo = req.body;

  admin.findOne({ email: req.body.email }, { email: 1 }, (err, response) => {
    if (!response) {
      res.render('adminlogin', { data: 'User does not exist' });
    } else if (response.email === req.body.email) {
      req.session.user = response;
      res.redirect('/admindashboard');
    } else {
      res.render('adminlogin', { data: 'Invalid details' });
    }
  });
});

router.get('/adminlogout',  function(req, res){
  if(req.session){
    req.session.destroy(function(err){
      console.log("user logged out.")
      if(err){
        return next(err);
      }else{
        return res.render('adminlogin');
      }
      
    });
  }

});



// USER DELETE 

router.get("/delete/:id", function (req, res) {
  blog.findByIdAndRemove(req.params.id, function (err, blog) {
    if (err) {
      res.json({ message: "Error in deleting record id " + req.params.id });
    } else {
      res.redirect("/admin");
    }
  });
});

// APPROVE USER

router.get('/approve/:id',function(req, res){
  console.log('approved:',req.params.id)
  blog.findByIdAndUpdate({_id:req.params.id},{status:1},(err,admin)=>{
     if(err){
        console.log('error')
     }else{
         res.redirect('/admin/?msg=approved')
        }
     })
     });

// REJECT USER 

router.get('/reject/:id',function(req, res){
console.log('rejected:',req.params.id)
blog.findByIdAndUpdate({_id:req.params.id},{status:0},(err,admin)=>{
  if(err){
     console.log('error')
  }else{
      res.redirect('/admin/?msg=rejected')
     }
  })
  });

// VIEW PROFILE USER  

  router.get('/viewprofile/:id', (req, res) => {
     var userId = req.params.id;
   
     
     blog.findById(userId, (err, user) => {
       if (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
       } else {
         res.render('viewprofile', { user });
       }
     });
       });




module.exports = router;


