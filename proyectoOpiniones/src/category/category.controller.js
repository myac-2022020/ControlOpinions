'use strict'

import express from 'express'
import Category from './category.model.js'

export const test = (req, res)=>{
    return res.send('Hello world')
}

export const addCategory = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        category.save()
        return res.send({message: 'Category succesfully added'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error from add category'})
    }
}