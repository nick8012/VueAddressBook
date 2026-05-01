import { contacts } from "../db/schema";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { ContactInput } from '@vue-address-book/shared';

export function getAll() {
    return db.select().from(contacts).all();
}

export function getById(id: number) {
    return db.select().from(contacts).where(eq(contacts.id, id)).get();
}

export function create(data: ContactInput) {
    return db.insert(contacts).values(data).returning().get();
}

export function update(id: number, data: ContactInput) {
    return db.update(contacts).set(data).where(eq(contacts.id, id)).returning().get();
}

export function remove(id: number) {
  return db.delete(contacts).where(eq(contacts.id, id)).run();
}