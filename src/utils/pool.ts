import {Pool} from 'pg'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js';
dotenv.config()


const projectUrl = process.env.PROJECT_URL as string;
const projectApiKey = process.env.PROJECT_API_KEYS as string;

export const supabase = createClient(projectUrl, projectApiKey);


export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})