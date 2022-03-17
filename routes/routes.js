const auth = require("./auth");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const Model = require('../models/model');

const express = require('express');
const model = require("../models/model");

const router = express.Router()

router.post('/register', async(req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).send("All input is required");
      }
        const oldUser = await Model.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      encryptedPassword = await bcrypt.hash(password, 10);

        const data = new Model({
          email: email,
          password: encryptedPassword ,
        });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }

})

router.post("/login", async (req, res) => {

    try {

      const { email, password } = req.body;
  
    
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
     
      const user = await Model.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
    
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        res.status(200).json({token});
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    
  });

router.get('/users', auth, async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
    
})

module.exports = router;