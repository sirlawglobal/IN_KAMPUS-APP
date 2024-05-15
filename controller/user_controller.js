const UserModel = require('../models/user_models');
const CommentModel = require('../models/comments_model');
const AdminModel = require('../models/admin_model')
const bcrypt = require('bcryptjs');


// signup page
const getUserSignUpPage = (req, res)=>{
  res.render("userSignUp" , 
    {error:req.flash("error"), 
    form:req.flash("formData")})
}



//create new user
const postUserSignUpPage = (req, res)=>{
  // check by finding if user already exist
    UserModel
        .findOne({email : req.body.email})
        .then(user =>{
          if(user){
              req.flash("error", "user already exist");
              req.flash("formData", req.body)
              return res.redirect("/user/signup");
      }

    const harshPassword = bcrypt.hashSync(req.body.password, 10);

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password :harshPassword 
      }

      UserModel.create(userData)
    .then( resp => {
          res.redirect("/user/login");
      })
      .catch( err =>{
          res.redirect("/user/signup/");
      })

    })
    .catch(error =>{
        req.flash("error", error._message);
        req.flash("formData", req.body)
        return res.redirect("/user/signup");
    })
      }



//login page
const getUserLoginPage = (req, res)=>{
  res.render("userLogin" , 
    {error:req.flash("error"), 
    form:req.flash("formData")})
}


    //getting the user login
    const  postUserLoginPage= (req , res) =>{
      const {email , password} = req.body;
  
        if(!email || !password){
          req.flash("error", "Email and password are required");
          req.flash("formData", req.body)
          return res.redirect("/user/login");
      }
  
        UserModel.findOne({email})
        .then((user) =>{
        if(!user){
          req.flash("error", "User account with the given email does not exist");
          req.flash("formData", req.body)
          return res.redirect("/user/login");
        }
  
        else if(!bcrypt.compareSync(password, user.password)){
          req.flash("error", "incorrect password");
          req.flash("formData", req.body);
          return res.redirect("/user/login");
        }
        
        req.session.userId = user._id;
        res.redirect("/feedback");
        console.log( "login successfully sheeee" )
      })
      .catch(error =>{
        console.log(error);
        req.flash("error", error._message);
        req.flash("formData", req.body);
        return res.redirect("/user/login");
      })
  
  }
  

  const getUserProfilePage = (req, res) =>{
    UserModel.findOne({_id: req.session.userId})
    .then((user)=>{
         CommentModel.find()
         .then((movies)=>{
              res.render("user_profile", {profile : user, moviesData:movies})
              })
          .catch( error =>{
             req.flash("error", error._message);
             return res.redirect("/user/login");
         })
      
    })
   .catch( error=>{
    req.flash("error", error._message);
    return res.redirect("/user/login");
   })
  }

  const userLogout = (req, res)=>{
    req.session.destroy(()=>{
      res.redirect("/")
    })
  }

module.exports = {
  getUserSignUpPage,
  postUserSignUpPage,
  getUserLoginPage,
  postUserLoginPage,
  getUserProfilePage,
  userLogout
  
}