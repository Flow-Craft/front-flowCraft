import { z } from 'zod';

export const eventoSchema = z
  .object({
    Titulo: z.string().min(1, 'El título es obligatorio.'),
    FechaInicio: z.string().min(1, 'La fecha inicio es obligatoria.'),
    FechaFinEvento: z.string().min(1, 'La fecha fin es obligatoria.'),
    CupoMaximo: z.string().min(1, 'El cupo máximo es obligatorio.'),
    LinkStream: z.string().url('El link debe ser una URL válida.'),
    Descripcion: z.string().min(1, 'La descripción es obligatoria.'),
    IdTipoEvento: z.string().min(1, 'El tipo de evento es obligatorio.'),
    IdInstalacion: z.string().min(1, 'La instalación es obligatoria.'),
    IdCategoria: z.string().min(1, 'La categoría es obligatoria.'),
    IdsDisciplinas: z
      .array(z.number())
      .min(1, 'Debe haber al menos una disciplina.'),
    Banner: z.instanceof(File, { message: 'La imagen no fue enviada' }).refine(
      (value) => {
        console.log('value', value);
        const extension = value.type.split('/').pop()?.toLowerCase();
        console.log('extension', extension);
        return (
          extension === 'jpg' || extension === 'png' || extension === 'jpeg'
        );
      },
      {
        message: 'La foto debe ser en formato JPG o PNG.',
      },
    ),
  })
  .refine(
    (data) => new Date(data.FechaFinEvento) > new Date(data.FechaInicio),
    {
      message: 'La fecha de fin debe ser mayor que la fecha de inicio.',
      path: ['FechaFinEvento'], // Indica el campo que está causando el error
    },
  );

