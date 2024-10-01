import { z } from 'zod';

export const crearInstalacionSchema = z
  .object({
    Nombre: z.string().min(1, 'El nombre es obligatorio'),
    Ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
    Precio: z.string().min(1, 'El precio es obligatorio'),
    Condiciones: z.string().min(1, 'Las condiciones son obligatorias'),
    HoraInicio: z.string().min(1, 'La hora de inicio es obligatoria'),
    HoraCierre: z.string().min(1, 'La hora de fin es obligatoria'),
    EstadoId: z.number().min(1, 'EstadoId no puede ser 0'),
  })
  .refine(
    (data) => {
      const [horaInicioHora, horaInicioMinuto] =
        data.HoraInicio.split(':').map(Number);
      const [horaFinHora, horaFinMinuto] =
        data.HoraCierre === '00:00'
          ? [24, 0] // Tratar "00:00" como "24:00"
          : data.HoraCierre.split(':').map(Number);

      const inicioEnMinutos = horaInicioHora * 60 + horaInicioMinuto;
      const finEnMinutos = horaFinHora * 60 + horaFinMinuto;

      return finEnMinutos >= inicioEnMinutos;
    },
    {
      message: 'La hora de fin debe ser mayor o igual a la hora de inicio',
      path: ['HoraCierre'],
    },
  );
