import React from 'react';
export const CarrouselDeLecciones = ({ lecciones, onClick, otroColor }) => {
  if (lecciones.length === 0) {
    return <span className="text-2xl">No hay lecciones que mostrar</span>;
  }
  return (
    <div className="flex max-w-[80vw]  flex-row gap-3 overflow-x-scroll">
      {lecciones.map((leccion) => {
        return (
          <button
            key={leccion.id}
            className={`flex max-w-[300px] flex-col content-center items-center rounded-lg ${otroColor ? 'bg-green-500' : 'bg-cyan-600'}  p-4`}
            onClick={() => {
              onClick(leccion);
            }}
          >
            <span className="text-center text-2xl font-bold text-white">
              {leccion.nombre} -- {leccion.disciplina.nombre}
            </span>
            <div className="mt-3 flex flex-col text-center text-xl font-semibold text-white">
              <span>{leccion.dias.map((value) => `${value} `)}</span>
              <span>{leccion.horarios[0]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
