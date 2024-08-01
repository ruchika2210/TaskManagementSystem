const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./userModel');


exports.signup = async (req,res) =>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const user = new User({email:req.body.email,password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id}, process.env.SECRET,{expiresIn:'3h'});
        res.status(201).json({token});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

exports.login = async (req,res) =>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user || !await bcrypt.compare(req.body.password,user.password)){
            return res.status(401).json({message:'Invalid password or email'})
        }

        const token = jwt.sign({id:user._id}, process.env.SECRET,{expiresIn:'3h'});
        res.status(200).json({token});

    } catch (error) {
        res.status(400).json({message:error.message})
    }
}