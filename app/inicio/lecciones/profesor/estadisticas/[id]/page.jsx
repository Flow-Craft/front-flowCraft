'use client';
import {
  altaEstaditicaPartidoAccionUsuario,
  bajaEstaditicaPartidoAccionUsuario,
  finalizarLeccionAdmin,
  getAccionesPorUsuarioYPartido,
  getActionPartidoPanelAdmin,
  getInscripcionesALecciones,
  getLeccionById,
  getPartidoByIdAdmin,
} from '@/app/utils/actions';
import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';

const page = () => {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [alumnosPresentes, setAlumnosPresentes] = useState([]);
  const [partido, setPartido] = useState({});
  const [listaDeAcciones, setListaDeAcciones] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [accionesPorJugador, setAccionesPorJugador] = useState([]);
  const [modalFinalizarLeccion, setModalFinalizarLeccion] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const router = useRouter();
  const getDataDelPatido = async (partidoId) => {
    const partido = await getLeccionById(partidoId);
    const alumnos = await getInscripcionesALecciones(partidoId);
    const result = await getActionPartidoPanelAdmin({
      IdDisciplina: partido?.disciplina?.id,
      Estadistica: true,
      Partido: false,
    });

    setListaDeAcciones(result);
    setJugadores(alumnos);
    setPartido(partido);
  };

  const getAccionesParaEseUsuario = async (nroJugador) => {
    const acciones = await getAccionesPorUsuarioYPartido({
      IdPartido: partido.id,
      NroJugador: nroJugador,
    });
    setAccionesPorJugador(acciones);
  };

  const altaAccionEstadistica = async (accionId) => {
    await altaEstaditicaPartidoAccionUsuario({
      IdTipoAccion: accionId,
      MarcaEstadistica: '+',
      Secuencial: true,
      IdAsistenciaLeccion: null,
    });
    toast.success('accion cargada con exito');
    getAccionesParaEseUsuario(jugadorSeleccionado?.id);
  };

  const bajaAccionEstadistica = async (accionId) => {
    await bajaEstaditicaPartidoAccionUsuario({
      IdTipoAccion: accionId,
      MarcaEstadistica: '-',
      Secuencial: true,
      IdAsistencia: null,
      NroJugador: jugadorSeleccionado.id,
      IdEquipo: jugadorSeleccionado.idEquipo,
      IdPartido: partido.id,
      Resta: true,
    });
    getAccionesParaEseUsuario(jugadorSeleccionado?.id);
  };

  const verTotalPorAccion = (accion) => {
    if (accionesPorJugador) {
      const accionFiltrada = accionesPorJugador.find(
        (acc) => acc.tipoAccionPartido.id === accion.id,
      );
      return accionFiltrada?.puntajeTipoAccion || 0;
    }
    return 0;
  };

  const finalizarLeccion = async () => {
    try {
      if (!esEdicion) {
        await finalizarLeccionAdmin(partido.id);
      }
      toast.success(
        `${esEdicion ? 'Leccion editada con exito' : 'Leccion finalizada con exito'}`,
      );
      router.back();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    const params = new URLSearchParams(window.location.search);

    // Obtener el valor de un parámetro específico
    const paramValue = params.get('esEdicion');
    setEsEdicion(!!paramValue);
    getDataDelPatido(idFromPath);
  }, []);

  return (
    <section className="w-full">
      <Toaster />
      <section className="flex flex-1 flex-row justify-between">
        <span className="text-3xl font-bold">Estadisticas de la leccion</span>
        <div className="flex flex-row gap-10 text-2xl font-semibold">
          <span>Disciplinas: {partido?.disciplina?.nombre}</span>
          <span>Categoria: {partido?.categoria?.nombre}</span>
        </div>
      </section>
      <section className="mt-8 flex w-full">
        <div className="overflow h-[80vh] w-full max-w-[30%] flex-col gap-5 overflow-y-auto">
          {jugadores &&
            jugadores.map((jugador) => {
              return (
                <>
                  <button
                    className={`mt-5 w-[80%] rounded-lg bg-blue-300 ${jugador.usuario.dni === jugadorSeleccionado?.usuario?.dni && 'bg-blue-600'} p-2 text-lg font-semibold text-white`}
                    key={jugador.usuario.id}
                    onClick={() => {
                      setAccionesPorJugador([]);
                      setJugadorSeleccionado(jugador);
                      getAccionesParaEseUsuario(jugador.usuario.id);
                    }}
                  >
                    {`${jugador.usuario.apellido} ${jugador.usuario.nombre}`}
                  </button>
                </>
              );
            })}
        </div>
        <div className="h-[80vh] flex-1 p-4">
          <div className="flex w-full flex-col items-center  gap-5">
            {listaDeAcciones &&
              listaDeAcciones.map((accion) => {
                return (
                  <div
                    key={accion.id}
                    className="flex items-center justify-center space-x-4"
                  >
                    <span className="min-w-[200px] whitespace-normal break-words text-center  text-xl font-semibold">
                      {accion.nombreTipoAccion}
                    </span>
                    <span className="text-center  text-2xl font-bold">
                      {accionesPorJugador.length === 0 && !jugadorSeleccionado
                        ? 0
                        : verTotalPorAccion(accion)}
                    </span>
                    <Button
                      isDisabled={!jugadorSeleccionado}
                      onClick={() => {
                        altaAccionEstadistica(accion.id);
                      }}
                    >
                      +
                    </Button>
                    <Button
                      isDisabled={!jugadorSeleccionado}
                      onClick={() => {
                        bajaAccionEstadistica(accion.id);
                      }}
                    >
                      -
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <section className="flex w-full flex-row-reverse gap-4">
        <Button
          colorScheme="blue"
          onClick={() => {
            setModalFinalizarLeccion(true);
          }}
        >
          Finalizar
        </Button>
      </section>
      <FlowModal
        title={`Finalizar leccion`}
        modalBody={<div>Seguro que desea finalizar la leccion en curso</div>}
        primaryTextButton="Aceptar"
        isOpen={modalFinalizarLeccion}
        scrollBehavior="outside"
        onAcceptModal={finalizarLeccion}
        type="submit"
        onCancelModal={() => {
          setModalFinalizarLeccion(false);
        }}
      />
    </section>
  );
};
export default page;
