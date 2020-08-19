import { Router } from 'express'
import { postPageForm } from '../controllers/pageFormController'

export const pageFormRoute = Router()

pageFormRoute.post('/postpageform', postPageForm)
