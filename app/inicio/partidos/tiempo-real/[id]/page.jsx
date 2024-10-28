'use client';
import {
  getActionPartidoByIdAdmin,
  getActionPartidoPanelAdmin,
  getPartidoByIdAdmin,
} from '@/app/utils/actions';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ENTRETIEMPO_CONST = 'Entretiempo';
const INICIADO = 'Iniciado';
const FINALIZADO = 'Finalizado';
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

const partidoTiempoReal = () => {
  const [partidoId, setPartidoId] = useState('');
  const [partidoData, setPartidoData] = useState({});
  const [accionesDePartido, setAccionesDePartido] = useState([]);

  const [estadoDelPartido, setEstadoDelPartido] = useState({});
  const [timeDifference, setTimeDifference] = useState(0);
  const router = useRouter();
  const getDataDelPatido = async (partidoId) => {
    const partido = await getPartidoByIdAdmin(partidoId);
    const listaAccionPartido = await getActionPartidoByIdAdmin(partidoId);
    const accionesLocal = listaAccionPartido.filter(
      (accion) => !accion.fechaBaja,
    );
    setAccionesDePartido(accionesLocal);
    setEstadoDelPartido(
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado,
    );
    if (
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
        INICIADO &&
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
        ENTRETIEMPO_CONST &&
      partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
        FINALIZADO
    ) {
      toast.error('el partido es incorrecto');
      router.back();
      return;
    }
    setPartidoData(partido);
  };

  const buscarJugador = (nroJugador, esLocal) => {
    const jugador = partidoData?.[
      esLocal ? 'local' : 'visitante'
    ]?.equipo?.equipoUsuarios?.find(
      (jugador) => jugador.numCamiseta === nroJugador,
    );
    return `${jugador?.usuario?.apellido} ${jugador?.usuario?.nombre}`;
  };
  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    setPartidoId(idFromPath);
    getDataDelPatido(idFromPath);
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    // Obtener la hora actual y la hora objetivo
    const targetDate = new Date(
      partidoData?.historialEventoList?.[0]?.fechaInicio,
    );
    // Calcular la diferencia inicial
    const calculateDifference = () => {
      const now = new Date();
      const difference = Math.max(0, now - targetDate); // Evita diferencias negativas
      setTimeDifference(difference);
    };

    const intervalPartido = setInterval(() => {
      getDataDelPatido(partidoData.id);
    }, 15000);

    // Actualizar cada segundo
    const interval = setInterval(() => {
      calculateDifference();
    }, 1000);

    // Limpiar intervalo al desmontar el componente
    return () => {
      clearInterval(interval);
      clearInterval(intervalPartido);
    };
  }, [partidoData]);

  return (
    <section className="w-full">
      <section className="flex w-full flex-row justify-between gap-2">
        <div>
          {estadoDelPartido !== FINALIZADO && (
            <div className="mb-4 text-3xl font-bold text-red-600">
              <span role="img" aria-label="live">
                📡
              </span>{' '}
              EN VIVO
            </div>
          )}
          <span className="text-xl font-semibold">{partidoData?.titulo}</span>
        </div>
        <div className="mb-4 flex flex-col items-center gap-1 text-xl font-bold">
          <span>Disciplina: {partidoData?.disciplina?.nombre}</span>
          <span>Categoria: {partidoData?.categoria?.nombre}</span>
        </div>
      </section>
      <section className="flex w-full flex-row justify-center">
        <div className="mb-4 mt-4 flex flex-col items-center text-2xl font-bold">
          {estadoDelPartido === ENTRETIEMPO_CONST ? (
            <span>Entre Tiempo</span>
          ) : (
            <span>{periodos[partidoData?.periodo]} Tiempo</span>
          )}
          <span>{formatTime(timeDifference)}</span>
        </div>
      </section>
      <section className="mt-4 flex w-full flex-row justify-around gap-4">
        <div className="mb-4 max-w-[80px] text-center  text-xl font-bold md:max-w-none md:text-3xl">
          <span>{partidoData?.local?.equipo?.nombre}</span>
        </div>
        <div className="mb-4 text-2xl font-bold  md:max-w-none md:text-5xl">
          <span>
            {partidoData?.resultadoLocal} - {partidoData?.resultadoVisitante}{' '}
          </span>
        </div>
        <div className="mb-4 max-w-[80px] break-words  text-center text-xl font-bold md:max-w-none md:text-3xl">
          <span>{partidoData?.visitante?.equipo?.nombre}</span>
        </div>
      </section>
      <div className="mt-5 w-full overflow-x-auto">
        <div className="min-w-[200px] md:w-full">
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab>Detalles</Tab>
              <Tab>Destacados</Tab>
              <Tab>Alineaciones</Tab>
              <Tab>Información</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="my-4 flex w-full flex-col items-center justify-center gap-6">
                  {accionesDePartido.length > 0 ? (
                    <>
                      {accionesDePartido.map((accion) => {
                        return (
                          <div
                            key={accion.id}
                            className="flex w-full items-center"
                          >
                            {/* Acción a la izquierda */}
                            <div className="flex flex-1 justify-end text-center text-xl md:text-2xl">
                              {accion.equipoLocal && (
                                <span className="break-words">
                                  {accion.descripcion} -{' '}
                                  {buscarJugador(accion.nroJugador, true)}
                                </span>
                              )}
                            </div>

                            {/* Línea y tiempo */}
                            <div className="flex flex-1 items-center justify-center">
                              <Tag
                                size="lg"
                                variant="subtle"
                                colorScheme="cyan"
                              >
                                {accion.minuto}
                              </Tag>
                            </div>

                            {/* Acción a la derecha */}
                            <div className="flex flex-1 justify-start text-center text-xl md:text-2xl">
                              {!accion.equipoLocal && (
                                <span className="break-words">
                                  {accion.descripcion} -{' '}
                                  {buscarJugador(accion.nroJugador, false)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>Sin detalles por el momento!</p>
                  )}
                </div>
              </TabPanel>

              <TabPanel>
                <div className="my-4 flex w-full flex-col items-center justify-center gap-6">
                  {accionesDePartido.length > 0 ? (
                    <>
                      {accionesDePartido
                        .filter(
                          (accion) =>
                            accion.descripcion.includes('Tarjeta') ||
                            accion.descripcion.includes('Gol'),
                        )
                        .map((accion) => {
                          return (
                            <div
                              key={accion.id}
                              className="flex w-full items-center"
                            >
                              {/* Acción a la izquierda */}
                              <div className="flex flex-1 justify-end text-center text-xl md:text-2xl">
                                {accion.equipoLocal && (
                                  <span className="break-words">
                                    {accion.descripcion} -{' '}
                                    {buscarJugador(accion.nroJugador, true)}
                                  </span>
                                )}
                              </div>

                              {/* Línea y tiempo */}
                              <div className="flex flex-1 items-center justify-center">
                                <Tag
                                  size="lg"
                                  variant="subtle"
                                  colorScheme="cyan"
                                >
                                  {accion.minuto}
                                </Tag>
                              </div>

                              {/* Acción a la derecha */}
                              <div className="flex flex-1 justify-start text-center text-xl md:text-2xl">
                                {!accion.equipoLocal && (
                                  <span className="break-words">
                                    {accion.descripcion} -{' '}
                                    {buscarJugador(accion.nroJugador, false)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    <p>Sin detalles por el momento!</p>
                  )}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex flex-wrap justify-center gap-10">
                  {/* Lista 1 */}
                  <div className="md:w-[40%]">
                    <div className="mb-4 text-xl font-bold md:text-3xl">
                      <span>{partidoData?.local?.equipo?.nombre}</span>
                    </div>
                    <ul className=" rounded-lg bg-gray-100 p-4 shadow-md">
                      {partidoData?.local?.equipo?.equipoUsuarios?.map(
                        (jugador, index) => (
                          <li key={index} className="py-1 text-xl">
                            <span className="flex items-center">
                              {/* Número de camiseta con borde circular */}
                              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-center">
                                {jugador.numCamiseta}
                              </span>
                              {/* Información del jugador */}
                              <span>
                                {jugador.puesto} - {jugador.usuario.apellido}{' '}
                                {jugador.usuario.nombre}
                              </span>
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Lista 2 */}
                  <div className="md:w-[40%]">
                    <div className="mb-4 text-xl font-bold md:text-3xl">
                      <span>{partidoData?.visitante?.equipo?.nombre}</span>
                    </div>
                    <ul className=" rounded-lg bg-gray-100 p-4 shadow-md">
                      {partidoData?.visitante?.equipo?.equipoUsuarios?.map(
                        (jugador, index) => (
                          <li key={index} className="py-1 text-xl">
                            <span className="flex items-center">
                              {/* Número de camiseta con borde circular */}
                              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-center">
                                {jugador.numCamiseta}
                              </span>
                              {/* Información del jugador */}
                              <span>
                                {jugador.puesto} - {jugador.usuario.apellido}{' '}
                                {jugador.usuario.nombre}
                              </span>
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex flex-col items-center gap-5">
                  <img
                    src={`data:image/png;base64,${partidoData?.banner}`}
                    alt="banner"
                    className="h-auto max-w-[500px]"
                  />
                  <div>
                    <div className="text-3xl font-bold">Instalacion</div>
                    <div>{partidoData?.instalacion?.nombre}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      Link a la transmicion en vivo
                    </div>
                    <a
                      href={partidoData?.linkStream}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver Stream
                    </a>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default partidoTiempoReal;
