'use strict'

import { Router } from "express"
import { addComment, deleteComment, getCommentsForPublication, test, updateComment } from "./comments.controller.js"
import { validateJwt } from "../middlewares/validate.jwt.js"

const api = Router()

api.get('/test',[validateJwt], test)
api.post('/addComment', [validateJwt], addComment)
api.post('/listComment/:id', [validateJwt], getCommentsForPublication)
api.put('/update/:id', [validateJwt], updateComment)
api.delete('/delete/:id', [validateJwt], deleteComment)

export default api