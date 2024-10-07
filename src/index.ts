import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {Pool} from 'pg'
dotenv.config()
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})
const app: Express = express()
const PORT: number = 8000

dotenv.config()
app.use(json())
app.use(cors())


app.get('/', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1')
    res.send('Database connection successful')
  } catch (err) {
    console.error(err)
    res.status(500).send('Database connection failed')
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
