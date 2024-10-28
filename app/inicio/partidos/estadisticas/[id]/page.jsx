import React from 'react';
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
          {jugadores.map((jugador) => {
            return (
              <>
                <button
                  className="mt-5 w-[80%] rounded-lg bg-blue-300 p-2 text-lg font-semibold text-white"
                  key={jugador.id}
                >
                  {jugador.value}
                </button>
              </>
            );
          })}
        </div>
        <div class="h-[80vh] flex-1 bg-gray-200 p-4">
          Contenido de la columna derecha
        </div>
      </section>
    </section>
  );
};
export default page;
