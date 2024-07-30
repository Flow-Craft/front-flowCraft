'use client'

import { z } from 'zod'
import FlowCraftAPI from './request'
import toast from 'react-hot-toast';
import {LOCAL_STORAGE_NAME_KEY} from './const';


const loginUserSchema = z.object({
    Email: z.string().email(),
    Contrasena: z.string(),
})

export async function loginUser(formData: FormData){
    try{
        const {Email, Contrasena} = loginUserSchema.parse({
            Email: formData.get("email"),
            Contrasena: formData.get('password'),
        })
        const response:any = await FlowCraftAPI.post("Users/Login",{Email, Contrasena})
        if(response?.nombre)window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY,response?.nombre)
        window.location.href = '/inicio/noticias';
    }catch(error:any){
        toast.error(error.message);
    }
}