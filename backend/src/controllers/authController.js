import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';
import e from 'express';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req,res) =>{
    try {
        const {username, password, email, firstName, lastName} = req.body;
        
        if(!username||!password||!email||!firstName||!lastName){
            return res.status(400).json({message:"please fill in the empty blanks"})
        }

        const duplicate = await User.findOne({username});

        if (duplicate){
            return res.status(409).json({message:"username is already taken!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            hashedPassword,
            email,
            displayName: firstName + " " + lastName
        })

        return res.sendStatus(204);
        
    } catch (error) {
        console.error("Sign up wrong ", error);
        return res.status(500).json({message:"system error!"});
    }
};

export const signIn = async (req,res) =>{
    try {
        const {username, password} = req.body;

        if(!username||!password){
            return res.status(400).json({message:"Missing username or password!"})
        }

        const user = await User.findOne({username});

        if (!user){
            return res.status(401).json({message:"Invalid username or password!"})
        }

        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordCorrect){
            return res.status(401).json({message:"Invalid username or password!"})
        }

        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: REFRESH_TOKEN_TTL
        })

        return res.status(200).json({message:`${user.displayName} signed in successfully!`, accessToken});
    } catch (error) {
        console.error("Sign in wrong ", error);
        return res.status(500).json({message:"system error!"});
    }
};

export const signOut = async (req,res) =>{
    try {
        const token = req.cookies?.refreshToken;

        if (token){
            await Session.deleteOne({refreshToken: token});
            res.clearCookie("refreshToken");
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error("Sign out wrong ", error);
        return res.status(500).json({message:"system error!"});
    }


};  
export const refreshToken = async (req,res) =>{
    try {
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(401).json({message:"Missing refresh token!"});
        }

        const session = await Session.findOne({refreshToken: token});

        if(!session){
            return res.status(401).json({message:"Invalid refresh token!"});
        }

        if(session.expiresAt < new Date()){
            return res.status(401).json({message:"Refresh token expired!"});
        }

        const accessToken = jwt.sign({
            userId: session.userId
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL}); 

        return res.status(200).json({accessToken});
    } catch (error) {
        console.error("Refresh token wrong ", error);
        return res.status(500).json({message:"system error!"});
    }
};