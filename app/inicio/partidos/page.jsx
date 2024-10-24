'use client';
import { useEffect, useState } from 'react';
import withAuthorization from '../../../app/utils/autorization';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  createTimer,
  getEventosActivos,
  getEventosAdmin,
  getInstalacionesActionAdmin,
  getPartidoByIdAdmin,
  IniciarPartidoAdmin,
  suspenderPartidoAdmin,
} from '@/app/utils/actions';
import MatchCard from './components/matchCard/matchCard';
import { FormDetallePartido } from './components/formDetallePartido/formDetallePartido';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import toast, { Toaster } from 'react-hot-toast';
import { ModalOverlay } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

function Page() {
  const [fechaPartido, setFechaPartido] = useState(null);
  const [asignado, setAsignado] = useState(false);
  const [instalacion, setInstalacion] = useState([]);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({
    value: 0,
    label: 'Todas las instalaciones',
  });
  const [eventosSeleccionado, setEventosSeleccionado] = useState({});
  console.log('eventosSeleccionado', eventosSeleccionado);
  const [partidos, setPartidos] = useState([]);
  const [partidoAver, setPartidoAver] = useState([]);
  const [detallesDelPartido, setDetallesDelPartido] = useState(false);
  const [suspenderPartidoModal, setSuspenderPartidoModal] = useState(false);
  const [modalPrepararPartido, setModalPrepararPartido] = useState(false);
  const [equipoLocalSeleccionado, setEquipoLocalSeleccionado] = useState([]);
  const [equipoVisitanteSeleccionado, setEquipoVisitanteSeleccionado] =
    useState([]);
  const [confirmacionInicioPartido, setConfirmacionInicioPartido] =
    useState(false);
  const router = useRouter();

  const handleGetMatchDetails = (partido) => {
    const partidoSeleccionado = partidos.find((part) => partido.id === part.id);
    setEventosSeleccionado(partidoSeleccionado);
    setDetallesDelPartido(true);
  };
  const getInstalaciones = async () => {
    const result = await getInstalacionesActionAdmin();
    const instalaciones = [
      { value: undefined, label: 'Todas las instalaciones' },
      ...result.map((ins) => ({ value: ins.id, label: ins.nombre })),
    ];
    setInstalacion(instalaciones);
  };

  const handleSearchMatches = () => {};

  const getTodosLosPartidos = async () => {
    const eventos = await getEventosAdmin();
    const partidos = eventos
      .filter((ev) => ev?.evento?.tipoEvento?.nombreTipoEvento === 'Partido')
      .map((part) => part.evento.id);
    const promises = partidos.map((part) => getPartidoByIdAdmin(part));
    const result = await Promise.all(promises);
    setPartidos(result);
    const partidosAVer = result.map((partido) => ({
      id: partido.id,
      equipoLocal: partido?.local?.equipo?.nombre,
      equipoVisitante: partido?.visitante?.equipo?.nombre,
      nombrePartido: partido?.titulo,
      fechaPartido: partido?.fechaInicio,
      estadoPartido:
        partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado,
      totalEquipoLocal: partido?.resultadoLocal || 0,
      totalEquipoVisitante: partido?.resultadoVisitante || 0,
    }));
    setPartidoAver(partidosAVer);
  };

  const prepararPartido = () => {
    setDetallesDelPartido(false);
    setModalPrepararPartido(true);
  };

  const iniciarPartido = async () => {
    try {
      if (
        equipoLocalSeleccionado.length === 0 ||
        equipoVisitanteSeleccionado.length === 0
      ) {
        toast.error('Debe seleccionar los jugadores que iran a cancha');
        return;
      }
      const partidoAIniciar = {
        Id: eventosSeleccionado.id,
        jugadoresCanchaEquipLoc: equipoLocalSeleccionado.map(
          (jug) => jug.value,
        ),
        jugadoresCanchaEquipVis: equipoVisitanteSeleccionado.map(
          (jug) => jug.value,
        ),
      };
      await IniciarPartidoAdmin(partidoAIniciar);
      setModalPrepararPartido(false);
      setConfirmacionInicioPartido(true);
      await createTimer(5000);
      setConfirmacionInicioPartido(false);
      router.push(`partidos/arbitro/${eventosSeleccionado.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSuspenderPartido = () => {
    setDetallesDelPartido(false);
    setSuspenderPartidoModal(true);
  };

  const suspenderPartido = async (e) => {
    try {
      await suspenderPartidoAdmin(
        eventosSeleccionado.id,
        e.target.descripcion.value,
      );
      toast.success('Partido suspendido con exito');
      getInstalaciones();
      getTodosLosPartidos();
      setEventosSeleccionado({});
      setSuspenderPartidoModal(false);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getInstalaciones();
    getTodosLosPartidos();
  }, []);

  useEffect(() => {
    handleSearchMatches();
  }, [asignado, fechaPartido, instalacionSeleccionada]);

  const estaHabilitadoElEvento = (evento) => {
    return (
      evento?.historialEventoList?.[0]?.estadoEvento?.nombreEstado ===
        'Suspendido' ||
      !(
        new Date() >= new Date(evento?.fechaInicio) &&
        new Date() <= new Date(evento?.fechaFinEvento)
      )
    );
  };

  const handlePartidos = () => {
    if (
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento
        ?.nombreEstado === 'Iniciado'
    ) {
      router.push(`partidos/arbitro/${eventosSeleccionado.id}`);
    }
    if (
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento
        ?.nombreEstado === 'Creado'
    ) {
      return prepararPartido();
    }
    return setDetallesDelPartido(false);
  };

  const handlePartidosNombre = () => {
    if (
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento
        ?.nombreEstado === 'Iniciado'
    ) {
      return 'Continuar Partido';
    }
    if (
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento
        ?.nombreEstado === 'Creado'
    ) {
      return 'Preparar Partido';
    }
  };

  return (
    <section>
      <Toaster />
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Partidos
      </div>
      <div className="flex flex-row flex-wrap gap-5">
        <div className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Asingados:
          </label>
          <InputWithLabel
            name="Socio"
            type="checkbox"
            stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            defaultChecked={asignado}
            defaultValue={asignado}
            onChange={(e) => {
              setAsignado(e.target.checked);
            }}
          />
        </div>
        <div className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Fecha:
          </label>
          <InputWithLabel
            name={'fecha'}
            type="date"
            defaultValue={fechaPartido}
            onChange={(e) => setFechaPartido(e.target.value)}
          />
        </div>
        <div className="flex min-w-[170px] flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Instalacion:
          </label>
          <div className="min-w-[170px]">
            <SelectWithLabel
              name="instalacion"
              options={instalacion}
              value={instalacionSeleccionada}
              onChange={(e) => {
                setInstalacionSeleccionada(e);
              }}
            />
          </div>
        </div>
      </div>
      <section className="items-centerbg-gray-100 flex justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="space-y-4 overflow-y-auto">
            {partidoAver.map((partido) => (
              <MatchCard
                key={partido.id}
                handleGetMatchDetails={handleGetMatchDetails}
                partido={partido}
              />
            ))}
          </div>
        </div>
      </section>
      <FlowModal
        title={`Detalles del partido`}
        modalBody={
          <>
            <FormDetallePartido
              partido={eventosSeleccionado}
              handleSuspenderPartido={handleSuspenderPartido}
            />
          </>
        }
        primaryTextButton={handlePartidosNombre()}
        disabled={estaHabilitadoElEvento(eventosSeleccionado)}
        isOpen={detallesDelPartido}
        scrollBehavior="outside"
        onAcceptModal={handlePartidos}
        onCancelModal={() => {
          setDetallesDelPartido(false);
          setEventosSeleccionado({});
        }}
      />
      <FlowModal
        title={`¿Por que quiere suspender este partido?`}
        modalBody={
          <div>
            <label
              className="mb-3 mt-5 block text-lg font-medium text-gray-900"
              htmlFor={'descripcion'}
            >
              Descripcion
              <textarea
                name="descripcion"
                rows="5"
                cols="50"
                className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
              />
            </label>
          </div>
        }
        primaryTextButton={'Suspender Partido'}
        isOpen={suspenderPartidoModal}
        scrollBehavior="outside"
        onAcceptModal={suspenderPartido}
        type="submit"
        onCancelModal={() => {
          setSuspenderPartidoModal(false);
          setEventosSeleccionado({});
        }}
      />
      <FlowModal
        title={`Preparar partido`}
        sx={{ minWidth: '900px' }}
        modalBody={
          <div className="w-full">
            <section className="flex w-full flex-row justify-between gap-10">
              <div className="flex-1">
                <span className="text-xl font-bold">Disciplina: </span>
                <span>{eventosSeleccionado?.disciplinas?.[0]?.nombre}</span>
              </div>
              <div className="flex-1">
                <span className="text-xl font-bold">Categoria: </span>
                <span>{eventosSeleccionado?.categoria?.nombre}</span>
              </div>
              <div className="flex-1">
                <span className="text-xl font-bold">Fecha de partido: </span>
                <span>
                  {new Date(
                    eventosSeleccionado.fechaInicio,
                  ).toLocaleDateString()}
                </span>
              </div>
            </section>

            <section className="flex-full z-50 mt-4 flex w-full gap-10">
              <div className="mb-16 flex-1  ">
                <SelectWithLabel
                  name="IdsDisciplinas"
                  options={eventosSeleccionado?.local?.equipo?.equipoUsuarios?.map(
                    (user) => ({
                      value: user.id,
                      label: `${user.numCamiseta} -  ${user.usuario.apellido} ${user.usuario.nombre}`,
                    }),
                  )}
                  label="Equipo Local"
                  isMulti
                  onChange={(seleccionado) => {
                    setEquipoLocalSeleccionado(seleccionado);
                  }}
                />
              </div>
              <div className="min-h-12 flex-1">
                <SelectWithLabel
                  name="IdsDisciplinas"
                  options={eventosSeleccionado?.visitante?.equipo?.equipoUsuarios?.map(
                    (user) => ({
                      value: user.id,
                      label: `${user.numCamiseta} -  ${user.usuario.apellido} ${user.usuario.nombre}`,
                    }),
                  )}
                  label="Equipo Visitante"
                  isMulti
                  onChange={(selection) => {
                    setEquipoVisitanteSeleccionado(selection);
                  }}
                />
              </div>
            </section>
          </div>
        }
        primaryTextButton={'Iniciar Partido'}
        isOpen={modalPrepararPartido}
        onAcceptModal={iniciarPartido}
        scrollBehavior="outside"
        type="submit"
        onCancelModal={() => {
          setModalPrepararPartido(false);
          setEventosSeleccionado({});
        }}
      />
      <FlowModal
        sx={{ minWidth: '700px' }}
        modalBody={
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              Partido Iniciado Correctamente
            </span>
          </div>
        }
        isOpen={confirmacionInicioPartido}
        primaryTextButton={null}
        scrollBehavior="outside"
        overlay={<ModalOverlay bg="#3182ce.300" backdropFilter="blur(10px)" />}
        onCancelModal={() => {}}
      />
    </section>
  );
}

export default withAuthorization(Page, 'Partidos');
