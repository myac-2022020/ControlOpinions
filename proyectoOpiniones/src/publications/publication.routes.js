'use strict'

import { Router } from "express"
import { validateJwt } from "../middlewares/validate.jwt.js"
import { createPublication, deletePublication, listMyPublications, listPublications, test, updatePublication } from "./publication.controller.js"

const api = Router()

api.get('/test', [validateJwt], test)
api.post('/create', [validateJwt], createPublication)
api.get('/listAll', [validateJwt], listPublications)
api.get('/myPublications', [validateJwt], listMyPublications)
api.put('/update/:id', [validateJwt], updatePublication)
api.delete('/delete/:id', [validateJwt], deletePublication)

export default api