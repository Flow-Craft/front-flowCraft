'use client'

import { z } from 'zod'
import FlowCraftAPI from './request'
import toast from 'react-hot-toast';
import { setItemInLocalStorage } from './localStorageActions';
import {LOCAL_STORAGE_NAME_KEY} from './const';

const CreateInvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status:z.enum(['pending','paid']),
    date:z.string()
})

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
        if(response?.nombre)setItemInLocalStorage(LOCAL_STORAGE_NAME_KEY,response?.nombre)
        window.location.href = '/inicio/noticias';
    }catch(error:any){
        toast.error(error.message);
    }
}