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
import { getActionPartidoByIdAdmin, getActionPartidoPanelAdmin, getPartidoByIdAdmin } from '@/app/utils/actions';

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
  const [isLoading, setIsLoading] = useState(true)

  const getDataDelPatido = async(partidoId) =>{
    const partido = await getPartidoByIdAdmin(partidoId);
    console.log('partido', partido)
    const result = await getActionPartidoPanelAdmin();
    console.log('result', result)
  }

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    setPartidoId(idFromPath);
    getDataDelPatido(idFromPath)
  }, []);

  if(isLoading){
    return <></>
  }

  return (
    <section className="w-full">
      <h1 className="mb-6 text-left text-3xl font-bold">Partido Iniciado</h1>
      <Box className="mx-auto space-y-8 p-6">
        {/* Botones de acciones */}
        <div className="mt-4 flex justify-between">
          <Button colorScheme="green">Suspender Partido</Button>
          <Button colorScheme="gray">Finalizar Tiempo</Button>
          <Button colorScheme="green">Finalizar Partido</Button>
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
            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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

            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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
            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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
            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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
            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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
            <div className="flex items-center justify-center space-x-4">
              {/* Botones para equipo1 */}
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

              {/* Texto de la acción en el medio */}
              <span className="text-xl font-semibold">Acción 1</span>

              {/* Botones para equipo2 */}
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
    </section>
  );
};

export default PartidoScreen;
