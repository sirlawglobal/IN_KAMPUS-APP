const FeedBackModel = require('../models/feedback_model');
const CommentModel = require('../models/comments_model');


// Controller function to add a new comment
const addComment = async (req, res) => {
    try {
        const { author, content } = req.body;
        const feedbackId = req.params.feedbackId;

        // Create a new comment instance
        const newComment = new CommentModel({
            author,
            content,
            post: feedbackId // Assign the feedback ID to the comment
        });

        // Save the new comment to the database
        await newComment.save();

        // Find the corresponding feedback and add the comment
        const feedback = await FeedBackModel.findById(feedbackId);
        feedback.comments.push(newComment);
        await feedback.save();

        res.redirect(`/feedback/${feedbackId}`); // Redirect to the detailed feedback page
    } catch (error) {
        console.error("Error:", error);
        res.redirect("/feedback"); // Redirect to the main feedback page in case of an error
    }
};

module.exports = { addComment };




// const addComment = (req, res) => {
//   const { author, content } = req.body;
  
//   // Assuming req.params.feedbackId contains the ID of the associated feedback
//   const postId = req.params.feedbackId;

//   // Create a new comment document
//   const newComment = new CommentModel({ author, content, post: postId });

//   // Save the new comment to the database
//   newComment.save()
//       .then(savedComment => {
//           // Find the feedback document by its ID
//           return FeedBackModel.findById(postId);
//       })
//       .then(feedback => {
//           if (!feedback) {
//               return res.redirect("/feedback");
//           }
//           // Push the ObjectId of the newly created comment into the comments array
//           feedback.comments.push(newComment._id);
//           // Save the updated feedback document
//           return feedback.save();
//       })
//       .then(() => {
//           // Redirect to the detailed feedback page
//           res.redirect(`/feedback/${postId}`);
//       })
//       .catch(err => {
//           console.error("Error:", err);
//           res.redirect(`/feedback/${postId}`);
//       });
// };


// const getUpdateComment = (req, res) => {
//   const feedbackId = req.params.feedbackId;
//   const commentId = req.params.commentId;

//   // Find the feedback document by its ID
//   FeedBackModel.findById(feedbackId)
//       .populate('comments')
//       .then(feedback => {
//           if (!feedback) {
//               return res.redirect("/feedback");
//           }
//           // Find the comment within the feedback document
//           const comment = feedback.comments.find(comment => comment._id == commentId);
//           if (!comment) {
//               return res.redirect(`/feedback/${feedbackId}`);
//           }
//           // Render the comment editing page
//           res.render("edit_comment", { feedbackId, comment });
//       })
//       .catch(err => {
//           console.error("Error:", err);
//           res.redirect(`/feedback/${feedbackId}`);
//       });
// }

// // Controller for updating a comment
// const updateComment = (req, res) => {
//   const feedbackId = req.params.feedbackId;
//   const commentId = req.params.commentId;
//   const { content } = req.body;

//   // Update the comment content in the database
//   CommentModel.findByIdAndUpdate(commentId, { content }, { new: true })
//       .then(updatedComment => {
//           res.redirect(`/${feedbackId}`);
//       })
//       .catch(err => {
//           console.error("Error:", err);
//           res.redirect("/feedback/");
//       });
// };

// // Controller for deleting a comment
// const deleteComment = (req, res) => {
//   const feedbackId = req.params.feedbackId;
//   const commentId = req.params.commentId;

//   // Find the feedback document by its ID
//   FeedBackModel.findById(feedbackId)
//       .populate('comments')
//       .then(feedback => {
//           if (!feedback) {
//               return res.redirect("/feedback");
//           }
//           // Remove the comment from the feedback document
//           feedback.comments.pull(commentId);
//           // Save the updated feedback document
//           return feedback.save();
//       })
//       .then(() => {
//           // Delete the comment document from the database
//           return CommentModel.findByIdAndDelete(commentId);
//       })
//       .then(() => {
//           res.redirect(`/feedback/${feedbackId}`);
//       })
//       .catch(err => {
//           console.error("Error:", err);
//           res.redirect(`/feedback/${feedbackId}`);
//       });
// };


// module.exports = {
//   addComment,
//   getUpdateComment,
//   updateComment,
//   deleteComment
// };
