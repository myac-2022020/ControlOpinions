'use strict'

import { Router } from "express"
import { addCategory, test } from "./category.controller.js"
import { validateJwt } from "../middlewares/validate.jwt.js"

const api = Router()

api.get('/test',[validateJwt], test)
api.post('/add', [validateJwt], addCategory)

export default api