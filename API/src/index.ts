import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contacts';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/contacts', contactsRouter);

app.listen(3000, () => console.log('API running on http://localhost:3000'));