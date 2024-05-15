
const userAuth = (req, res, next)=>{
  if(!req.session || !req.session.userId){
    req.flash("error" , "Access denied:  Ogbeni user ,login first");
    return res.redirect("/user/login")
  }
  next();
} 


module.exports = userAuth;
  
