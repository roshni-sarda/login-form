import express from "express";
import User from "../models/user.js";
import validate from "../models/user.js";
import bcrypt from "bcrypt";

const user = express.Router();

user.post("/",async(req,res) => {
    try {
        const { error } = validate(req.body);
        if(error)
        {
          return res.status(400).send({ message:error.details[0].message});
        }
        const user = await User.findOne({ email: req.body.email });
        if(user)
          return res.status(409).send({ message:"User with given mail already exists."})
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({...req.body,password:hashPassword}).save();
        res.status(201).send({ message:"User created successfully"})
    } catch (e) {
          res.status(500).send({ message:"Internal Server Error" })
    }
})



export default user;
