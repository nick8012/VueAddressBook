import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contactsRouter';

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

//app.options('*', cors()); // explicitly handle preflight for all routes

app.use(express.json());
app.use('/api/contacts', contactsRouter);

app.listen(3000, () => console.log('API running on http://localhost:3000'));