import * as z from 'zod';

//Rules for validating user information when filling up the form
export const UserValidation = z.object({
    profile_photo: z.string().url().min(1), //Ensures that string is not empty,
    name: z.string().min(3, { message: 'Minimum 3 characters'}).max(30, { message : 'Maximum 30 characters'}),
    username: z.string().min(3, { message: 'Minimum 3 characters'}).max(30, { message : 'Maximum 30 characters'}), 
    bio: z.string().min(3, { message: 'Minimum 3 characters'}).max(1000, { message : 'Maximum 1000 characters'}),  
    
});