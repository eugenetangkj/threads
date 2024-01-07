import * as z from 'zod';

//Rules for validating thread information when filling up the form for creating/editing of threads
export const ThreadValidation = z.object({
    thread: z.string().min(3, { message: 'Minimum 3 characters'}).max(30, { message: 'Maximum 30 characters'}),
    accountId: z.string(),
});

//Rules for validating comment information when filling up the form for creating/editing of comments
export const CommentValidation = z.object({
    thread: z.string().min(3, { message: 'Minimum 3 characters'}).max(30, { message: 'Maximum 30 characters'}), //Every comment is a thread on its own
});