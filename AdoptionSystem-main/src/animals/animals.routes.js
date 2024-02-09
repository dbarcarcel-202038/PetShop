import express from 'express'
import { test, regis, upda, deleteA } from './animals.controller.js';

const api = express.Router();

api.get('/test', test)
api.post('/regis', regis)
api.put('/upda/:id', upda)
api.delete('/deleteA/:id', deleteA)

export default api