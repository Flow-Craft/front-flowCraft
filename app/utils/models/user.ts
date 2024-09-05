import { z } from 'zod';

export const loginUserSchema = z.object({
  Email: z.string().email(),
  Contrasena: z.string(),
});

export const RegistryUserSchemaZod = z
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
      .max(8, 'El dni es muy largo')
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
    Sexo: z.string().min(1, { message: "El campo 'Sexo' no fue enviado" }),
    FotoPerfilNo64: z
      .instanceof(File, { message: 'La imagen no fue enviada' })
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
    FotoPerfil: z.any(),
  })
  .refine((data) => data.Contrasena === data.OtraContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['OtraContrasena'],
  });

export const verifyEmail = z.object({
  Email: z
    .string()
    .min(1, { message: "El campo 'Email' no fue enviado" })
    .refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'El email es invalido',
    }),
});

export const verifyEmailCode = z.object({
  Code: z
    .string({ message: 'Debe ingresar un número' })
    .length(6, { message: 'El código debe tener exactamente 6 dígitos' }) // Valida que tenga exactamente 7 dígitos
    .regex(/^\d+$/, { message: 'El código debe contener solo números' }), // Asegura que solo tenga números
});

export const verifyPasswords = z
  .object({
    Contrasena: z
      .string()
      .min(8, { message: "El campo 'Contrasena' no fue enviado" }),
    OtraContrasena: z
      .string()
      .min(8, { message: "El campo 'OtraContrasena' no fue enviado" }),
  })
  .refine((data) => data.Contrasena === data.OtraContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['OtraContrasena'],
  });
