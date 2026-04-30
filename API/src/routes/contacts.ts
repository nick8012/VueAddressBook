import { Router } from 'express';
import { db } from '../db';
import { contacts } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  const all = db.select().from(contacts).all();
  res.json(all);
});

router.post('/', async (req, res) => {
  const result = db.insert(contacts).values(req.body).returning().get();
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const result = db.update(contacts).set(req.body)
    .where(eq(contacts.id, Number(req.params.id))).returning().get();
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  db.delete(contacts).where(eq(contacts.id, Number(req.params.id))).run();
  res.status(204).send();
});

export default router;