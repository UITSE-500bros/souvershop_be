import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/category_route'
dotenv.config()
const app: Express = express()
const PORT: number = 8000

dotenv.config()
app.use(json())
app.use(cors())

app.use('/', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
