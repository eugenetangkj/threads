"use client"

import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";


import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { UserValidation } from '@/lib/validations/user';
import Image from 'next/image';

//Profile form that can appear differently in different areas depending on the props given

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


const AccountProfile = ({ user, btnTitle } : Props) => {
    const form = useForm({
        resolver: zodResolver(UserValidation), //Validation
        defaultValues: { //Placing default values into the form
            profile_photo: '',
            name: '',
            username: '',
            bio: '',
        }
    });

    const handleImage = (e: ChangeEvent, fieldChange: (value: string) => void ) => {
        e.preventDefault();
    }

    function onSubmit(values: z.infer<typeof UserValidation> ) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-start gap-10">
                {/* Profile picture image upload */}
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className='flex items-center gap-4'>
                    <FormLabel className='account-form_image-label'>
                        { field.value ? (
                            <Image src={field.value} alt='Profile Photo' width={96} height={96} priority
                            className='rounded-full object-contain' />
                        ): <Image src='assets/profile.svg' alt='Profile Photo' width={24} height={24}
                            className='object-contain' /> 
                        }
                    </FormLabel>
                    <FormControl className='flex-1 text-base-semibold text-gray-200'>
                        <Input
                        type='file'
                        accept='image/*'
                        placeholder='Upload a photo'
                        className='account-form_image-input'
                        onChange={ (e) => handleImage(e, field.onChange)} />
                    </FormControl>
                    </FormItem>
                )}
                />

                {/* Name change field */}
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className='flex items-center gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
                    <FormControl className='flex-1 text-base-semibold text-gray-200'>
                        <Input
                        type='text'
                        className='account-form_input no-focus'
                        { ... field }
                        />
                    </FormControl>
                    </FormItem>
                )}
                />

                {/* Username change field */}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className='flex items-center gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
                    <FormControl className='flex-1 text-base-semibold text-gray-200'>
                        <Input
                        type='text'
                        className='account-form_input no-focus'
                        { ... field }
                        />
                    </FormControl>
                    </FormItem>
                )}
                />

                {/* Bio change field */}
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className='flex items-center gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                    <FormControl className='flex-1 text-base-semibold text-gray-200'>
                        <Textarea
                        rows={10}
                        className='account-form_input no-focus'
                        { ... field }
                        />
                    </FormControl>
                    </FormItem>
                )}
                />



                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;