"use client"; //Need this everytime we use a form, as a form is a browser event

//React hook form
import { useForm } from 'react-hook-form';

//Form components from shadcn
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

//Zod for validation
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { CommentValidation } from '@/lib/validations/thread';

//Update database
import { updateUser } from '@/lib/actions/user.actions'; //TODO: Update to updatethread later

//Navigation
import { usePathname, useRouter } from 'next/navigation';

// Add comment to thread
import { addCommentToThread } from '@/lib/actions/thread.actions';

import Image from 'next/image';


interface Props {
    threadId: string,
    currentUserImg: string,
    currentUserId: string,
}

function Comment({
    threadId,
    currentUserImg,
    currentUserId
}: Props) {
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation), //Validation
        defaultValues: { //Placing default values into the form
            thread: '',
        }
    });

    //Runs when user presses the create comment button
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        //Create comment
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );

        //Reset field to add another comment
        form.reset();
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">

                {/* Comment field */}
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className='flex items-center gap-3 w-full'>
                        <FormLabel>
                            <Image src={currentUserImg} alt="Profile Image" width={48} height={48}
                                className='rounded-full object-cover' />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input
                            type="text"
                            {...field}
                            placeholder="Comment on the thread"
                            className='no-focus text-light-1 outline-none'
                            />
                        </FormControl>
                    </FormItem>
                )}
                />

                <Button type="submit" className="comment-form_btn ">Reply</Button>
            </form>
        </Form>
    )

}


export default Comment;