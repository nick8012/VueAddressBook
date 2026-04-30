import axios from 'axios';

export interface Contact {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
}

const base = 'http://localhost:3000/api/contacts';

export const getContacts = () => axios.get(base).then(r => r.data);
export const createContact = (data: any) => axios.post(base, data).then(r => r.data);
export const updateContact = (id: number, data: any) => axios.put(`${base}/${id}`, data).then(r => r.data);
export const deleteContact = (id: number) => axios.delete(`${base}/${id}`);