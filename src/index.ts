import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response, json } from 'express';
import session from 'express-session';
import fs from 'fs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import router from './routes';
import cookieParser from 'cookie-parser';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Load Swagger Document
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);



// Register Google Strategy
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_CALLBACK_URL
        : 'http://localhost:8000/api/auth/oauth2/redirect/google',
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile);
        done(null, profile); // Pass the profile to the next middleware
      } catch (error) {
        console.error('Google OAuth Error:', error);
        done(error);
      }
    }
  )
);

// Middleware
app.use(json());
app.use(cookieParser());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to E-commerce API' });
});

app.use('/api', router);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack); // Log error
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});