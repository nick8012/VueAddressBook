import { z } from 'zod';

export const contactSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Must be a valid email').optional().or(z.literal('')),
    phone: z.union([
        z.literal(''),
        z.string().length(10, 'Phone must be 10 digits').regex(/^[0-9]*$/, 'Phone can only contain numbers'),
    ]).optional().or(z.literal('')),
    address: z.union([
        z.literal(''),
        z.string().max(50).regex(/^[a-zA-Z0-9\s.-]*$/, 'Address can only contain letters and numbers')
    ]).optional(),
    city: z.string().max(30).regex(/^[a-zA-Z\s]*$/, 'City can only contain letters').optional().or(z.literal('')),
    state: z.string().min(2, 'State must have two letters').max(2, "State can only be two letters").regex(/^[a-zA-Z\s]*$/, 'State can only be two letters').toUpperCase().optional().or(z.literal('')),
    zip: z.union([
        z.literal(''),
        z.string().length(5, {message: 'Zip code must be 5 numbers'}).regex(/^[0-9]*$/, 'Zip code must be 5 numbers'),
    ]).optional(),
    })
    .refine(data => data.email || data.phone, {
        message: 'Either email or phone is required',
        path: ['email'],
});

export type ContactInput = z.infer<typeof contactSchema>;