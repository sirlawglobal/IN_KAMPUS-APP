const ProductModel = require('../models/products_model');
const AdminModel = require('../models/admin_model')
// const ProductModel =  require('../../..models/products');
// const productsModel = require('../../models/products');


const homePage = (req, res)=>{
  res.render("home") 
}

const productPage =  (req, res)=>{
    ProductModel.find().then((products) =>{
    res.render("products", {productsData: products})
})
}


const create_Product_page = (req , res) =>{
  res.render("create_Product.ejs", {error : req.flash("errorMsg"), form: req.flash("form")})
}

const create_product =  (req,res) =>{
  const productData = {
      name: req.body.name,
      price: req.body.price,
      category : req.body.category,
      description:req.body.description,
      image: req.body.image,
      admin: req.session.adminId
}

ProductModel.create(productData)
  .then( resp =>{
    console.log(req.body)
    res.redirect("/products");
})
  .catch( err =>{
// console.log(err)
    req.flash("errorMsg", err._message)
    req.flash("form", req.body)
    res.redirect("/products/new");
})
}

const single_Product_page =(req, res)=>{
  ProductModel
    .findById(req.params.productId)
    .then(product =>{
      res.render("single-product", {productData: product});
  })
    .catch( err =>{
      res.redirect("/products");
  })
}

const edit_Products_Page =(req, res)=>{
  ProductModel
  .findById(req.params.productId)
  .then(product =>{
    res.render("edit_Product", {productData: product, error: ""});
})
  .catch( err =>{
    res.redirect("/products");
})
}

const edit_Products =  (req, res) =>{
  const productId =req.params.productId;
      const productData = {
          name: req.body.name,
          price: req.body.price,
          category : req.body.category,
          description:req.body.description,
          image: req.body.image
      }
      ProductModel.updateOne({_id: productId}, productData)
      .then( ()=>{
          res.redirect("/products/" + productId);
      })
      .catch( err =>{
          req.flash("errorMsg", err._message);
          res.redirect(`/products/${productId}/edit`);
      })
      }

      const delete_product =  (req, res) =>{
        const productId =req.params.productId;
        ProductModel.findByIdAndDelete(productId)
        .then( ()=>{
            res.redirect("/products/");
        })
        .catch( err =>{
            req.flash("errorMsg", err._message);
            res.redirect("/products/");
        })
        }

module.exports = {
  homePage , productPage ,create_Product_page, single_Product_page ,
  edit_Products_Page,
  create_product ,
  edit_Products,
  delete_product
  
}





<%- include("./layout/header.ejs") %>

    <main class="products">
        <%productsData.forEach(function(product,index){ %>

  <article class="product">
            <img src="<%= product.image%>" alt="">
            <h3><%= product.name %></h3>
            <div class="flex">
                <p class="price"><%= product.price %></p>
                <p class="category"><%= product.category.slice(0,1).toUpperCase() + product.category.slice(1)%></p>
            </div>
            <a href="/products/<%= product._id %>" >View product</a>
        </article>
      <%  }) %>
      

        <!-- <article class="product">
            <img src="images/1.png" alt="">
            <h3>Product Name</h3>
            <div class="flex">
                <p class="price">20.05</p>
                <p class="category">Category</p>
            </div>
            <a href="/products/:productId">View product</a>
        </article> -->

       
    
       
     
    </main>
    <%- include("./layout/footer.ejs") %>