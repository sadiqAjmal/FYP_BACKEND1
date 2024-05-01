import express from 'express';
import jwt from 'jsonwebtoken'
import { Login } from '../controllers/auth/login';
import { signup } from '../controllers/auth/signup';
import { forgotPass } from '../controllers/auth/forgotPass';
import bcrypt from 'bcrypt'
import User from '../models/user';
import Caretaker from '../models/caretaker';
const router = express.Router();
router.post('/login', async (req, res) => {
  console.log(req.body)
  try{
    await Login(req,res);
  }
  catch(err){ 
    console.log("Error in login", err);
  }
});
router.post('/signup',async(req,res)=>{
  console.log(req.body)
  try{
    console.log(req.body)
    await signup(req.body);
    res.send({data:'User Inserted Successfully'});
  }catch(error)
  {
    console.log(error);
    res.status(401).send({error:error});
  }
})
router.post('/forgot-password',async(req,res)=>{
  try{
    await forgotPass(req.body);
    res.send('We have sent you an email');
  }catch(error)
  {
    console.log(error);
    res.status(401).send({ error: error});
  }
})
router.post('/newpass/verify-token',async (req, res) => {
  try {
    let token = req.headers.authorization;
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET );
      const user=await User.findOne({email:decodedToken.email});
      console.log(decodedToken);
      if (user) {
      res.send("Token Verified");
      } else {
      throw new Error("Your Token Has Expired");
      }
    }
    catch (err) {
    res.status(404).send({error:err.message});
  }
});
router.post('/newpass/resetPassword',async (req, res) => {
  try {
    const newPass=req.body.newPass;
    let token = req.headers.authorization;
    token=token.split(' ')[1];
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET );
      let hashedPass= await bcrypt.hash(newPass,10);
      const user=User.findOneAndUpdate({email:decodedToken.email},{password:hashedPass}).exec();
      if(!user)
      throw "User not found";
      res.send("Password Updated Successfullly");
    }
    catch (err) {
      console.log(err);
    res.status(404).send({error:err.message});
  }
});

router.get(`/verify/:token`, async (req, res) => {
  const { token } = req.params;
  console.log(token);
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken)
    const user = await User.findOneAndUpdate({ email: decodedToken.email }, { status: "verified" });
    const careTaker=await Caretaker.findOneAndUpdate({ email: decodedToken.email }, { status: "verified" })
    console.log(careTaker)
    if (careTaker||user) {
      // Render an HTML page with a loader
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>User Verified</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .hidden {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <p id="message" class="hidden">User verified successfully!</p>
        <script>
          setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
            document.getElementById('message').style.display = 'block';
          }, 1000); // 1 second delay
        </script>
      </body>
      </html>

      `);
    } else {
      throw new Error("Your Token Has Expired");
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


export default router;