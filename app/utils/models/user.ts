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
      .min(8, { message: "El campo 'Contraseña' no fue enviado" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
        message:
          'La contraseña no cumple con los parámetros mínimos de seguridad. Debe contener un número, una letra mayúscula, una letra minúscula,  un símbolo y minimo 8 caracteres.',
      }),
    OtraContrasena: z
      .string()
      .min(8, { message: "El campo 'Confirmar Contraseña' no fue enviado" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
        message:
          'La contraseña no cumple con los parámetros mínimos de seguridad. Debe contener un número, una letra mayúscula, una letra minúscula, un símbolo y minimo 8 caracteres.',
      }),
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
        message: 'El email es inválido',
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

export const RegistryUserByAdminSchemaZod = z.object({
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
      message: 'El email es inválido',
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
  Perfil: z.string({ message: "El campo 'Perfil' no fue enviado" }),
  FotoPerfil: z.any(),
});
export const EditUserByAdminSchemaZod = z.object({
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
      message: 'El email es inválido',
    }),
  FechaNacimiento: z
    .string()
    .min(1, { message: "El campo 'FechaNacimiento' no fue enviado" })
    .refine((val) => val === '' || !isNaN(Date.parse(val)), {
      message: 'La fecha de nacimiento no es válida',
    }),
  Sexo: z.string().min(1, { message: "El campo 'Sexo' no fue enviado" }),
  Perfil: z.string({ message: "El campo 'Perfil' no fue enviado" }),
  FotoPerfil: z.any(),
});

export const verifyEmail = z.object({
  Email: z
    .string()
    .min(1, { message: "El campo 'Email' no fue enviado" })
    .refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'El email es inválido',
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
      .min(8, { message: "El campo 'Contraseña' no tiene la longitud minima de 8 caracteres" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
        message:
          'La contraseña no cumple con los parámetros mínimos de seguridad. Debe contener un número, una letra mayúscula, una letra minúscula, y un símbolo.',
      }),
    OtraContrasena: z
      .string()
      .min(8, { message: "El campo 'Repetir Contraseña' no tiene la longitud minima de 8 caracteres" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
        message:
          'La contraseña no cumple con los parámetros mínimos de seguridad. Debe contener un número, una letra mayúscula, una letra minúscula, y un símbolo.',
      }),
  })
  .refine((data) => data.Contrasena === data.OtraContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['OtraContrasena'],
  });

export const UpdateUserSchemaZod = z.object({
  id: z.number(),
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
      message: 'El email es inválido',
    }),
  FechaNacimiento: z
    .string()
    .min(1, { message: "El campo 'FechaNacimiento' no fue enviado" })
    .refine((val) => val === '' || !isNaN(Date.parse(val)), {
      message: 'La fecha de nacimiento no es válida',
    }),
  Sexo: z.string().min(1, { message: "El campo 'Sexo' no fue enviado" }),
  FotoPerfil: z
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
    })
    .optional(),
});

const perfilSchema = z.object({
  NombrePerfil: z.string().min(1, 'El nombre del perfil no puede estar vacío'),
  DescripcionPerfil: z
    .string()
    .min(1, 'La descripción del perfil no puede estar vacía'),
});

const permisosSchema = z
  .array(z.number().min(1, 'El ID de permiso debe ser mayor a 0'))
  .nonempty('El array de permisos no puede estar vacío');

export const CreatePerfilSchema = z.object({
  Perfil: perfilSchema,
  Permisos: permisosSchema,
});
