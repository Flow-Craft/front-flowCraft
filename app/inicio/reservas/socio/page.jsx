'use client';

import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  eliminarReservaAdmin,
  getInstalacionesActivasAdmin,
  getInstalacionesAdmin,
  getReservasVigentes,
  getReservasVigentesByUsuario,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { Tooltip } from '@chakra-ui/react';
import {
  PaintBrushIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const HEADER_TABLE = [
  { name: 'Fecha' },
  { name: 'Hora' },
  { name: 'Instalacion' },
  { name: 'Ubicacion' },
  { name: 'Acciones' },
];

function Page() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [reservasVigentes, setReservasVigentes] = useState([]);
  const [reservasAMostrar, setReservasAMostrar] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState({});
  const [modalEliminarReservas, setModalEliminarReservas] = useState(false);
  const nombreRef = useRef(null);
  const fechaRef = useRef(null);
  const instalacionRef = useRef(null);
  const router = useRouter();
  const limpiarFiltros = () => {
    if (nombreRef.current) nombreRef.current.value = '';
    if (fechaRef.current) fechaRef.current.value = '';
    if (instalacionRef.current) instalacionRef.current.clearValue();
  };

  const getFiltros = async () => {
    const inst = await getInstalacionesAdmin();
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
  };

  const ActionTab = (equipo) => {
    const fechaActual = new Date(equipo.horaInicio.split('T')[0]);
    const fechaDeHoy = new Date();
    return (
      <div className="flex flex-row gap-4">
        {!equipo.fechaBaja && fechaActual > fechaDeHoy ? (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                router.push(`/inicio/reservas/socio/editar/${equipo.id}`);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {!equipo.fechaBaja && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                setReservaSeleccionada(equipo);
                setModalEliminarReservas(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const getReservas = async () => {
    try {
      const result = await getReservasVigentesByUsuario();
      console.log('result', result);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0); // Establece la hora de fechaActual a las 00:00

      const reservasActuales = result.filter((reserva) => {
        const fechaReserva = new Date(reserva.horaInicio);
        fechaReserva.setHours(0, 0, 0, 0); // Establece la hora de fechaReserva a las 00:00

        return fechaReserva >= fechaActual;
      });
      setReservasVigentes(reservasActuales);
      const reservasAMostrar = reservasActuales.map((inst) => ({
        id: inst.id,
        fecha: inst.horaInicio.split('T')[0],
        hora: `${inst.horaInicio.split('T')[1]} - ${inst.horaFin.split('T')[1]}`,
        instalacion: inst.instalacion.nombre,
        ubi: inst.instalacion.ubicacion,
        acciones: ActionTab(reservasActuales.find((ins) => ins.id === inst.id)),
      }));
      setReservasAMostrar(reservasAMostrar);
    } catch (error) {
      console.log(error);
    }
  };

  const aplicarFitros = (e) => {
    e.preventDefault();
    const filters = {
      nombre: e.target.nombre.value,
      fecha: e.target.fecha.value,
      instalacion: e.target.instalacion.value,
    };
    const instalacionesFiltradas = reservasVigentes.filter((reserva) => {
      const { nombre, fecha, instalacion, instalaciones } = filters;

      // Verificar nombre (parcial)
      const coincideNombre =
        !nombre ||
        reserva.usuario.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
        reserva.usuario.apellido.toLowerCase().includes(nombre.toLowerCase()) ||
        reserva.usuario.dni?.toString().includes(nombre) ||
        `${reserva.usuario.nombre.toLowerCase()} ${reserva.usuario.apellido.toLowerCase()} ${reserva.usuario.dni.toString()}`.includes(
          nombre.toLowerCase(),
        );
      // Verificar fecha de inicio
      const coincideFecha = !fecha || reserva.fechaReserva.startsWith(fecha);

      // Verificar instalación
      const coincideInstalacion =
        !instalacion || reserva.instalacion.id === Number(instalacion);

      // Verificar instalaciones
      const coincideInstalaciones =
        !instalaciones ||
        instalaciones.length === 0 ||
        instalaciones.some((inst) => inst.value === reserva.instalacion.id);

      return (
        coincideNombre &&
        coincideFecha &&
        coincideInstalacion &&
        coincideInstalaciones
      );
    });
    const reservasAMostrar = instalacionesFiltradas.map((inst) => ({
      id: inst.id,
      nombre: `${inst.usuario.apellido} ${inst.usuario.nombre}`,
      tef: inst.usuario.telefono,
      fecha: inst.fechaReserva.split('T')[0],
      hora: `${inst.horaInicio.split('T')[1]} - ${inst.horaFin.split('T')[1]}`,
      instalacion: inst.instalacion.nombre,
      ubi: inst.instalacion.ubicacion,
      acciones: ActionTab(reservasVigentes.find((ins) => ins.id === inst.id)),
    }));
    setReservasAMostrar(reservasAMostrar);
  };

  const eliminarReserva = async () => {
    try {
      await eliminarReservaAdmin(reservaSeleccionada.id);
      setModalEliminarReservas(false);
      setReservaSeleccionada({});
      getFiltros();
      getReservas();
      toast.success('reserva eliminada con exito');
    } catch (error) {
      toast.error(error.title);
    }
  };

  useEffect(() => {
    getFiltros();
    getReservas();
  }, []);

  return (
    <section>
      <section className="flex w-full justify-between">
        <Toaster />
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Mis Reservas
        </div>
        <button
          className="max-h-16 rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          onClick={() => {
            router.push('/inicio/reservas/socio/crear');
          }}
        >
          Crear reserva
        </button>
      </section>
      <section>
        <form
          className="flex w-full flex-wrap items-center"
          onSubmit={aplicarFitros}
          id="filterEvents"
        >
          <div className="flex flex-row flex-wrap gap-5">
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Nombre:
              </label>
              <InputWithLabel name={'nombre'} type="text" ref={nombreRef} />
            </section>
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Fecha:
              </label>
              <InputWithLabel
                name={'fecha'}
                type="date"
                ref={fechaRef}
                min={new Date()}
              />
            </section>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Instalacion:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel
                  name="instalacion"
                  options={instalaciones}
                  ref={instalacionRef}
                />
              </div>
            </div>
            <Tooltip label="Limpiar Filtros">
              <PaintBrushIcon
                className="w-[50px] rounded-lg bg-blue-300 p-2 text-center text-xl text-white"
                type="button"
                onClick={(e) => {
                  limpiarFiltros();
                  const reservas = reservasVigentes.map((inst) => ({
                    id: inst.id,
                    nombre: `${inst.usuario.apellido} ${inst.usuario.nombre}`,
                    tef: inst.usuario.telefono,
                    fecha: inst.fechaReserva.split('T')[0],
                    hora: `${inst.horaInicio.split('T')[1]} - ${inst.horaFin.split('T')[1]}`,
                    instalacion: inst.instalacion.nombre,
                    ubi: inst.instalacion.ubicacion,
                    acciones: ActionTab(
                      reservasVigentes.find((ins) => ins.id === inst.id),
                    ),
                  }));
                  setReservasAMostrar(reservas);
                }}
              />
            </Tooltip>
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="submit"
            >
              Buscar
            </button>
          </div>
        </form>
        <section className="mt-5">
          <FlowTable Header={HEADER_TABLE} dataToShow={reservasAMostrar} />
        </section>
      </section>
      <FlowModal
        title={`Seguro que desea eliminar la reserva para: ${reservaSeleccionada?.fechaReserva?.split('T')[0]} de ${reservaSeleccionada?.horaInicio?.split('T')[1]}  a  ${reservaSeleccionada?.horaFin?.split('T')[1]} `}
        modalBody={<></>}
        primaryTextButton={'Si'}
        isOpen={modalEliminarReservas}
        scrollBehavior="outside"
        onAcceptModal={eliminarReserva}
        onCancelModal={() => {
          setModalEliminarReservas(false);
          setReservaSeleccionada({});
        }}
      />
    </section>
  );
}

export default withAuthorization(Page, 'Reservas');
