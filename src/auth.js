// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('./userModel');


// exports.signup = async (req,res) =>{
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password,10);
//         const user = new User({email:req.body.email,password:hashedPassword});
//         await user.save();
//         const token = jwt.sign({id:user._id}, process.env.SECRET,{expiresIn:'3h'});
//         res.status(201).json({token});
//     } catch (error) {
//         res.status(400).json({message:error.message});
//     }
// }

//     exports.login = async (req,res) =>{
//         try {
//             const user = await User.findOne({email:req.body.email});
//             if(!user || !await bcrypt.compare(req.body.password,user.password)){
//                 return res.status(401).json({message:'Invalid password or email'})
//             }

//             const token = jwt.sign({id:user._id}, process.env.SECRET,{expiresIn:'3h'});
//             res.status(200).json({ token, message: "Login successful" });

//         } catch (error) {
//             res.status(400).json({message:error.message})
//         }
//     }


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./userModel');

const { body, validationResult } = require('express-validator');

exports.signup = [
    // Validation rules
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Create new user
            const user = new User({
                email: req.body.email,
                password: hashedPassword
            });

            await user.save();

            // Generate a token
            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '3h' });

            res.status(201).json({ token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

exports.login = [
    // Validation rules
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '3h' });

            res.status(200).json({ token, message: 'Login successful' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];
