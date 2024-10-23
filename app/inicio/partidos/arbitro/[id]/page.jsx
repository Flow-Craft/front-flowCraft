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
} from '@/app/utils/actions';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { ModalOverlay } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const [accionPartido, setAccionPartido] = useState([]);
  const [modalFinalizarPartido, setModalFinalizarPartido] = useState(false);
  const [confirmacionFinalizacionPartido, setConfirmacionFinalizacionPartido] =
    useState(false);
  const [modalSuspenderPartido, setModalSuspenderPartido] = useState(false);
  const [timeDifference, setTimeDifference] = useState(0);
  const router = useRouter();

  const getDataDelPatido = async (partidoId) => {
    const partido = await getPartidoByIdAdmin(partidoId);
    console.log('partido', partido);
    setPartidoData(partido);
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

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    setPartidoId(idFromPath);
    getDataDelPatido(idFromPath);
  }, []);

  if (isLoading) {
    return <></>;
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
          <Button colorScheme="gray">Finalizar Tiempo</Button>
          <Button
            colorScheme="green"
            onClick={() => {
              setModalFinalizarPartido(true);
            }}
          >
            Finalizar Partido
          </Button>
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold">Primer tiempo</h1>

        {/* Marcador de los equipos */}
        <div className="mb-8 grid grid-cols-3 items-center gap-8">
          <div className="text-center">
            <p className="text-xl font-semibold">Equipo Local</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                onClick={() =>
                  setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                }
              >
                +
              </Button>
              <Button
                onClick={() =>
                  setPartido({ ...partido, equipo1: partido.equipo1 - 1 })
                }
              >
                -
              </Button>
            </div>
          </div>

          <div className="text-center text-5xl font-bold">
            {partido.equipo1} - {partido.equipo2}
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold">Equipo Visitante</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                onClick={() =>
                  setPartido({ ...partido, equipo2: partido.equipo2 + 1 })
                }
              >
                +
              </Button>
              <Button
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
                <Tab>Cambios</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* Mostrar goles del equipo local */}
                  {partido.golesEquipo1.length > 0 ? (
                    partido.golesEquipo1.map((gol) => (
                      <p key={gol.id}>{gol.jugador}</p>
                    ))
                  ) : (
                    <p>No hay goles registrados</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {/* Mostrar faltas del equipo local */}
                  {partido.faltasEquipo1.length > 0 ? (
                    partido.faltasEquipo1.map((falta) => (
                      <p key={falta.id}>{falta.jugador}</p>
                    ))
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {/* Mostrar cambios del equipo local */}
                  {partido.cambiosEquipo1.length > 0 ? (
                    partido.cambiosEquipo1.map((cambio) => (
                      <p key={cambio.id}>
                        {cambio.entrada} &lt;&gt; {cambio.salida}
                      </p>
                    ))
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
              if (accion.nombreTipoAccion.includes('Cambio Jugador')) {
                return <></>;
              }
              return (
                <div
                  className="flex items-center justify-center space-x-4"
                  key={accion.id}
                >
                  <Button
                    onClick={() =>
                      setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                    }
                  >
                    +
                  </Button>
                  {!accion.secuencial && (
                    <Button
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      /
                    </Button>
                  )}
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
                  {!accion.secuencial && (
                    <Button
                      onClick={() =>
                        setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                      }
                    >
                      /
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      setPartido({ ...partido, equipo1: partido.equipo1 + 1 })
                    }
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
                <Tab>Cambios</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* Mostrar goles del equipo visitante */}
                  {partido.golesEquipo2.length > 0 ? (
                    partido.golesEquipo2.map((gol) => (
                      <p key={gol.id}>{gol.jugador}</p>
                    ))
                  ) : (
                    <p>No hay goles registrados</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {/* Mostrar faltas del equipo visitante */}
                  {partido.faltasEquipo2.length > 0 ? (
                    partido.faltasEquipo2.map((falta) => (
                      <p key={falta.id}>{falta.jugador}</p>
                    ))
                  ) : (
                    <p>No hay faltas registradas</p>
                  )}
                </TabPanel>

                <TabPanel>
                  {/* Mostrar cambios del equipo visitante */}
                  {partido.cambiosEquipo2.length > 0 ? (
                    partido.cambiosEquipo2.map((cambio) => (
                      <p key={cambio.id}>
                        {cambio.entrada} &lt;&gt; {cambio.salida}
                      </p>
                    ))
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
          {partido.tiempo}
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
      <Toaster />
    </section>
  );
};

export default PartidoScreen;
