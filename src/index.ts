import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app: Express = express()
const PORT: number = 8000

dotenv.config()
app.use(json())
app.use(cors())

app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json('Database connected');
  } catch (err) {
    res.status(500).json('Fail to connect to database');
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
