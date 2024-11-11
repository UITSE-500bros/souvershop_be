import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import { createClient } from '@supabase/supabase-js'
dotenv.config()
const app: Express = express()
const PORT: number = 8000

dotenv.config()
app.use(json())
app.use(cors())


app.get('/', (req: Request, res: Response) => {
  
  return res.status(200).json({message: 'Welcome to E-commerce API'});

})
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
