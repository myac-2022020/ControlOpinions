'use strict'

import Comment from './comments.model.js'
import Publication from '../publications/publication.model.js'

export const test = (req, res)=>{
    return res.send('Hello world')
}

export const addComment = async(req, res)=>{
    try {
        let data = req.body
        data.user = req.uid
        let comment = new Comment(data)
        await comment.save()
        return res.send({message: 'The comment has been published successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error for comment'})
    }
}

export const getCommentsForPublication = async (req, res) => {
    try {
        const publicationId = req.params.id
        console.log(publicationId);
        const publication = await Publication.findById(publicationId);
        if (!publication) {
            return res.status(404).send({ message: 'Publication not found' });
        }
        const comments = await Comment.find({ publication: publicationId });
        return res.send({ comments });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching comments for publication' });
    }
};

export const updateComment = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let comment = await Comment.findByIdAndUpdate(id, data,{ new: true })
        console.log(req.uid.toString());
        console.log(comment.user.toString());
        if (!comment) return res.status(404).send({ message: 'Comment not found' });
        if (req.uid.toString() !== comment.user.toString()) return res.status(404).send({ message: 'You can only update your comments' });
        return res.send({ message: 'Update successfully', comment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating your comment' });
    }
};

export const deleteComment = async(req, res)=>{
    try {
        let { id } = req.params
        let comment = await Comment.findOneAndDelete({_id: id})
        if(!comment) return res.status(404).send({message: 'Comment not found'})
        let idToken = req.uid
        let idUserComment = comment.user
        console.log(idToken);
        console.log(idUserComment);
        if(idUserComment != idToken) return res.status(403).send({message: 'You can only delete your comments'})        
        return res.send({message: 'Comment successfully deleted'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error for delete your comment'})
    }
}
