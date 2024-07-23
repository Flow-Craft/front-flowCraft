'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import FlowCraftAPI from './request'
const CreateInvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status:z.enum(['pending','paid']),
    date:z.string()
})

const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({
    id:true,
    date:true
})
export async function CreateInvoice(formData: FormData){
    const {customerId, amount, status} = CreateInvoiceFormSchema.parse({
        customerId: formData.get("customerId"),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
    const amountInCents = amount * 100
    const [date] = new Date().toISOString().split('T')

    await sql`INSERT INTO invoices (customer_id,amount,status,date)
    VALUES (${customerId},${amountInCents},${status},${date})
    `
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function loginUser(formData: FormData){
    const {email, password} = loginUserSchema.parse({
        email: formData.get("email"),
        password: formData.get('password'),
    })
    const test = await FlowCraftAPI.post("Users/Login",{Email: email, Password:password})
    console.log(test)
}