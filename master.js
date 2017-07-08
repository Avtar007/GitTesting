var express = require('express');
var router = express.Router();
var mongoc = require('mongodb').MongoClient;

var f="";
var f1="";
var f2="";


function data_base(working)
{
  mongoc.connect('mongodb://localhost:27017/my',(err,db)=>
  {
    if(err){
      console.log(err);
      f = "Database down."
      res.redirect('/');
    }
    else {
        working(db);
      }

  });
}



router.get('/',(req,res)=>
{
  if(req.session.user)
  {
    res.render('protected',{user:req.session.user,pass:"Confidential.."});
  }
  else
  {
    res.render('home',{flag1:f,flag2:f1});
    f = "";
    f1 = "";
  }

});
router.post('/login',(req,res)=>
{
  var username = req.body.user;
  var pass =  req.body.pass;
  data_base((db)=>
  {
    db.collection('new_col').find({name:username,pass:pass}).toArray((err,result)=>
    {
      if(result.length)
      {
        req.session.user = username;
        res.render('protected',{user:username,pass:pass});
      }
      else {
        f = "Invalid username or password.";
        res.redirect('/');
      }

    });

  });


});

router.get('/logout',(req,res)=>
{
  req.session.destroy();
  res.redirect('/');
});

router.get('/signup',(req,res)=>
{
  res.render('signup',{flag:f2});
  f2="";
});

router.post('/create',(req,res)=>
{
  var username = req.body.user;
  var pass =  req.body.pass;
  var passc =  req.body.passc;

  if(pass === passc)
  {
    data_base((db)=>
    {
      var coll = db.collection('new_col');

      coll.find({name:username}).toArray((err,result)=>
      {
        if(result.length)
        {
          f="User already exists.";
          res.redirect('/');
        }
        else {
          coll.insert({name:username,pass:passc},(err,result)=>
          {
            if(err){
              f="Account not created.";
              res.redirect('/');
            }
            else {
              f1 = "Account created sucessfully."
              res.redirect('/');
            }
            });
        }

      });


   });
  }
  else{
    f2 = "Password not match.";
    res.redirect('/signup');
  }
});



module.exports = router;
