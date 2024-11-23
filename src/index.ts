import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'

dotenv.config()
const app: Express = express()
const PORT = process.env.PORT || 8000;

app.use(json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({message: 'Welcome to E-commerce API'});
})

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})