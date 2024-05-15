// models/comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true }, // You can modify this based on your user model
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true }
});

module.exports = mongoose.model('Comment', commentSchema);
