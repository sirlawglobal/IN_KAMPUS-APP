const express = require("express");
const app  = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride =  require('method-override');
const adminAuth =require('./middlewares/admin_Middleware');
//referencing the model
const ProductModel = require('./models/products_model');
const AdminModel = require('./models/admin_model')

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
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next)=>{
res.locals.adminSession = req.session.adminId;
next();
})
//db connection mongodb://127.0.0.1:27017
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then((res) =>{
console.log("Database Connected")
})
.catch((err) =>{
console.log("Error connecting to Db:", err.message)
})


//referencing the controllers
const {homePage , productPage,  create_Product_page ,single_Product_page, edit_Products_Page, create_product, edit_Products, delete_product } = require("./controller/productsCon
troller")

const {signUpPage , loginPage, addAdmin, login, profilePage, logout} = require("./controller/adminController")

//App Routes
app.get("/", homePage) //gettting home page
app.get("/products", productPage); //getting product page
app.post("/products", create_product  ); // posting created products
app.get("/products/new" ,create_Product_page );//getting create product page

app.get("/products/:productId", single_Product_page); //getting single page
app.get("/products/:productId/edit",adminAuth,edit_Products_Page); //getting edit - product page


app.put("/products/:productId",adminAuth, edit_Products);// putting edited product back
app.delete("/products/:productId",adminAuth, delete_product); // deleting the product

app.get("/admin/signup", signUpPage) //getting admin sign up page
app.post("/admin/signup",addAdmin)// adding the admin
app.get("/admin/login",loginPage)// getting the loginPage

app.post("/admin/login", login) // login in page
app.get("/admin/profile",adminAuth,profilePage) // getting the profile page

app.post("/admin/logout", logout)
app.listen(5000, ()=>{
console.log("server started on locahost: http://localhost:5000")
})







<%- include("./layout/header.ejs") %>
<main class="product-details">
  <h2>Add Product</h2>
  <p class="error"><%= error %></p>
  <div class="form-container">
      <form action="/products" method="post">
          <div>
              <label for="name">
                  <p>Product Name</p>
              </label>
              <input type="text" name="name" id="" value="<%= form[0]?.name %>">
          </div>
          <div>
              <label for="price">
                  <p>Product Price</p>
              </label>
              <input type="number" name="price" id="" value="<%= form[0]?.price %>">
          </div>
          <div>
              <label for="description">
                  <p>Product Description</p>
              </label>
              <textarea name="description" id="" cols="30" rows="10" value="<%= form[0]?.description %>"></textarea>
          </div>
          <div>
              <label for="image">
                  <p>Product Image URL</p>
              </label>
              <input type="string" name="image" id="" value="<%= form[0]?.image %>">
          </div>
          <div>
              <label for="category">
                  <p>Product category</p>
              </label>
              <select name="category" id="">
                  <option value="Accessories"
                  <% if(form[0]?.category && form[0].category === 'Accessories'){  %>
                   
                     selected
              <% } %> 
                
                >Accessories</option>
                  <option value="Apparel"  
                  <% if(form[0]?.category && form[0].category === 'Apparel'){  %>
                   
                    selected
             <% } %> 

                  > Apparel</option>
                  <option value="Bags"   
                  <% if(form[0]?.category && form[0].category === 'Bags'){  %>
                   
                    selected
             <% } %> 
                  
                  >Bags</option>
              </select>
          </div>
          <input type="submit" value="Create Product">
      </form>
  </div>
</main>

<%- include("./layout/footer.ejs") %>







#######detail page


<!-- Display other details of the post -->
    
    <!-- Comment Form -->
    <!-- <form action="/posts/<%= post._id %>/comments" method="POST">
        <h2>Add a Comment</h2>
        <div>
            <label for="author">Author:</label>
            <input type="text" id="author" name="author" required>
        </div>
        <div>
            <label for="content">Comment:</label>
            <textarea id="content" name="content" rows="4" required></textarea>
        </div>
        <button type="submit">Submit</button>
    </form> -->

    <!-- Existing Comments -->
    <!-- <h2>Comments</h2>
    <ul>
        <% post.comments.forEach(comment => { %>
            <li>
                <strong><%= comment.author %>:</strong> <%= comment.content %>
            </li>
        <% }); %>
    </ul> -->


    ////
    // const  addComment = (req, res) => {
//     const { author, content } = req.body;
//     const newComment = { author, content };

//     FeedBackModel.findById(req.params.feedbackId)
//         .then(feedback => {
//             if (!feedback) {
//                 return res.redirect("/feedback");
//             }
//             feedback.comments.push(newComment);
//             return feedback.save();
//         })
//         .then(() => {
//             res.redirect(`/feedback/${req.params.feedbackId}`);
//         })
//         .catch(err => {
//             console.error("Error:", err);
//             res.redirect(`/feedback/${req.params.feedbackId}`);
//         });
// }



i have a two schema namely: FeedBackModel and CommentModel with separate controllers namely: feedback_controller and comment_controller.

i have a page called detailed page which consist of full details of the feedback as sumarised from the main page.

below it,
i have a form to add a comment to the feedback.

i have a list of all the comments on the feedback.




here is my schem for feedback:
// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    featureImage: String,
    author: { type: String, required: true }, // You can modify this based on your user model
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});


module.exports = mongoose.model('Feedback', postSchema);


here is my schema for comment:

// models/comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true }, // You can modify this based on your user model
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true }
});

module.exports = mongoose.model('Comment', commentSchema);


can you give me the  code for controller and  route handler for comment creation ?







<article>
                    
<div class="article_sender">
    <span>
        <img src="/images/avarter.png" alt="icon_avatar">
        <div class="article_sender_details">
            <h4><%= feedback.author %></h4>
            <p>5 mins ago</p>
        </div>
    </span>
    <img src="/images/dot.png" alt="icon_dot">
</div>

<div class="article_details">

    <div class="left_details">
        <img src="/images/complaint_feature.png" alt="complaint_image">
        <span>
            <p>Add a comment</p>
            <p><img src="/images/comment.png" alt="icon_comment"> 100k comments</p>
        </span>
    </div>

    <div>
        <h3><%= feedback.title %></h3>
        <p><%= feedback.content %>      <a href="/<%= feedback._id %>">more</a></p>
    </div>

</div>

</article>





i am working on an express web app with mongodb with ejs. i started the developing without src folder. later  i move  all my code files in src folder. after then, i am getting this error, what can cause it




///detailed ejs

<%- include("./layout/header.ejs") %>
<!-- Render the feedback content -->

<main class="detail_Page">


<!-- <h1><%= feedbackData.author %></h1> -->
<% if (feedbackData.visibility === 'visible') { %>
    <h1><%= feedbackData.author %></h1>
<% } else { %>
    <h1>Anonymous</h1>
<% } %>
<span >
    <img src="/images/avarter.png" alt="icon_avatar">
    <div class="article_sender_details">
        <% if (feedbackData.visibility === 'visible') { %>
            <h4><%= feedbackData.author %></h4>
        <% } else { %>
            <h4>Anonymous</h4>
        <% } %>
        <p><%= feedbackData.elapsedTime %></p>
    </div>
</span>

<h3><%= feedbackData.title %></h3>
<p><%= feedbackData.content %></p>
<img src="/images/complaint_feature.png" alt="complaint_image">

<div>

    <span>
                                        
        <!-- <p><a href="/feedback/<%= feedbackData._id %>">Add a comment</a></p> -->
        <p>
            <img src="/images/comment.png" alt="icon_comment">
             <%= feedbackData.comments.length %> comments</p>
    </span>
</div>



<!-- <section class="display_cmt"> -->

<hr>
<h2>Comments</h2>
<% if (feedbackData.comments.length > 0) { %>
    <ul>
        <% feedbackData.comments.forEach(comment => { %>
            <li class="comment_list">
                <strong><%= comment.author %>:</strong> <%= comment.content %>
                <!-- Edit button -->


                <div class="form_ctn ">
                     <!-- <form action="/feedback/<%= feedbackData._id %>/comments/<%= comment._id %>/edit" method="GET">
                    <button type="submit"><img src="/images/edit.svg" alt="edit"></button>
                    
                </form> -->

                <div class="form_ctn">
                    <form action="/feedback/<%= feedbackData._id %>/comments/<%= comment._id %>/edit" method="GET">
                        <input type="image" src="/images/edit.svg" alt="edit">
                    </form>
                </div>


                <form action="/feedback/<%= feedbackData._id %>/comments/<%= comment._id %>/delete" method="POST">
                    
<input type="image" src="/images/delete.svg" alt="edit">
                 
                </form>

                </div>
               <hr class="comment_demacatn">
            </li>
        <% }); %>
    </ul>
<% } else { %>
    <p>No comments yet.</p>
<% } %>
</main>
<!-- </section> -->
<main class="detail_Page">
<form action="/feedback/<%= feedbackData._id %>/comments" method="POST">
    <h2>Add a Comment</h2>
    <div>
        <label for="author">Author:</label><br>
        <input type="text" id="author" name="author" required></div><br>
    
   <div>
    <label for="content">Comment:</label><br>
        <textarea id="content" name="content" rows="4" required></textarea>
    </div>
    
        <br>
   
    <button type="submit">Submit</button>
</form>
</main>
<%- include("./layout/footer.ejs") %>

<!-- Display existing comments -->




<script>
    const closeIcon = document.getElementById("close");
    const nav = document.querySelector("nav");
    const overlay = document.querySelector(".overlay");
    const menuIcon = document.querySelector("img.menu");

    closeIcon.onclick = function() {
      nav.style.transform = "translateX(100%)";
      overlay.style.display = "none";
    }

    menuIcon.onclick = function() {
      nav.style.transform = "translateX(0%)";
      overlay.style.display = "block";
    }

  </script>