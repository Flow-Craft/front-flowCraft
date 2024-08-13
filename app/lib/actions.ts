'use client';

import { z } from 'zod';
import FlowCraftAPI from './request';
import toast from 'react-hot-toast';
import { AUTORIZATION_KEY, LOCAL_STORAGE_NAME_KEY } from './const';

const loginUserSchema = z.object({
  Email: z.string().email(),
  Contrasena: z.string(),
});

export async function loginUser(formData: FormData) {
  try {
    const { Email, Contrasena } = loginUserSchema.parse({
      Email: formData.get('email'),
      Contrasena: formData.get('password'),
    });
    const response: any = await FlowCraftAPI.post('Users/Login', {
      Email,
      Contrasena,
    });
    if (response?.nombre)
      window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, response?.nombre);
    window.location.href = '/inicio/noticias';
  } catch (error: any) {
    toast.error(error.message);
  }
}

export async function checkJWT() {
  console.log('entreAca');
  try {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    if (!token) {
      window.location.href = '/';
    }
    await FlowCraftAPI.get('Users/ComprobarJWT', {
      Authorization: `Bearer ${token}`,
    });
    return;
  } catch (error: any) {
    if (error.status === 401) {
      window.localStorage.clear();
      window.location.href = '/';
    }
  }
}

export async function checkJWTSession() {
  try {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    if (token) {
      await FlowCraftAPI.get('Users/ComprobarJWT', {
        Authorization: `Bearer ${token}`,
      });
      window.location.href = '/inicio/noticias';
    }

    return;
  } catch (error: any) {
    if (error.status === 401) {
      window.localStorage.clear();
    }
  }
}

const RegistrySchema = z
  .object({
    Nombre: z
      .string()
      .min(4, { message: "El campo 'Nombre' no fue enviado" })
      .refine((val) => val === '' || /^[a-zA-Z\s]+$/.test(val), {
        message: 'El nombre no debe contener números ni símbolos',
      }),
    Apellido: z
      .string()
      .min(4, { message: "El campo 'Apellido' no fue enviado" })
      .refine((val) => val === '' || /^[a-zA-Z\s]+$/.test(val), {
        message: 'El apellido no debe contener números ni símbolos',
      }),
    Contrasena: z
      .string()
      .min(8, { message: "El campo 'Contrasena' no fue enviado" }),
    OtraContrasena: z
      .string()
      .min(8, { message: "El campo 'OtraContrasena' no fue enviado" }),
    Direccion: z
      .string()
      .min(8, { message: 'La dirección debe tener al menos 8 caracteres' }),
    Telefono: z
      .string()
      .min(8, { message: "El campo 'Telefono' no fue enviado" })
      .refine((val) => val === '' || /^\d+$/.test(val), {
        message: 'El número de teléfono debe contener solo dígitos',
      }),
    Dni: z
      .string()
      .min(1, { message: "El campo 'Dni' no fue enviado" })
      .refine((val) => val === '' || /^\d+$/.test(val), {
        message: 'El DNI debe contener solo dígitos',
      }),
    Email: z
      .string()
      .min(1, { message: "El campo 'Email' no fue enviado" })
      .refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'El email es invalido',
      }),
    FechaNacimiento: z
      .string()
      .min(1, { message: "El campo 'FechaNacimiento' no fue enviado" })
      .refine((val) => val === '' || !isNaN(Date.parse(val)), {
        message: 'La fecha de nacimiento no es válida',
      }),
    FotoPerfil: z
      .instanceof(File)
      .refine(
        (file) =>
          file.size === 0 || ['image/jpeg', 'image/png'].includes(file.type),
        {
          message: 'La imagen debe estar en formato JPG o PNG',
        },
      )
      .refine((file) => file.size === 0 || file.size <= 3 * 1024 * 1024, {
        message: 'La imagen no debe ser mayor a 3MB',
      }),
    Socio: z.boolean().optional().default(false),
  })
  .refine((data) => data.Contrasena === data.OtraContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['OtraContrasena'],
  });

export async function registryUser(RegistryUserSchema: any) {
  try {
    const result = RegistrySchema.safeParse(RegistryUserSchema);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
  } catch (error: any) {}
}
