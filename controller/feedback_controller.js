//referencing model
const FeedBackModel = require('../models/feedback_model');
const CommentModel = require('../models/comments_model');
const path = require("path");
const fs = require('fs');
const getHomePage = (req, res)=>{
  res.render("index")
 }
 

 const calculateElapsedTime = (createdAt) => {
  const currentTime = new Date();
  const elapsedTime = Math.floor((currentTime - createdAt) / (1000 * 60)); // Calculate elapsed time in minutes
  if (elapsedTime < 60) {
      return `${elapsedTime} mins ago`;
  } else if (elapsedTime < 1440) {
      return `${Math.floor(elapsedTime / 60)} hours ago`;
  } else {
      return `${Math.floor(elapsedTime / 1440)} days ago`;
  }
};


 const FeedBackPage = (req, res) => {
  FeedBackModel.find()
      .populate('comments')
      .exec()
      .then(feedbacks => {
          // Calculate elapsed time for each feedback
          feedbacks.forEach(feedback => {
              feedback.elapsedTime = calculateElapsedTime(feedback.createdAt);
          });
          res.render("feedBackPage", { feedbacksData: feedbacks });
          console.log(feedbacks)
      })
      .catch(err => {
          console.error('Error fetching feedbacks:', err);
          res.status(500).send('Internal Server Error');
      });
};

const CreateFeedBackPage = (req, res)=>{
 res.render("createFeedBack")
}


const getaboutPage = (req, res)=>{
 res.render("about")
}
const get404Page = (req, res)=>{
 res.render("404")
}



const FeedBack  =  (req,res) =>{
  const {fullname, title,content , visibility} = req.body;
  const {featureImage} = req.files;


  const f_ImageName = fullname + "_featureImage" + path.extname(featureImage.name);


  featureImage.mv("./public/upload/" + f_ImageName , (err) =>{
    if(err) throw err;

    console.log(__dirname);

    const feedbackData = {
     author: fullname,
    title: title,
    content : content,
    featureImage: f_ImageName,
    visibility : visibility
    // admin: req.session.adminId
}

FeedBackModel.create(feedbackData)
  .then( resp =>{
    // console.log(req.body)
    res.redirect("/feedback");
})
  .catch( err =>{
console.log(err)
    // req.flash("errorMsg", err._message)
    // req.flash("form", req.body)
    res.redirect("/createFeedBack");
})
  }

  )
}


const detailedPage = (req, res) => {
  FeedBackModel.findById(req.params.feedbackId)

    .populate('comments')
     // Populate the comments associated with the feedback
    .then(feedback => {
      if (!feedback) {
        // If feedback is not found, redirect to the feedback page
        return res.redirect("/feedback");
      }
      // Render the detailed page with the populated feedback data
      feedback.elapsedTime = calculateElapsedTime(feedback.createdAt);
      res.render("detailed_page", { feedbackData: feedback });
    })
    .catch(err => {
      console.error("Error:", err);
      // If there's an error, redirect to the feedback page
      res.redirect("/feedback");
    });
};





module.exports = {
  getHomePage,
  FeedBackPage,
  FeedBack ,
  CreateFeedBackPage,
  detailedPage,
  get404Page,
  getaboutPage
}