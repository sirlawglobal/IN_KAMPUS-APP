const express = require("express");
const app  = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride =  require('method-override');
const fs = require('fs');
const path = require("path");
const fileUpload = require("express-fileupload");
const userAuth = require("./middleware/user_middleware")
const adminAuth = require("./middleware/admin_middleware")

//referencing model
const FeedBackModel = require('./models/feedback_model');
const CommentModel = require('./models/comments_model');

//App configuration
app.set('view engine', 'ejs');
app.set('views', './views');


//middlewares configuration
app.use(session({
  secret : "geegstack101",
  resave :true,
  saveUninitialized: false
  }));
  app.use(flash());
  
  app.use(express.static(__dirname + "/public"));
  // app.use('/uploads', express.static(path.join(__dirname, 'upload')));
//  app.use(express.static(__dirname + "controller"));
  // app.use(express.static("public"));
 
  app.use(methodOverride("_method"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(fileUpload());

  app.use((req, res, next)=>{
    res.locals.userSession = req.session.userId;
    next();
    });

  app.use((req, res, next)=>{
    res.locals.adminSession = req.session.adminId;
    next();
    });

  //db connection mongodb://127.0.0.1:27017
mongoose.connect("mongodb://127.0.0.1:27017/in_kampus")
.then((res) =>{
console.log("Clap for tinubu....Database has Connected Succesfully")
})
.catch((err) =>{
console.log("Error connecting to Db:", err.message)
})

const { getAdminSignUpPage ,PostAdminSignUp, getAdminLoginPage, PostAdminLogin, getAdminProfilePage ,adminLogout } = require("./controller/admin_controller")


const {getUserSignUpPage ,postUserSignUpPage, getUserLoginPage ,  postUserLoginPage,   getUserProfilePage , userLogout} = require("./controller/user_controller")


const {getHomePage,FeedBackPage,   FeedBack ,CreateFeedBackPage ,detailedPage , get404Page, getaboutPage} = require("./controller/feedback_controller");

const {addComment, getUpdateComment, updateComment, deleteComment} = require("./controller/comment_controller");

const { getNaviagtionPage} = require("./controller/navigation_controller");





app.get("/", getHomePage) //gettting feedbackpage
app.get("/feedback", FeedBackPage) //gettting feedbackpage

app.get("/upcoming", get404Page) //gettting feedbackpage

app.get("/about", getaboutPage) //gettting feedbackpage

app.get("/createFeedBack" , CreateFeedBackPage) //gettting create_feedbackpage

app.post("/feedback/new",   FeedBack  ); // posting created feedback

app.get('/feedback/:feedbackId', detailedPage);

// router.post('/feedback/:feedbackId/comments', commentController.addComment);

app.post('/feedback/:feedbackId/comments', addComment);

app.get("/navigation", getNaviagtionPage) //gettting create_feedbackpage

// app.get("/navigation", getPage) //gettting create_feedbackpage


// Route handler for rendering the comment editing page
// app.get('/feedback/:feedbackId/comments/:commentId/edit',getUpdateComment);

// Route handler for updating a comment
// app.post('/feedback/:feedbackId/comments/:commentId/edit', updateComment);

// Route handler for deleting a comment
// app.post('/feedback/:feedbackId/comments/:commentId/delete', deleteComment);


//admin
app.get("/admin/signup", getAdminSignUpPage) //gettting admin_sign _up _page

app.post("/admin/signup", PostAdminSignUp) //po

app.get("/admin/login", getAdminLoginPage) //gettting admin login page


app.post("/admin/login",  PostAdminLogin) //gettting admin login page

app.get("/admin/profile", adminAuth,getAdminProfilePage) //gettting admin profile page

app.post("/admin/logout", adminLogout) // getting the profile page

//user
app.get("/user/signup", getUserSignUpPage ) //gettting admin_sign _up _page

app.post("/user/signup", postUserSignUpPage ) //gettting admin_sign _up _page

app.get("/user/login", getUserLoginPage ) //gettting admin login page

app.post("/user/login",  postUserLoginPage) //gettting admin login page

app.get("/user/profile", userAuth,    getUserProfilePage) //gettting admin login page

app.post("/user/logout",  userLogout) // getting the profile page

app.listen(5000, ()=>{
  console.log("server started on locahost: http://localhost:5000")
  })
  
