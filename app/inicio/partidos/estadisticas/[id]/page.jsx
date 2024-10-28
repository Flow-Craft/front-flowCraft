'use client';
import { getActionPartidoPanelAdmin, getPartidoByIdAdmin } from '@/app/utils/actions';
import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
const jugadores = [
  { id: 1, value: '1 - Juan Pérez' },
  { id: 2, value: '2 - Pepe Argento' },
  { id: 3, value: '3 - Laura Gómez' },
  { id: 4, value: '4 - Carlos López' },
  { id: 5, value: '5 - Ana Martínez' },
  { id: 6, value: '6 - José Fernández' },
  { id: 7, value: '7 - Lucía Ramírez' },
  { id: 8, value: '8 - Pablo García' },
  { id: 9, value: '9 - Mario Ríos' },
  { id: 10, value: '10 - Carmen Herrera' },
  { id: 11, value: '11 - Andrés Sánchez' },
  { id: 12, value: '12 - Sofía Torres' },
  { id: 13, value: '13 - Diego Morales' },
  { id: 14, value: '14 - Paula Ortiz' },
  { id: 15, value: '15 - Fernando Vega' },
  { id: 16, value: '16 - Isabel Navarro' },
  { id: 17, value: '17 - Javier Castro' },
  { id: 18, value: '18 - Marta Rubio' },
  { id: 19, value: '19 - Luis Soto' },
  { id: 20, value: '20 - Rosa Delgado' },
];

const page = () => {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [partido, setPartido] = useState({})
  const [listaDeAcciones, setListaDeAcciones] = useState([])
  const [jugadores, setJugadores] = useState([])

  const getDataDelPatido = async (partidoId) => {
    const partido = await getPartidoByIdAdmin(partidoId);
    console.log('partido', partido)
    const equipoLocal = partido?.local?.equipo?.equipoUsuarios
    const equipoVisitante = partido?.visitante?.equipo?.equipoUsuarios
    const listaDeUsuarios = [...equipoLocal, ...equipoVisitante]
    setJugadores(listaDeUsuarios)
    setPartido(partido)
  };

  const getAccionesParaEseUsuario = async(dniUsuario) =>{

  }

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    getDataDelPatido(idFromPath);
  }, []);
  

  return (
    <section className="w-full">
      <section className="flex flex-1 flex-row justify-between">
        <span className="text-3xl font-bold">Estadisticas de partido</span>
        <div className="flex flex-row gap-10 text-2xl font-semibold">
          <span>Disciplinas: Futbol</span>
          <span>Categoria: Sub18</span>
        </div>
      </section>
      <section class="mt-8 flex w-full">
        <div className="overflow h-[80vh] w-full max-w-[30%] flex-col gap-5 overflow-y-auto">
          {jugadores && jugadores.map((jugador) => {
            return (
              <>
                <button
                  className={`mt-5 w-[80%] rounded-lg bg-blue-300 ${jugador.usuario.dni === jugadorSeleccionado && 'bg-blue-600'} p-2 text-lg font-semibold text-white`}
                  key={jugador.id}
                  onClick={() => {
                    setJugadorSeleccionado(jugador.usuario.dni);
                    getAccionesParaEseUsuario(jugador.usuario.dni)
                  }}
                >
                  {`${jugador.numCamiseta} - ${jugador.usuario.apellido} ${jugador.usuario.nombre}`}
                </button>
              </>
            );
          })}
        </div>
        <div class="h-[80vh] flex-1 p-4">
          <div className="flex w-full flex-col items-center  gap-5">
            {listaDeAcciones && listaDeAcciones.map((accion)=>{
              return(
                <div key={accion.id} className="flex items-center justify-center space-x-4">
                  <span className="min-w-[200px] whitespace-normal break-words text-center  text-xl font-semibold">
                    {accion.nombreTipoAccion}
                  </span>
                  <span className="text-center  text-2xl font-bold">3</span>
                  <Button onClick={() => {}}>+</Button>
                  <Button onClick={() => {}}>-</Button>
                </div>
              )
            })}
            
          </div>
        </div>
      </section>
      <section className='w-full flex flex-row-reverse gap-4'>
      <Button colorScheme='blue' onClick={() => {}}>Finalizar</Button>
      </section>
    </section>
  );
};
export default page;
