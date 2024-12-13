import express, { Express, Request, Response, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import session from 'express-session';
dotenv.config()
import passport from 'passport';
const app: Express = express()
const PORT = process.env.PORT || 8000;
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

dotenv.config()
app.use(json())
app.use(cors())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req: Request, res: Response) => {
  
  return res.status(200).json({message: 'Welcome to E-commerce API'});

})
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})