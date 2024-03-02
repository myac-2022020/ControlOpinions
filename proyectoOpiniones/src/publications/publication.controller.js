'use strict'

import Publication from './publication.model.js'
import Category from '../category/category.model.js'

export const test = async(req, res)=>{
    return res.send('Hello world')
}

export const createPublication = async(req, res)=>{
    try {
        let data = req.body
        data.author = req.uid
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.send({message: 'Category not found'})
        let publication = new Publication(data)
        await publication.save()
        return res.send({message: 'Publication created successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error from create publication'})
    }
}

export const listPublications = async(req, res)=>{
    try {
        const publications = await Publication.find()
            .populate('category', ['name'])
            .populate('author', ['name'])
        if(publications.length === 0) return res.status(404).send({message: 'Publications not found'})
        return res.send({message: 'Publications', publications})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error to list'})
    }
}

export const listMyPublications = async(req, res)=>{
    try {
        let { _id } = req.user
        console.log(_id);
        let publications = await Publication.find({author: _id}, {author: 0})
            .populate('category', ['name'])
            .populate('author', ['name'])
        if(publications.length === 0) return res.status(500).send({message: 'You have no publications'})
        return res.send({message: 'Your publications ', publications})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error listing your publications'})
    }
}

export const updatePublication = async (req, res) => {
    try {
        const publicationId = req.params.id;
        const newData = req.body;
        let updatedPublication = await Publication.findByIdAndUpdate(publicationId, newData, { new: true });
        console.log('User ID', updatedPublication.author.toString())
        console.log('ID de token', req.uid.toString());
        if (updatedPublication.author.toString() !== req.uid.toString()) {
            return res.status(403).send({ message: 'You are not authorized to update this publication' });
        }
        if (!updatedPublication) {
            return res.status(404).send({ message: 'Publication not found or not updated' });
        }
        return res.send({ message: 'Publication updated successfully', updatedPublication });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating publication' });
    }
};
export const deletePublication = async(req, res)=>{
    try {
        let { id } = req.params
        let publication = await Publication.findOneAndDelete({_id: id})
        if(publication.author.toString() != req.uid.toString()) return res.send({message: 'You can only update your posts'})
        if(!publication) return res.status(404).send({message: 'Publication not found'})
        return res.send({message: `Your publication with title ${publication.title} as delete successfully`})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error for delete publication'})
    }
}



