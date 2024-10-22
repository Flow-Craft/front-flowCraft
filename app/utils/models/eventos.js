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
    IdDisciplina: z
      .number()
      .min(1, 'Debe haber al menos una disciplina.'),
    Banner: z.instanceof(File, { message: 'La imagen no fue enviada' }).refine(
      (value) => {
        const extension = value.type.split('/').pop()?.toLowerCase();
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

export const categoriaSchema = z
  .object({
    Nombre: z.string().min(1, 'El nombre no puede estar vacío'),
    Descripcion: z.string().min(1, 'La descripción no puede estar vacía'),
    EdadMinima: z.number().min(1, 'La edad mínima debe ser mayor o igual a 1'),
    EdadMaxima: z.number().min(1, 'La edad máxima debe ser mayor o igual a 1'),
    Genero: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.EdadMaxima >= data.EdadMinima;
    },
    {
      message: 'La edades son incompatibles',
      path: ['EdadMaxima'],
    },
  );
