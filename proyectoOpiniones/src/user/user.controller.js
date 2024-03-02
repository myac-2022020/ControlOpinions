'use strict'

import express from 'express'
import User from './user.model.js'
import { checkPassword, checkUpdate, encrypt } from '../utils/validator.js'
import { generateJWT } from '../utils/jwt.js'

export const test = (req, res)=>{
    return res.send('Hello world')
}

export const register = async(req, res)=>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error to register user'})
    }
}

export const login = async(req, res)=>{
    try {
        let { username, email, password } = req.body
        if(!username){
            console.log('Logged with gmail')
            let gmail = await User.findOne({email})
            if(gmail && await checkPassword(password, gmail.password)){
                let loggedUser={
                    uid: gmail._id,
                    username: gmail.username,
                    email: gmail.email,
                    name: gmail.name,
                    role: gmail.role
                }
                let token = await generateJWT(loggedUser)
                return res.send({message: `Welcome ${gmail.name}`, loggedUser, token})
            }
        }else{
            console.log('Logged with username')
            let user = await User.findOne({email})
            if(user && await checkPassword(password, user.password)){
                let loggedUser={
                    uid: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
                let token = await generateJWT(loggedUser)
                return res.send({message: `Welcome ${user.name}`, loggedUser, token})
            }
        }
        let user = await User.findOne({username})
        if(user && await checkPassword(password, user.password)){
            let loggedUser={
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJWT(loggedUser)
            return res.send({message: `Welcome ${user.name}`, loggedUser, token})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        let idToken = req.uid
        if(id != idToken) return res.send({message: 'You can only update your user data'})
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });
        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!updateUser) if (!update) return res.status(400).send({ message: 'User not found and not updated' });
        return res.send({ message: 'Update user', updateUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error to update the data'})
    }
}