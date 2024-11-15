'use client';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  crearReservaAdmin,
  editarReservaAdmin,
  getInstalacionesAdmin,
  getReservasVigentes,
  getReservasVigentesById,
  getUsersAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Page() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [instalacionesCompletas, setInstalacionesCompletas] = useState([]);
  const [usuariosToShow, setUsuariosToShow] = useState([]);
  const [reservasActuales, setReservasActuales] = useState([]);
  const [proximasReservasDeLaInstalacion, setProximasReservasDeLaInstalacion] =
    useState([]);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({});
  const [instalacionOpcionSeleccionada, setInstalacionOpcionSeleccionada] =
    useState({});
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [errors, setErrors] = useState([]);
  const params = useParams();
  const { id } = params;
  const handleReservas = (e) => {
    const result = instalacionesCompletas.find(
      (intC) => intC.instalacion.id === e.value,
    );
    setInstalacionOpcionSeleccionada(e);
    setInstalacionSeleccionada(e);
    const reservasDeLaInstalacion = reservasActuales
      .filter((res) => res.instalacion.id === result?.instalacion?.id)
      .sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
    setProximasReservasDeLaInstalacion(reservasDeLaInstalacion);
    setFechaReserva('');
    setHoraInicio('');
    setHoraFin('');
    setErrors([]);
  };

  const getFiltros = async () => {
    const inst = await getInstalacionesAdmin();
    setInstalacionesCompletas(inst);
    const instalacionesOptions =
      inst &&
      inst
        .map((ins) => {
          if (ins.activo) {
            return { label: ins.instalacion.nombre, value: ins.instalacion.id };
          }
        })
        .filter(Boolean);
    setInstalaciones(instalacionesOptions);
    const result = await getReservasVigentes();
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establece la hora de fechaActual a las 00:00

    const reservasActuales = result.filter((reserva) => {
      const fechaReserva = new Date(reserva.horaInicio);
      fechaReserva.setHours(0, 0, 0, 0); // Establece la hora de fechaReserva a las 00:00

      return fechaReserva >= fechaActual;
    });
    setReservasActuales(reservasActuales);
    const reserva = await getReservasVigentesById(id);
    const instalacionSeleccionada = instalacionesOptions.find(
      (ins) => ins.value === reserva.instalacion.id,
    );
    setInstalacionSeleccionada(reserva.instalacion);
    setInstalacionOpcionSeleccionada(instalacionSeleccionada);
    const fechaReserva = reserva.horaInicio.split('T')[0];
    setFechaReserva(fechaReserva);
    const horaInicio = reserva.horaInicio.split('T')[1];
    setHoraInicio(horaInicio);
    const horaFin = reserva.horaFin.split('T')[1];
    setHoraFin(horaFin);
    const reservasDeLaInstalacion = reservasActuales
      .filter((res) => res.instalacion.id === reserva?.instalacion?.id)
      .sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
    setProximasReservasDeLaInstalacion(reservasDeLaInstalacion);
  };

  const handleCrearEvento = async (e) => {
    try {
      setErrors([]);
      e.preventDefault();

      let errors = [];

      // Validaciones de campos obligatorios
      if (!fechaReserva) {
        errors.push({
          title: 'fecha',
          message: 'El campo de fecha es obligatorio',
        });
      }
      if (fechaReserva) {
        const fechaFinima = new Date(currentTime);
        if (fechaFinima > new Date(fechaReserva)) {
          errors.push({
            title: 'fecha',
            message: 'La fecha es anterior a la fecha actual',
          });
        }
      }
      if (!horaInicio) {
        errors.push({
          title: 'horaInicio',
          message: 'La hora de inicio es obligatoria',
        });
      }
      if (!horaFin) {
        errors.push({
          title: 'horaFin',
          message: 'La hora de finalización es obligatoria',
        });
      }

      // Detener si faltan campos obligatorios
      if (errors.length > 0) {
        setErrors(errors);
        return;
      }
      // Conversión de horas de inicio y fin ingresadas
      const [startHour, startMinutes] = horaInicio.split(':').map(Number);
      const [endHour, endMinutes] = horaFin.split(':').map(Number);

      const startTime = new Date();
      startTime.setHours(startHour, startMinutes, 0);

      const endTime = new Date();
      endTime.setHours(endHour, endMinutes, 0);

      // Conversión de horas de la instalación seleccionada
      const [instalacionStartHour, instalacionStartMinutes] =
        instalacionSeleccionada.horaInicio.split(':').map(Number);
      const [instalacionEndHour, instalacionEndMinutes] =
        instalacionSeleccionada.horaCierre.split(':').map(Number);

      const instalacionStartTime = new Date();
      instalacionStartTime.setHours(
        instalacionStartHour,
        instalacionStartMinutes,
        0,
      );

      const instalacionEndTime = new Date();
      instalacionEndTime.setHours(instalacionEndHour, instalacionEndMinutes, 0);

      // Validación de que la hora de inicio sea anterior a la hora de finalización
      if (startTime >= endTime) {
        errors.push({
          title: 'horaInicio',
          message:
            'La hora de inicio debe ser anterior a la hora de finalización',
        });
        errors.push({
          title: 'horaFin',
          message:
            'La hora de finalización debe ser posterior a la hora de inicio',
        });
      }

      // Validación de que la hora de inicio y fin estén dentro del rango de la instalación
      if (startTime < instalacionStartTime || startTime >= instalacionEndTime) {
        errors.push({
          title: 'horaInicio',
          message: `La hora de inicio debe estar entre ${instalacionSeleccionada.horaInicio} y ${instalacionSeleccionada.horaCierre}`,
        });
      }
      if (endTime <= instalacionStartTime || endTime > instalacionEndTime) {
        errors.push({
          title: 'horaFin',
          message: `La hora de finalización debe estar entre ${instalacionSeleccionada.horaInicio} y ${instalacionSeleccionada.horaCierre}`,
        });
      }

      // Mostrar los errores si existen
      if (errors.length > 0) {
        setErrors(errors);
        return;
      }
      const horaInicioArray = horaInicio.split(':');
      const horaFinArray = horaFin.split(':');
      const formattedHoraInicio =
        horaInicioArray.length === 3
          ? `${fechaReserva}T${horaInicio}`
          : `${fechaReserva}T${horaInicio}:00`;
      const formattedHoraFin =
        horaFinArray.length === 3
          ? `${fechaReserva}T${horaFin}`
          : `${fechaReserva}T${horaFin}:00`;

      await editarReservaAdmin({
        Id: id,
        horaInicio: formattedHoraInicio,
        horaFin: formattedHoraFin,
        instalacionId: instalacionSeleccionada.id,
      });
      toast.success('reserva editada exitosamente');
      router.back();
    } catch (error) {
      const errorMessage =
        error?.title || error?.message || 'Ocurrió un error inesperado';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getFiltros();
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    setCurrentTime(`${year}-${month}-${day}`);
  }, [id]);

  return (
    <section>
      <section className="flex w-full justify-between">
        <Toaster />
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Editar Mi Reserva
        </div>
      </section>
      <section>
        <div className="flex min-w-[370px] flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Instalación:
          </label>
          <div className="min-w-[370px]">
            <SelectWithLabel
              name="instalacion"
              options={instalaciones}
              value={instalacionOpcionSeleccionada}
              onChange={(e) => {
                handleReservas(e);
              }}
            />
          </div>
        </div>
      </section>
      <section className="mb-3 flex min-h-[70vh] w-full gap-4">
        {instalacionOpcionSeleccionada?.value && (
          <>
            <div className="w-1/2 p-4">
              <InputWithLabel
                label="Día"
                name={'fecha'}
                type="date"
                value={fechaReserva}
                onChange={(e) => {
                  setFechaReserva(e.target.value);
                }}
                min={currentTime}
                required
                wrong={!!errors.find((e) => e.title === 'fecha')}
              />
              <InputWithLabel
                label="Hora Inicio"
                name={'horaInicio'}
                type="time"
                value={horaInicio}
                onChange={(e) => {
                  setHoraInicio(e.target.value);
                }}
                required
                wrong={!!errors.find((e) => e.title === 'horaInicio')}
              />
              <InputWithLabel
                label="Hora Fin"
                name={'horaFin'}
                value={horaFin}
                onChange={(e) => {
                  setHoraFin(e.target.value);
                }}
                type="time"
                required
                wrong={!!errors.find((e) => e.title === 'horaFin')}
              />
              <div className="mt-5 flex w-full flex-col gap-4">
                <span className="text-xl">
                  <span className="font-bold">Ubicación: </span>
                  {instalacionSeleccionada?.ubicacion}
                </span>
                <span className="text-xl">
                  <span className="font-bold">Hora apertura: </span>
                  {instalacionSeleccionada?.horaInicio}
                </span>
                <span className="text-xl">
                  <span className="font-bold">Hora cierre: </span>
                  {instalacionSeleccionada?.horaCierre}
                </span>
                <span className="text-xl">
                  <span className="font-bold">Precio: </span>
                  {instalacionSeleccionada?.precio}
                </span>
                <span className="text-xl">
                  <span className="font-bold">Condiciones: </span>
                  <span className="break-words">
                    {instalacionSeleccionada?.condiciones}
                  </span>
                </span>
              </div>
              <div className="flex w-full flex-row content-between justify-between">
                <div aria-live="polite" aria-atomic="true" className="mr-4">
                  {errors &&
                    errors.map((error) => (
                      <p
                        className="mt-2 text-sm font-bold text-red-500"
                        key={error.message}
                      >
                        {error.message}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            <div className="w-1/2 p-4">
              <div className="mt-6 self-start px-9 pb-9 text-xl font-bold">
               Próximos eventos
              </div>
              {proximasReservasDeLaInstalacion.map((reserva) => {
                const formatDate = (dateString) => {
                  const date = new Date(dateString);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                };

                const formatTime = (timeString) => {
                  const date = new Date(timeString);
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  return `${hours}:${minutes}`;
                };

                return (
                  <div
                    className="max-w-sm overflow-hidden rounded p-2"
                    key={reserva.id}
                  >
                    <h2 className="mb-4 text-2xl font-bold">
                      Reserva #{reserva.id}
                    </h2>
                    <div className="mb-2 text-lg">
                      <span className="font-semibold">Fecha: </span>
                      {formatDate(reserva.horaFin)}
                    </div>
                    <div className="mb-4 text-lg">
                      <span className="font-semibold">Hora de fin: </span>
                      {formatTime(reserva.horaFin)}
                    </div>
                    <div className="mb-2 text-lg">
                      <span className="font-semibold">Hora de inicio: </span>
                      {formatTime(reserva.horaInicio)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
      <section className="flex w-full items-end gap-6">
        <button
          className="max-h-16 rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          onClick={(e) => {
            handleCrearEvento(e);
          }}
        >
          Editar
        </button>
        <button
          className="max-h-16 rounded-lg bg-gray-600 p-2 text-center text-xl text-white"
          onClick={() => {
            router.back();
          }}
        >
          Volver
        </button>
      </section>
    </section>
  );
}
export default withAuthorization(Page, 'Reservas');
