import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import contactsRouter from './routes/contactsRouter';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

//app.options('*', cors()); // explicitly handle preflight for all routes

app.use(express.json());
app.use('/api/contacts', contactsRouter);

if(isProd) {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('*{path}', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    })
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('API running on port ${port}'));