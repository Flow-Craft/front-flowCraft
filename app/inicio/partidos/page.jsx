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
  getPartidoAdmin,
  getPartidoByIdAdmin,
  getPartidosAsignadosAdmin,
  getPlanilleroYArbritroByPartidoId,
  IniciarPartidoAdmin,
  suspenderPartidoAdmin,
} from '@/app/utils/actions';
import MatchCard from './components/matchCard/matchCard';
import { FormDetallePartido } from './components/formDetallePartido/formDetallePartido';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import toast, { Toaster } from 'react-hot-toast';
import { ModalOverlay } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  LOCAL_STORAGE_PERFIL_KEY,
  LOCAL_STORAGE_PERMISOS_KEY,
} from '@/app/utils/const';

const PERFIL_BOTON_ASIGNADO = ['Admin', 'Arbitro', 'Planillero'];

function Page() {
  const [fechaPartidoIngresada, setFechaPartidoIngresada] = useState(null);
  const [asignado, setAsignado] = useState(false);
  const [instalacion, setInstalacion] = useState([]);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({
    value: 0,
    label: 'Todas las instalaciones',
  });
  const [eventosSeleccionado, setEventosSeleccionado] = useState({});
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
  const [perfilUsuario, setPerfilUsuario] = useState('');
  const [permisosUsuarios, setPermisosUsuarios] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const handleGetMatchDetails = async (partido) => {
    const partidoSeleccionado = partidos.find((part) => partido.id === part.id);
    setEventosSeleccionado(partidoSeleccionado);
    const result = await getPlanilleroYArbritroByPartidoId(partido.id);
    if (result.length !== 2) {
      setDisabled(true);
    } else {
      setDisabled(estaHabilitadoElEvento(partidoSeleccionado));
    }
    setDetallesDelPartido(true);
  };
  const getInstalaciones = async () => {
    const result = await getInstalacionesActionAdmin();
    const instalaciones = [
      { value: 0, label: 'Todas las instalaciones' },
      ...result.map((ins) => ({ value: ins.id, label: ins.nombre })),
    ];
    setInstalacion(instalaciones);
  };

  const handleSearchMatches = () => {
    const partidosAVer = partidos.map((partido) => ({
      id: partido.id,
      equipoLocal: partido?.local?.equipo?.nombre,
      equipoVisitante: partido?.visitante?.equipo?.nombre,
      nombrePartido: partido?.titulo,
      fechaPartido: partido?.fechaInicio,
      estadoPartido:
        partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado,
      totalEquipoLocal: partido?.resultadoLocal || 0,
      totalEquipoVisitante: partido?.resultadoVisitante || 0,
      instalacionPartido: partido.instalacion,
    }));

    const nuevosPartidosAVer = partidosAVer.filter((objeto) => {
      // Filtro de fecha
      const coincideFecha =
        !fechaPartidoIngresada ||
        objeto.fechaPartido.slice(0, 10) === fechaPartidoIngresada;

      // Filtro de instalación
      const coincideInstalacion =
        !instalacionSeleccionada ||
        instalacionSeleccionada.value === 0 ||
        objeto.instalacionPartido.id === instalacionSeleccionada.value;

      // Incluir el objeto si ambas condiciones son verdaderas
      return coincideFecha && coincideInstalacion;
    });
    setPartidoAver(nuevosPartidosAVer);
  };

  const handleAsingado = async (checked) => {
    setInstalacionSeleccionada({ value: 0, label: 'Todas las instalaciones' });
    setFechaPartidoIngresada('');
    setAsignado(checked);
    try {
      if (checked) {
        const eventos = await getPartidosAsignadosAdmin();
        const partidos = eventos
          .filter((ev) => ev?.tipoEvento?.nombreTipoEvento === 'Partido')
          .map((partido) => partido.id);
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
          instalacionPartido: partido.instalacion,
        }));
        setPartidoAver(partidosAVer);
      } else {
        getTodosLosPartidos();
      }
    } catch (error) {
      console.error('error', error);
      toast.error(error.title);
    }
  };

  const getTodosLosPartidos = async () => {
    const result = await getPartidoAdmin();
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
      instalacionPartido: partido.instalacion,
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
      toast.success('Partido suspendido con éxito');
      getInstalaciones();
      getTodosLosPartidos();
      setEventosSeleccionado({});
      setSuspenderPartidoModal(false);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const estaHabilitadoElEvento = (evento) => {
    const { funcionalidades: funcionalidadesSocio } =
      permisosUsuarios.find((el) => el.funcionalidades === 'Ver partidos') ||
      {};
    const { funcionalidades: funcionalidadesAdmin } =
      permisosUsuarios.find(
        (el) => el.funcionalidades === 'Gestionar partido',
      ) || {};
    const esPerfilValido =
      perfilUsuario === 'Socio' || perfilUsuario === 'Simpatizante';
    const { funcionalidades: funcionalidadesPlanillero } =
      permisosUsuarios.find(
        (el) => el.funcionalidades === 'Gestionar estadisticas partido',
      ) || {};
    const estadoEvento =
      evento?.historialEventoList?.[0]?.estadoEvento?.nombreEstado;
    const fechaInicio = new Date(evento?.fechaInicio);
    const fechaFinEvento = new Date(evento?.fechaFinEvento);
    const fechaActual = new Date();

    if (
      (funcionalidadesPlanillero || funcionalidadesSocio || esPerfilValido) &&
      (estadoEvento === 'Iniciado' || estadoEvento === 'Entretiempo')
    ) {
      return false;
    }

    if (!funcionalidadesAdmin) {
      return true;
    }

    // Comprobar si el evento está suspendido o si la fecha actual está fuera del rango del evento
    const eventoSuspendido = estadoEvento === 'Suspendido';
    const fueraDeRango = !(
      fechaActual >= fechaInicio && fechaActual <= fechaFinEvento
    );

    return eventoSuspendido || fueraDeRango;
  };

  const handlePartidos = () => {
    const tienePermisoVer = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Ver partidos',
    );
    const tienePermisoGestion = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Gestionar partido',
    );
    const tienePermisoGestionEstadisticas = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Gestionar estadisticas partido',
    );
    const esPerfilSocioOSimpatizante =
      perfilUsuario === 'Socio' || perfilUsuario === 'Simpatizante';
    const estadoEvento =
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento?.nombreEstado;

    if (tienePermisoGestionEstadisticas) {
      return router.push(`partidos/estadisticas/${eventosSeleccionado.id}`);
    }

    if (tienePermisoVer && esPerfilSocioOSimpatizante && !tienePermisoGestion) {
      return router.push(`partidos/tiempo-real/${eventosSeleccionado.id}`);
    }

    switch (estadoEvento) {
      case 'Iniciado':
        return router.push(`partidos/arbitro/${eventosSeleccionado.id}`);
      case 'Creado':
        return prepararPartido();
      default:
        setDetallesDelPartido(false);
    }
  };

  const handlePartidosNombre = () => {
    const tienePermisoVer = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Ver partidos',
    );
    const tienePermisoGestion = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Gestionar partido',
    );
    const tienePermisoGestionEstadisticas = permisosUsuarios.some(
      (el) => el.funcionalidades === 'Gestionar estadisticas partido',
    );
    const esPerfilSocioOSimpatizante =
      perfilUsuario === 'Socio' || perfilUsuario === 'Simpatizante';
    const estadoEvento =
      eventosSeleccionado?.historialEventoList?.[0]?.estadoEvento?.nombreEstado;

    if (tienePermisoGestionEstadisticas) {
      return 'Cargar estadisticas del partido';
    }

    // Condición para ver el partido en tiempo real
    if (
      (tienePermisoVer || esPerfilSocioOSimpatizante) &&
      !tienePermisoGestion
    ) {
      return 'Ver en tiempo real';
    }

    // Condiciones para el estado del evento
    switch (estadoEvento) {
      case 'Iniciado':
        return 'Continuar Partido';
      case 'Creado':
        return 'Preparar Partido';
      default:
        return '';
    }
  };

  const getPermisosUsuarios = () => {
    const perfilUsuario = window.localStorage.getItem(LOCAL_STORAGE_PERFIL_KEY);
    const permisos = window.localStorage.getItem(LOCAL_STORAGE_PERMISOS_KEY);
    const permisosJSON = JSON.parse(permisos);
    setPermisosUsuarios(permisosJSON);
    setPerfilUsuario(perfilUsuario);
  };

  const gestionaPartidos = () => {
    return !!permisosUsuarios.find(
      (el) => el.funcionalidades === 'Gestionar partido',
    );
  };

  useEffect(() => {
    getInstalaciones();
    getTodosLosPartidos();
    getPermisosUsuarios();
  }, []);

  useEffect(() => {
    handleSearchMatches();
  }, [fechaPartidoIngresada, instalacionSeleccionada]);
  return (
    <section>
      <Toaster />
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Partidos
      </div>
      <div className="flex flex-row flex-wrap gap-5">
        <div className="flex flex-row items-center gap-3">
          {perfilUsuario &&
            PERFIL_BOTON_ASIGNADO.findIndex(
              (perfil) => perfil === perfilUsuario,
            ) !== -1 && (
              <>
                <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                  Asignados:
                </label>
                <InputWithLabel
                  name="Socio"
                  type="checkbox"
                  stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultChecked={asignado}
                  defaultValue={asignado}
                  onChange={(e) => {
                    handleAsingado(e.target.checked);
                  }}
                />
              </>
            )}
        </div>
        <div className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Fecha:
          </label>
          <InputWithLabel
            name={'fecha'}
            type="date"
            defaultValue={fechaPartidoIngresada}
            onChange={(e) => setFechaPartidoIngresada(e.target.value)}
          />
        </div>
        <div className="flex min-w-[170px] flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Instalación:
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
              gestionaPartidos={gestionaPartidos()}
            />
          </>
        }
        primaryTextButton={handlePartidosNombre()}
        disabled={disabled}
        isOpen={detallesDelPartido}
        scrollBehavior="outside"
        onAcceptModal={handlePartidos}
        onCancelModal={() => {
          setDetallesDelPartido(false);
          setEventosSeleccionado({});
          setDisabled(false);
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
                <span>{eventosSeleccionado?.disciplina?.nombre}</span>
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
        disabled={
          equipoLocalSeleccionado.length === 0 ||
          equipoVisitanteSeleccionado.length === 0
        }
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
