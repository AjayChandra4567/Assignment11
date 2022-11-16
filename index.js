// ## Assignment 11
// - Write a signin and signup api by using joi validations and swagger docs
// - user should have below validation
//     - first name and last name is required and min 3 and max 15
//     - password min 8 , max 15 and should have atleast 1Uppercase,1lower case,1 number and 1 special character
//     - profile photo is option ,file upload handle with BASE64 format
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs  = YAML.load('./api.yaml');
const mongoose = require('mongoose');
const User = require('./User');
const app = express();
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('./validation');
const PORT = process.env.PORT || 3000;

const dbUrl = "mongodb+srv://m001-student:m001-student-basics@sandbox.wls9xpf.mongodb.net/ajayEcomDataBase?retryWrites=true&w=majority";
//Mongo DB
mongoose.connect(dbUrl)
.then((result)=> app.listen(PORT))
.then((result)=> console.log(`Connected to DB and listening to ${PORT}`))
.catch((err)=> console.log(err));

const fileUpload = require('express-fileupload');
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use(express.json());
app.use(fileUpload());


app.post('/register',async(req,res)=>{
    //Validate data before passing
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Check if user exists already
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");
    console.log(req.body);
    // console.log(user);
    //Hash passwords
    // user = [req.body, ...user];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        })
        try{ 
            const SavedUser = await user.save();
            res.send({user:user._id});
        } catch(err){
            res.status(404).send(err);
        }
    });
//Login
app.post('/login',async(req,res)=>{
    //Validate data before login
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Check if user exists exits
    const emailExist = await User.findOne({email: req.body.email});
    if(!emailExist) return res.status(400).send("Email doesn't exists");
    //Password checking
    const validPass = await bcrypt.compare(req.body.password, emailExist.password)
    if(!validPass) return res.status(400).send("Invalid Password");
    
    //create and assign token
    // const token = jwt.sign({_id: emailExist._id}, process.env.TOKEN_SECRET);
    // res.header('auth-token', token).send(token);
    res.send("Logged In!!!");
    });
// var users = [
//     {id: 1, name:"Ajay Chandra"},
//     {id: 2, name:"Vijay"},
//     {id: 3, name:"Kittu"}
// ]

// app.get('/user',(req,res)=>{
//     const obj = {id: 1, name:"Ajay Chandra"};
// res.status(200).send(obj)
// });

// app.get('/users',(req,res)=>{
//     res.status(200).send(users)
// });

// app.get('/users/:id',(req,res)=>{
//     const obj = users.find((x) => x.id === parseInt(req.params.id));
//     res.status(200).send(obj)
// });

// app.post('/create',(req,res)=>{
//     users = [req.body, ...users];
//     res.send(users);
// });

// app.get('/usersQuery',(req,res)=>{
//     const obj = users.find((x) => x.id === parseInt(req.query.id));
//     res.status(200).send(obj)
// });

// app.post('/upload',(req,res)=>{
//     const file = req.files.file
//     let path = __dirname+"/upload"+"file"+Date.now()+".jpg";
//     file.mv(path, (err)=>{
//         res.send("OK");
//     })
// });