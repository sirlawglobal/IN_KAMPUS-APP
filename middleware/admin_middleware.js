
const adminAuth = (req, res, next)=>{
  if(!req.session || !req.session.adminId){
    req.flash("error" , "Access denied:  Alaye  admin ,login first");
    return res.redirect("/admin/login")
  }
  next();
} 

module.exports = adminAuth;
  
