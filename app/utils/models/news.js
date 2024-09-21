import { z } from 'zod';

export const editCreateNewSchema = z
  .object({
    titulo: z.string().min(1, 'El título no puede estar vacío'),
    descripcion: z.string().min(1, 'La descripción no puede estar vacía'),
    fechaInicio: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'Debe enviar una fecha de inicio',
      }),
    fechaFin: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'Debe enviar una fecha de fin',
      }),
    foto: z
      .instanceof(File)
      .refine((file) => file.size <= 3 * 1024 * 1024, {
        message: 'La imagen no puede pesar más de 3 MB',
      })
      .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
        message: 'La imagen debe ser un archivo JPG o PNG',
      }),
  })
  .refine(
    (data) => {
      const { fechaFin, fechaInicio } = data;

      if (fechaFin && fechaInicio && fechaFin < fechaInicio) {
        return false; // indica que la validación ha fallado
      }
      return true; // la validación pasa
    },
    {
      message: 'Las fechas son incompatibles',
      path: ['fechaFin'], // especifica el path aquí
    },
  );
