"use client"

import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";


import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { UserValidation } from '@/lib/validations/user';
import Image from 'next/image';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

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
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserValidation), //Validation
        defaultValues: { //Placing default values into the form
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        }
    });

    //Handles when user selects a new image
    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void ) => {
        //Prevent browser from reloading
        e.preventDefault();

        const fileReader = new FileReader();

        //User submitted at least 1 file
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            //User did not submit a file of type image
            if (! file.type.includes('image')) {
                return;
            }

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl); //Update form field with the newly uploaded image
            }

            fileReader.readAsDataURL(file); //Read the given image file

        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation> ) => {
        //Update user's information in the database
        const blob = values.profile_photo; //Get the value from the FormField with name profile_photo

        //By checking if the blob is a base 64 image, we can tell if the user has uploaded
        //a new image. If he uploaded a new image, the value in the form field will be an image.
        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            //Use UploadThing to upload the image
            const imgRes = await startUpload(files);

            //Update values in form field
            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url;
            }
        }

        //Call backend to update user profile
        await updateUser({
            userId: user.id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname  //Path that we are coming from
        });

        //Reroute after updating user information, depending on where
        //the user had come from
        if (pathname === '/profile/edit') {
            //Navigate back to the previous page
            router.back();
        } else {
            //Go from onboarding to main page
            router.push('/');
        }
          
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
                                className='rounded-full object-contain cursor-pointer'
                                style={{ maxHeight: '96px', maxWidth: '96px', objectFit: 'cover' }} />
                            ): <Image src='assets/profile.svg' alt='Profile Photo' width={24} height={24}
                                className='object-contain cursor-pointer' /> 
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
                        <FormMessage />
                    </FormItem>
                )}
                />

                {/* Name change field */}
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
                        <FormControl>
                            <Input
                            type='text'
                            className='account-form_input no-focus'
                            { ... field }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                {/* Username change field */}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
                        <FormControl>
                            <Input
                            type='text'
                            className='account-form_input no-focus'
                            { ... field }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                {/* Bio change field */}
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                        <FormControl>
                            <Textarea
                            rows={10}
                            className='account-form_input no-focus'
                            { ... field }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="bg-primary-500 hover:bg-violet-400 duration-300">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;