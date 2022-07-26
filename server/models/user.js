import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this.id},process.env.JWTPRIVATEKEY,{expiresIn:'7d'});
    return token
}

const User = mongoose.model("user",userSchema);

const validate = (data) => {
    const schema = Joi.object({
      firstName:Joi.string().required().label("firstName"),
      lastName:Joi.string().required().label("LastName"),
      email:Joi.string().email().required().label("Email"),
      password:passwordComplexity().required().label("Password")
    });
    return schema.validate(data)
};

export default User;
