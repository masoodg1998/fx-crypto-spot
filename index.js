const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose") 
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer")
const path = require("path")
const cors = require("cors")

// const port = process.env.PORT||"5000"
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")))


app.use(cors({
    origin: [, 'http://localhost:5000', "https://fx-crypto-spot.herokuapp.com"],
    credentials: true
}))
// mongoose.connect(process.env.MONGO_URL).then(console.log("Connected to MongoDB")).catch(err=>(console.log(err)));



let dbURI = process.env.MONGO_URL||"mongodb+srv://fxcryptospot:03472503500@cluster0.bnnszy5.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

///////////************** Mongodb connected or disconnected Events ***********/////////////

mongoose.connection.on('connected', function () {
    console.log(`Mongoose is connected ${process.env.PORT || 5000}`)

})

mongoose.connection.on('disconnectes', function () {
    console.log("mongoose is disconnected")
    process.exit(1)
})


mongoose.connection.on('error', function (err) {
    console.log('mongoose connecion is in error: ', err)
    process.exit(1)

})

mongoose.connection.on('SIGNIT', function () {
    console.log('app is turminating')
    mongoose.connection.close(function () {
        console.log('mongoose default connection is closed')
        process(0)
    })


})







const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, "images")
    }, filename:(req,file,cb)=>{
        cb(null, req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded"); 
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend is running.")
});
