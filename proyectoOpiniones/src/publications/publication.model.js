'use strict'

import { Schema, model } from 'mongoose'

const publicationSchema = Schema({
    author:{
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    category:{
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    content:{
        type: String,
        required: true
    }
},{
    versionKey: false
})

export default model('publication', publicationSchema)