import { z } from 'zod';

export const tipoAcrearSchema = z.object({
  NombreTipoEvento: z
    .string()
    .min(1, { message: 'El nombre no puede estar vacío' }),
  Descripcion: z
    .string()
    .min(1, { message: 'La descripción no puede estar vacía' }),
});

export const tipoAccionPartidoSchema = z.object({
  NombreTipoAccion: z
    .string()
    .min(1, { message: 'El nombre no puede estar vacío' }),
  Descripcion: z
    .string()
    .min(1, { message: 'La descripción no puede estar vacía' }),
  ModificaTarjetasAdvertencia: z.boolean(),
  ModificaTarjetasExpulsion: z.boolean(),
  secuencial: z.boolean(),
  IdDisciplina: z
    .string()
    .min(1, { message: 'El ID de disciplina no puede estar vacío' }),
});
