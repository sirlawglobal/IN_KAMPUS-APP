// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    featureImage:{ type: String, required: true },
    author: { type: String, required: true }, // You can modify this based on your user model
    visibility: { type: String, enum: ['anonymous', 'visible'], default: 'visible' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Feedback', postSchema);



