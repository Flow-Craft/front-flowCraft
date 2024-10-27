'use client';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getActionPartidoPanelAdmin,
  getPartidoByIdAdmin,
  finalizarPartidoAdmin,
  createTimer,
  suspenderPartidoAdmin,
  finalizarTiempoAdmin,
  iniciarTiempoAdmin,
  cargarAccionPartidoAdmin,
  getActionPartidoByIdAdmin,
} from '@/app/utils/actions';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { ModalOverlay } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';

const periodos = {
  1: 'Primer',
  2: 'Segundo',
  3: 'Tercero',
  4: 'Cuarto',
  5: 'Quinto',
  6: 'Sexto',
  7: 'Séptimo',
  8: 'Octavo',
  9: 'Noveno',
  10: 'Décimo',
};

const ENTRETIEMPO_CONST = 'Entretiempo';
const TIEMPO_FUTBOL = 45;
const TIEMPO_VOLEY = 10;

const PartidoScreen = () => {
  const [partido, setPartido] = useState({
    equipo1: 1,
    equipo2: 0,
    tiempo: '00:00',
    golesEquipo1: [{ id: 1, jugador: '08 - A. NOMBRE (A)' }],
    faltasEquipo1: [{ id: 2, jugador: '08 - A. NOMBRE (A)' }],
    cambiosEquipo1: [
      { id: 3, entrada: '17 - A. NOMBRE', salida: '07 - A. NOMBRE' },
    ],
    golesEquipo2: [{ id: 4, jugador: '07 - A. NOMBRE (B)' }],
    faltasEquipo2: [{ id: 5, jugador: '07 - A. NOMBRE (B)' }],
    cambiosEquipo2: [
      { id: 6, entrada: '16 - B. NOMBRE', salida: '07 - B. NOMBRE' },
    ],
  });
  const [partidoId, setPartidoId] = useState('');
  const [partidoData, setPartidoData] = useState({});
  const [estadoDelPartido, setEstadoDelPartido] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [accionPartido, setAccionPartido] = useState([]);
  const [modalFinalizarPartido, setModalFinalizarPartido] = useState(false);
  const [modalFinalizarTiempo, setModalFinalizarTiempo] = useState(false);
  const [modalIniciarTiempo, setModalIniciarTiempo] = useState(false);
  const [modalAltaAccion, setModalAltaAccion] = useState(false);
  const [modalBajaAccion, setModalBajaAccion] = useState(false);
  const [accionSeleccionada, setAccionSeleccionada] = useState({
    accion: {},
    esLocal: true,
  });
  console.log('accionSeleccionada', accionSeleccionada);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [accionADarDeBaja, setAccionADarDeBaja] = useState({});
  const [usuarioParaCambio, setUsuarioParaCambio] = useState({});
  const [confirmacionFinalizacionPartido, setConfirmacionFinalizacionPartido] =
    useState(false);
  const [modalSuspenderPartido, setModalSuspenderPartido] = useState(false);
  const [accionesLocal, setAccionesLocal] = useState([]);
  const [accionesVisitantes, setAccionesVisitantes] = useState([]);
  const [timeDifference, setTimeDifference] = useState(0);
  const router = useRouter();

  const getDataDelPatido = async (partidoId) => {
    const partido = await getPartidoByIdAdmin(partidoId);
    console.log('partido', partido);
    const listaAccionPartido = await getActionPartidoByIdAdmin(partidoId);
    const accionesLocal = listaAccionPartido.filter(
      (accion) => accion.equipoLocal === true,
    );
    console.log('accionesLocal', accionesLocal);
    setAccionesLocal(accionesLocal);
    const accionesVisitantes = listaAccionPartido.filter(
      (accion) => accion.equipoLocal === false,
    );
    setAccionesVisitantes(accionesVisitantes);
    console.log('accionesVisitantes', accionesVisitantes);
    if (
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
        'Iniciado' &&
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
        ENTRETIEMPO_CONST
    ) {
      toast.error('el partido es incorrecto');
      router.back();
      return;
    }
    setPartidoData(partido);
    setEstadoDelPartido(
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado,
    );
    const result = await getActionPartidoPanelAdmin({
      IdDisciplina: partido?.disciplina?.id,
      Estadistica: false,
      Partido: true,
    });
    setPartidoId(partido.id);
    setAccionPartido(result);
    setIsLoading(false);
  };

  const finalizarPartido = async () => {
    try {
      await finalizarPartidoAdmin(partidoId);
      setConfirmacionFinalizacionPartido(true);
      await createTimer(1500);
      router.back();
    } catch (error) {
      console.error(error.message.title);
    }
  };

  const suspenderPartido = async (e) => {
    try {
      await suspenderPartidoAdmin(partidoId, e.target.descripcion.value);
      toast.success('Partido suspendido con exito');
      router.back();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const iniciarTiempo = async () => {
    try {
      await iniciarTiempoAdmin(partidoId);
      toast.success('Tiempo iniciado con exito');
      getDataDelPatido(partidoId);
      setModalIniciarTiempo(false);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const finalizarTiempo = async () => {
    try {
      await finalizarTiempoAdmin(partidoId);
      toast.success('Tiempo finalizado con exito');
      getDataDelPatido(partidoId);
      setModalFinalizarTiempo(false);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const getJugadores = () => {
    let opciones;
    if (accionSeleccionada.esLocal) {
      opciones = partidoData.local.equipo.equipoUsuarios.filter((usuario) =>
        partidoData.local.jugadoresEnCancha.includes(
          usuario.numCamiseta.toString(),
        ),
      );
    } else {
      opciones = partidoData.visitante.equipo.equipoUsuarios.filter((usuario) =>
        partidoData.visitante.jugadoresEnCancha.includes(
          usuario.numCamiseta.toString(),
        ),
      );
    }
    opciones = opciones.map((us) => ({
      value: us.id,
      label: `${us.numCamiseta} - ${us.usuario.apellido} ${us.usuario.apellido} `,
    }));
    return opciones;
  };

  const getJugadoresParaCambio = () => {
    let opciones;
    if (accionSeleccionada.esLocal) {
      opciones = partidoData.local.equipo.equipoUsuarios.filter((usuario) =>
        partidoData.local.jugadoresEnBanca.includes(
          usuario.numCamiseta.toString(),
        ),
      );
    } else {
      opciones = partidoData.visitante.equipo.equipoUsuarios.filter((usuario) =>
        partidoData.visitante.jugadoresEnBanca.includes(
          usuario.numCamiseta.toString(),
        ),
      );
    }
    opciones = opciones.map((us) => ({
      value: us.id,
      label: `${us.numCamiseta} - ${us.usuario.apellido} ${us.usuario.apellido} `,
    }));
    return opciones;
  };

  const calcularHoraAccion = () => {
    const targetDate = new Date(
      partidoData?.historialEventoList?.[0]?.fechaInicio,
    );
    const targetDateWithAddedMinutes = new Date(targetDate);
    targetDateWithAddedMinutes.setMinutes(targetDate.getMinutes());
    // Calcular la diferencia inicial
    const now = new Date();
    let difference = Math.max(0, now - targetDateWithAddedMinutes);
    difference += TIEMPO_FUTBOL * 60 * 1000 * (partidoData.periodo - 1);
    const totalSeconds = Math.floor(difference / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    return Number(minutes);
  };

  const altaAccionPartido = async () => {
    try {
      let accionAMandar;
      if (partidoData.disciplina.nombre.toLowerCase().includes('futbol')) {
        accionAMandar = {
          IdPartido: partidoId,
          IdTipoAccion: accionSeleccionada.accion.id,
          IdJugador: usuarioSeleccionado.value,
          EquipoLocal: accionSeleccionada.esLocal,
          IdJugadorEnBanca: 0,
          Minuto: calcularHoraAccion(),
        };
        if (accionSeleccionada?.accion?.nombreTipoAccion?.includes('Cambio')) {
          accionAMandar['IdJugadorEnBanca'] = usuarioParaCambio.value;
        }
      } else {
      }
      await cargarAccionPartidoAdmin(accionAMandar);
      toast.success('accion cargada exitosamente');
      getDataDelPatido(partidoId);
      setModalAltaAccion(false);
      setAccionSeleccionada({ accion: {}, esLocal: true });
      setUsuarioSeleccionado({});
      setUsuarioParaCambio({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDataJugador = (numeroJugador, isLocal, numeroCambio) => {
    if (numeroCambio) {
      const dataJugador = partidoData?.[
        isLocal ? 'local' : 'visitante'
      ]?.equipo?.equipoUsuarios?.find(
        (usuario) => usuario.numCamiseta === numeroJugador,
      );
      const dataJugadorCambio = partidoData?.[
        isLocal ? 'local' : 'visitante'
      ]?.equipo?.equipoUsuarios?.find(
        (usuario) => usuario.numCamiseta === numeroCambio,
      );
      return `${dataJugadorCambio?.usuario?.apellido} ${dataJugadorCambio?.usuario?.nombre} <--> ${dataJugador?.usuario?.apellido} ${dataJugador?.usuario?.nombre}`;
    }
    const dataJugador = partidoData?.[
      isLocal ? 'local' : 'visitante'
    ]?.equipo?.equipoUsuarios?.find(
      (usuario) => usuario.numCamiseta === numeroJugador,
    );
    return `Num: ${dataJugador?.numCamiseta} / ${dataJugador?.puesto} / ${dataJugador?.usuario?.apellido} ${dataJugador?.usuario?.nombre}`;
  };

  const getAcciones = () => {
    console.log(accionSeleccionada);
    return [];
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    setPartidoId(idFromPath);
    getDataDelPatido(idFromPath);
  }, []);

  // useEffect(() => {
  //   // Obtener la hora actual y la hora objetivo
  //   const targetDate = new Date(partidoData?.historialEventoList?.[0]?.fechaInicio);
  //   // Calcular la diferencia inicial
  //   const calculateDifference = () => {
  //     const now = new Date();
  //     const difference = Math.max(0, now - targetDate); // Evita diferencias negativas
  //     setTimeDifference(difference);
  //   };

  //   // Actualizar cada segundo
  //   const interval = setInterval(() => {
  //     calculateDifference();
  //   }, 1000);

  //   // Limpiar intervalo al desmontar el componente
  //   return () => clearInterval(interval);
  // }, [partidoData]);

  if (isLoading) {
    return (
      <>
        <Toaster />
      </>
    );
  }

  return (
    <section className="w-full">
      <h1 className="mb-6 text-left text-3xl font-bold">Partido Iniciado</h1>
      <Box className="mx-auto space-y-8 p-6">
        {/* Botones de acciones */}
        <div className="mt-4 flex justify-between">
          <Button
            colorScheme="green"
            onClick={() => {
              setModalSuspenderPartido(true);
            }}
          >
            Suspender Partido
          </Button>
          {partidoData?.periodo < partidoData?.disciplina?.periodosMax && (
            <Button
              colorScheme="gray"
              onClick={() => {
                if (estadoDelPartido === ENTRETIEMPO_CONST) {
                  setModalIniciarTiempo(true);
                } else {
                  setModalFinalizarTiempo(true);
                }
              }}
            >
              {estadoDelPartido === ENTRETIEMPO_CONST
                ? 'Iniciar Tiempo'
                : 'Finalizar Tiempo'}
            </Button>
          )}
          <Button
            colorScheme="green"
            onClick={() => {
              setModalFinalizarPartido(true);
            }}
          >
            Finalizar Partido
          </Button>
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold">
          {periodos[partidoData?.periodo]} tiempo
        </h1>

        {/* Marcador de los equipos */}
        <div className="mb-8 grid grid-cols-3 items-center gap-8">
          <div className="text-center">
            <p className="text-xl font-semibold">
              Equipo Local: {partidoData?.local?.equipo?.nombre}
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                onClick={() => {
                  const accionSeleccionada = accionPartido.find((acc) =>
                    acc.nombreTipoAccion.includes('Gol'),
                  );
                  setModalAltaAccion(true);
                  setAccionSeleccionada({
                    accion: accionSeleccionada,
                    esLocal: true,
                  });
                }}
              >
                +
              </Button>
              <Button
                isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                onClick={() =>
                  setPartido({ ...partido, equipo1: partido.equipo1 - 1 })
                }
              >
                -
              </Button>
            </div>
          </div>

          <div className="text-center text-5xl font-bold">
            {partidoData.resultadoLocal} - {partidoData.resultadoVisitante}
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold">
              Equipo Visitante: {partidoData?.visitante?.equipo?.nombre}
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                onClick={() => {
                  const accionSeleccionada = accionPartido.find((acc) =>
                    acc.nombreTipoAccion.includes('Gol'),
                  );
                  setModalAltaAccion(true);
                  setAccionSeleccionada({
                    accion: accionSeleccionada,
                    esLocal: false,
                  });
                }}
              >
                +
              </Button>
              <Button
                isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                onClick={() =>
                  setPartido({ ...partido, equipo2: partido.equipo2 - 1 })
                }
              >
                -
              </Button>
            </div>
          </div>
        </div>
        <section className="mb-8 grid grid-cols-3 items-center gap-8">
          {/* Equipo Local */}
          <div className="h-full min-w-[300px]">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>Goles</Tab>
                <Tab>Faltas</Tab>
                <Tab>Tarjetas</Tab>
                <Tab>Cambios</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {accionesLocal.filter((accion) =>
                    accion.descripcion.includes('Gol'),
                  ).length > 0 ? (
                    accionesLocal
                      .filter((accion) => accion.descripcion.includes('Gol'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            Min: {accion.minuto} -{' '}
                            {getDataJugador(accion.nroJugador, true)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay goles registrados</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {accionesLocal.filter((accion) =>
                    accion.descripcion.includes('Falta'),
                  ).length > 0 ? (
                    accionesLocal
                      .filter((accion) => accion.descripcion.includes('Falta'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} -{' '}
                            {getDataJugador(accion.nroJugador, true)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {accionesLocal.filter((accion) =>
                    accion.descripcion.includes('Tarjeta'),
                  ).length > 0 ? (
                    accionesLocal
                      .filter((accion) =>
                        accion.descripcion.includes('Tarjeta'),
                      )
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} - {accion.descripcion} -
                            {getDataJugador(accion.nroJugador, true)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {accionesLocal.filter((accion) =>
                    accion.descripcion.includes('Cambio'),
                  ).length > 0 ? (
                    accionesLocal
                      .filter((accion) => accion.descripcion.includes('Cambio'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} -{' '}
                            {getDataJugador(
                              accion.nroJugador,
                              true,
                              accion.nroJugadorCambio,
                            )}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay cambios registrados</p>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          {/* Acciones (en el centro) */}
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            {accionPartido.map((accion) => {
              if (accion.nombreTipoAccion.includes('Gol')) {
                return <></>;
              }
              if (accion.nombreTipoAccion.includes('Cambio Jugador')) {
                return (
                  <div
                    className="flex items-center justify-center space-x-4"
                    key={accion.id}
                  >
                    <Button
                      onClick={() => {
                        setModalAltaAccion(true);
                        setAccionSeleccionada({ accion, esLocal: true });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      -
                    </Button>
                    <span className="min-w-[180px] whitespace-normal break-words text-center  text-xl font-semibold">
                      {accion.nombreTipoAccion}
                    </span>
                    <Button
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => {
                        setModalAltaAccion(true);
                        setAccionSeleccionada({ accion, esLocal: false });
                      }}
                    >
                      +
                    </Button>
                  </div>
                );
              }
              return (
                <div
                  className="flex items-center justify-center space-x-4"
                  key={accion.id}
                >
                  <Button
                    isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                    onClick={() => {
                      setModalAltaAccion(true);
                      setAccionSeleccionada({ accion, esLocal: true });
                    }}
                  >
                    +
                  </Button>
                  {!accion.secuencial && (
                    <Button
                      isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      /
                    </Button>
                  )}
                  <Button
                    isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                    onClick={() =>
                      setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                    }
                  >
                    -
                  </Button>
                  <span className="min-w-[180px] whitespace-normal break-words text-center  text-xl font-semibold">
                    {accion.nombreTipoAccion}
                  </span>
                  <Button
                    isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                    onClick={() =>
                      setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                    }
                  >
                    -
                  </Button>
                  {!accion.secuencial && (
                    <Button
                      isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      /
                    </Button>
                  )}
                  <Button
                    isDisabled={estadoDelPartido === ENTRETIEMPO_CONST}
                    onClick={() => {
                      setModalAltaAccion(true);
                      setAccionSeleccionada({ accion, esLocal: false });
                    }}
                  >
                    +
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Equipo Visitante */}
          <div className="h-full min-w-[300px]">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>Goles</Tab>
                <Tab>Faltas</Tab>
                <Tab>Tarjetas</Tab>
                <Tab>Cambios</Tab>
              </TabList>

              <TabPanels>
                <TabPanel className="min-h-[300px]">
                  {/* Mostrar goles del equipo local */}
                  {accionesVisitantes.filter((accion) =>
                    accion.descripcion.includes('Gol'),
                  ).length > 0 ? (
                    accionesVisitantes
                      .filter((accion) => accion.descripcion.includes('Gol'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            Min: {accion.minuto} -{' '}
                            {getDataJugador(accion.nroJugador, false)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay goles registrados</p>
                  )}
                </TabPanel>

                <TabPanel className="min-h-[300px]">
                  {accionesVisitantes.filter((accion) =>
                    accion.descripcion.includes('Falta'),
                  ).length > 0 ? (
                    accionesVisitantes
                      .filter((accion) => accion.descripcion.includes('Falta'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} -{' '}
                            {getDataJugador(accion.nroJugador, false)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>
                <TabPanel className="min-h-[300px]">
                  {accionesVisitantes.filter((accion) =>
                    accion.descripcion.includes('Tarjetas'),
                  ).length > 0 ? (
                    accionesVisitantes
                      .filter((accion) =>
                        accion.descripcion.includes('Tarjetas'),
                      )
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} - {accion.descripcion} -
                            {getDataJugador(accion.nroJugador, false)}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>

                <TabPanel className="min-h-[300px]">
                  {accionesVisitantes.filter((accion) =>
                    accion.descripcion.includes('Cambio'),
                  ).length > 0 ? (
                    accionesVisitantes
                      .filter((accion) => accion.descripcion.includes('Cambio'))
                      .map((accion) => {
                        return (
                          <p key={accion.id}>
                            {accion.minuto} -{' '}
                            {getDataJugador(
                              accion.nroJugador,
                              true,
                              accion.nroJugadorCambio,
                            )}
                          </p>
                        );
                      })
                  ) : (
                    <p>No hay cambios registrados</p>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </section>

        {/* Tiempo */}
        <div className="mt-8 text-center text-4xl font-bold">
          {/* {formatTime(timeDifference)} */}
        </div>
      </Box>
      <FlowModal
        title={`Seguro que desea finalizar el partido`}
        modalBody={<></>}
        primaryTextButton={'Si'}
        isOpen={modalFinalizarPartido}
        scrollBehavior="outside"
        onAcceptModal={finalizarPartido}
        onCancelModal={() => {
          setModalFinalizarPartido(false);
        }}
      />
      <FlowModal
        title={`Finalizar Tiempo`}
        modalBody={
          <>Esta por finalizar el tiempo {partidoData.periodo} ¿Esta seguro?</>
        }
        primaryTextButton={'Finalizar'}
        isOpen={modalFinalizarTiempo}
        scrollBehavior="outside"
        onAcceptModal={finalizarTiempo}
        onCancelModal={() => {
          setModalFinalizarTiempo(false);
        }}
      />
      <FlowModal
        title={`Iniciar Tiempo`}
        modalBody={
          <>
            Esta por iniciar el tiempo {partidoData.periodo + 1} ¿Esta seguro?
          </>
        }
        primaryTextButton={'Iniciar'}
        isOpen={modalIniciarTiempo}
        scrollBehavior="outside"
        onAcceptModal={iniciarTiempo}
        onCancelModal={() => {
          setModalIniciarTiempo(false);
        }}
      />
      <FlowModal
        sx={{ minWidth: '700px' }}
        modalBody={
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              Partido Finalizado Correctamente
            </span>
          </div>
        }
        isOpen={confirmacionFinalizacionPartido}
        primaryTextButton={null}
        scrollBehavior="outside"
        overlay={<ModalOverlay bg="#3182ce.300" backdropFilter="blur(10px)" />}
        onCancelModal={() => {}}
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
        isOpen={modalSuspenderPartido}
        scrollBehavior="outside"
        onAcceptModal={suspenderPartido}
        type="submit"
        onCancelModal={() => {
          setModalSuspenderPartido(false);
        }}
      />
      <FlowModal
        title={`${accionSeleccionada.accion.nombreTipoAccion}`}
        sx={{ minWidth: '800px' }}
        modalBody={
          <section className="flex-full z-50 mt-4 flex w-full gap-10">
            <div className="mb-16 flex-1  ">
              <SelectWithLabel
                name="IdsDisciplinas"
                options={getJugadores()}
                label="Seleccione el jugador"
                onChange={(seleccionado) => {
                  setUsuarioSeleccionado(seleccionado);
                }}
              />
            </div>
            {accionSeleccionada?.accion?.nombreTipoAccion?.includes(
              'Cambio',
            ) && (
              <div className="min-h-12 flex-1">
                <SelectWithLabel
                  name="IdsDisciplinas"
                  options={getJugadoresParaCambio()}
                  label="Seleccione el jugador"
                  onChange={(seleccionado) => {
                    setUsuarioParaCambio(seleccionado);
                  }}
                />
              </div>
            )}
          </section>
        }
        isOpen={modalAltaAccion}
        disabled={
          accionSeleccionada?.accion?.nombreTipoAccion?.includes('Cambio')
            ? !usuarioSeleccionado.value || !usuarioParaCambio.value
            : !usuarioSeleccionado.value
        }
        primaryTextButton={'Aceptar'}
        scrollBehavior="outside"
        onCancelModal={() => {
          setModalAltaAccion(false);
          setAccionSeleccionada({ accion: {}, esLocal: true });
          setUsuarioSeleccionado({});
          setUsuarioParaCambio({});
        }}
        onAcceptModal={altaAccionPartido}
      />
      <Toaster />
    </section>
  );
};

export default PartidoScreen;
