
const FeedBackModel = require('../models/feedback_model');
const CommentModel = require('../models/comments_model');
const AdminModel = require('../models/admin_model')
const bcrypt = require('bcryptjs');


// signup page
const getAdminSignUpPage = (req, res)=>{
    res.render("adminSignUp" , 
      {error:req.flash("error"), 
      form:req.flash("formData")})
}



//create new admin
const PostAdminSignUp = (req, res)=>{

  //check by finding if admin already exist
    AdminModel.findOne({email : req.body.email})
    .then(admin =>{
      if(admin){
          req.flash("error", "Admin already exist");
          req.flash("formData", req.body)
          return res.redirect("/admin/signup");
  }

const harshPassword = bcrypt.hashSync(req.body.password, 10);

    const adminData = {
        name: req.body.name,
        email: req.body.email,
        password :harshPassword 
  }

  AdminModel.create(adminData)
 .then( resp => {
      res.redirect("/admin/login");
  })
  .catch( err =>{

    console.log(err)
      res.redirect("/admin/signup/");
  })

})
.catch(error =>{
    req.flash("error", error._message);
    req.flash("formData", req.body)
    return res.redirect("/admin/signup");
})
  }


//getting the user login page
  const getAdminLoginPage = (req, res)=>{
    res.render("adminLogin" , 
      {error:req.flash("error"), 
      form:req.flash("formData")})
}


//getting the user login
const PostAdminLogin = (req , res) =>{
  const {email , password} = req.body;
  
    if(!email || !password){
      req.flash("error", "Email and password are required");
      req.flash("formData", req.body)
      return res.redirect("/admin/login");
  }
  
    AdminModel.findOne({email})
    .then((admin) =>{
    if(!admin){
      req.flash("error", "Admin account with the given email does not exist");
      req.flash("formData", req.body)
      return res.redirect("/admin/login");
    }
  
    else if(!bcrypt.compareSync(password, admin.password)){
      req.flash("error", "incorrect password");
      req.flash("formData", req.body);
      return res.redirect("/admin/login");
    }
    // console.log(req.session)
    req.session.adminId = admin._id;
    res.redirect("/feedback");
  })
  .catch(error =>{
    console.log(error);
    req.flash("error", error._message);
    req.flash("formData", req.body);
    return res.redirect("/admin/login");
  })
  
  }

  const getAdminProfilePage = (req, res) =>{
    AdminModel.findOne({_id: req.session.adminId})
    .then((admin)=>{
         FeedBackModel.find({admin: req.session.adminId})
         .then((products)=>{
       
              res.render("admin_profile", {profile : admin, productsData:products})
              })
          .catch( error=>{
             req.flash("error", error._message);
             return res.redirect("/admin/login");
         })
      
    })
   .catch( error=>{
    req.flash("error", error._message);
    return res.redirect("/admin/login");
   })
  }

  const adminLogout = (req, res)=>{
    req.session.destroy(()=>{
      res.redirect("/admin/login")
    })
  }


module.exports = {
  getAdminSignUpPage,
  PostAdminSignUp,
  getAdminLoginPage,
  PostAdminLogin,
  getAdminProfilePage,
  adminLogout
}