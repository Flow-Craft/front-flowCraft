import { z } from 'zod';

export const equipoEstadoSchema = z.object({
  NombreEstado: z.string().min(1, 'El nombre no puede estar vacío'),
});
