import { Router } from 'express';
import { contactSchema } from '@vue-address-book/shared';
import * as svc from '../services/contactService'

const router = Router();

router.get('/', async (req, res) => {
  const all = svc.getAll();
  res.json(all);
});

router.post('/', async (req, res) => {
  //console.log("Request: ", req.body); //debug
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  const contact = svc.create(result.data);
  res.json(contact);
});

router.put('/:id', async (req, res) => {
  //console.log('Request body:', req.body); //debug
  const result = contactSchema.safeParse(req.body);
  if(!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  const contact = svc.update(Number(req.params.id), result.data);
  res.json(contact);
});

router.delete('/:id', async (req, res) => {
  svc.remove(Number(req.params.id))
  res.status(204).send();
});

export default router;