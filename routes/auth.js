const router = require("express").Router();
const User = require("../models/User");
// const stringToHash = require("stringToHash");
// const varifyHash = require("varifyHash");
// const validateHash = require("validateHash");
const bcrypt = require("bcrypt-inzi")


// REGISTER
router.post("/register", async (req,res)=>{
    try{
        bcrypt.stringToHash(req.body.password).then(hashedPass => {
            console.log("hash: ", string);
            const newUser = new User(
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPass,
        })
        // const salt = await bcrypt.genSalt(10);
        // const hashedPass = await bcrypt.hash(req.body.password, salt)
            }
        )
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)    }
});

// LOGIN

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(400).json("Wrong credentials!");

        const validated = bcrypt.varifyHash(req.body.password, user.password) 
        // const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong credentials!");

        const {password, ...others } = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router

