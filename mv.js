const mongoose = require("mongoose");
const express = require('express');
const app = express();
const fs = require('fs');
const formidable = require('formidable');
const path = require("path");
const fileUpload = require("express-fileupload");
// const cors = require("cors");

const bodyParser = require("body-parser")
const UserModel = require("./model/user_data_Model")



//db connection mongodb://127.0.0.1:27017
mongoose.connect("mongodb://127.0.0.1:27017/CV_PLATFORM")
.then((res) =>{
console.log("Database Connected")
})
.catch((err) =>{
console.log("Error connecting to Db:", err.message)
})


//set up the route
app.set("view engine" , "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/uploads"));

//Cor blocking
// const corConfig = {
//   origin:true,
//   credentials:true,
//   allowHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "X-Access-Token",
//     "Authorization",
//     "Access-Control-Allow-origin"
//   ] 
// }

//middlewares
app.use(fileUpload());
// app.use(cors(corConfig));
app.use(bodyParser.urlencoded({extended:false}))

app.get("/", (req, res)=>{
  res.render("index")
})

const user ={
  name: "sule"
}
// app.post("/upload" , (req, res) =>{
//     const form = new formidable.IncomingForm();

//     form.parse(req, (error , fields, files)=>{

//     // console.log(files)

//   for (let i = 0; i < files.cv.length; i++) {
//     const currentPath = files.cv[i].filepath;
    
//     // const newPath = __dirname + "/uploads/"+ files.cv[0].originalFilename.split(".",).slice(-1)[0];

//     //naming according to username
//     // const newPath = __dirname + "/uploads/" + user.name + path.extname(files.cv[0].originalFilename);

//     //naming  according to file_name
//     const newPath = __dirname + "/uploads/" + fields.filename + path.extname(files.cv[i].originalFilename + i);

//     fs.rename(currentPath, newPath, (err) =>{
//       if(err) throw err 
     
//       })
//   }
  
//    res.send("<h1>File Uploaded successfully</h1>")
//     }
  

//   )
//   }) 

// app.post("/upload", (req, res) =>{
// const file = req.files.cv;
// file.mv(__dirname + "/uploads/" + file.name, (err) =>{
//   if(err) throw err;
//   res.send("File Uploaded Successfully");
// }
// )

// })

app.post("/signup", (req, res) =>{
  const {username, email} = req.body;
  const {picture, cv} = req.files;

  //renaming of the sent files for saving on server
const cvName = username + "_cv" + path.extname(cv.name);
const pictureName = username + "_picture" + path.extname(picture.name);

// const uploadDirectory = path.join(__dirname, 'upload');
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

//moving it to upload directory
cv.mv(__dirname + "/uploads/cvs/" + cvName, (err) =>{
  if(err) throw err;
  // res.send("File Uploaded Successfully");

  picture.mv(__dirname + "/uploads/profile_pictures/" + pictureName, (err) =>{
  if(err) throw err;

//after moving , the saving it to database
const UserData ={
  username : username,
  email : email,
  cv_name : cvName,
  profile_pic_name : pictureName
}

UserModel.create(UserData )
  .then(() =>{
    res.send("User Created Successfully")
  })
  .catch((err) =>{
    console.log(err)
    return res.send("Error creating account")
  })


})

}
)

// console.log(cvName)
// console.log(pictureName)
  // console.log(username , email)
  // console.log(picture , cv)
})

app.get("/users/:username" , (req, res) =>{

  const user = req.params.username.toLowerCase();

  UserModel.findOne({username: user})
    .then((userData =>{
      console.log(userData);
       res.render("profile.ejs" , {profile: userData})
    }))
    .catch((err) =>{
      res.sendDate("Error in fetching User Data")
    })
 
})


app.listen(5000, ()=>{
  console.log("App is pumping on the server on localhost:5000.")
})



app.get("/users/:username" , (req, res) =>{

  const user = req.params.username.toLowerCase();

  UserModel.findOne({username: user})
    .then((userData =>{
      console.log(userData);
       res.render("profile.ejs" , {profile: userData})
    }))
    .catch((err) =>{
      res.sendDate("Error in fetching User Data")
    })
 
})

<img src="../profile_pictures/<%= profile.profile_pic_name %>"

app.use(express.static(__dirname + "/uploads"));


"/uploads/profile_pictures/" 