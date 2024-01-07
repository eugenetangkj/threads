"use client"

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
import { Textarea } from "@/components/ui/textarea";

//Zod for validation
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { ThreadValidation } from '@/lib/validations/thread';

//Update database
import { updateUser } from '@/lib/actions/user.actions'; //TODO: Update to updatethread later

//Navigation
import { usePathname, useRouter } from 'next/navigation';

// Post thread form to post thread

//Props that is passed to the account profile component
interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    },
    btnTitle: string,
}

function PostThread({ userId } : { userId: string}) {
   
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(ThreadValidation), //Validation
        defaultValues: { //Placing default values into the form
            thread: '',
            accountId: userId,
        }
    });

    //Runs when user presses the create thread button
    const onSubmit = () => {

    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
                {/* Thread change field */}
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Content</FormLabel>
                        <FormControl className='no-focus border border-dark-3 bg-dark-3 text-light-1'>
                            <Textarea
                            rows={15}
                            { ... field }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="bg-primary-500 hover:bg-violet-400 duration-300">Post Thread</Button>


            </form>
        </Form>
    );
    
        
}

export default PostThread;