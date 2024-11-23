import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import session from 'express-session';
dotenv.config()
import passport from 'passport';
const app: Express = express()
const PORT = process.env.PORT || 8000;

dotenv.config()
app.use(json())
app.use(cors())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret in production
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: false, // Don't create sessions for unauthenticated users
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      httpOnly: true, // Prevents client-side JS from accessing cookies
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req: Request, res: Response) => {
  
  return res.status(200).json({message: 'Welcome to E-commerce API'});

})
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
