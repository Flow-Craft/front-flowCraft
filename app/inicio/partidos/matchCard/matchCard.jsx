import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline'; // Importar el ícono de escudo

const MatchCard = ({ partido, handleGetMatchDetails }) => {
  const {
    equipoLocal,
    equipoVisitante,
    nombrePartido,
    fechaPartido,
    estadoPartido,
    totalEquipoLocal,
    totalEquipoVisitante,
  } = partido;
  const formattedDate = new Date(fechaPartido).toLocaleDateString();

  return (
    <div className="rounded-lg bg-sky-100 p-4 text-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Íconos de escudo para los equipos */}
          <div className="flex items-center">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
            <div className="mr-6 text-lg">{equipoLocal}</div>
            <span className="mx-2">VS</span>
            <ShieldCheckIcon className="ml-6 h-10 w-10 text-blue-600" />
            <div className="text-lg">{equipoVisitante}</div>
          </div>
        </div>
        <div className="text-sm">{formattedDate}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{nombrePartido}</h3>
        </div>
        <div className="text-right">
          <p className="text-lg">{estadoPartido}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-around text-center">
        <div>
          <h4 className="text-2xl font-bold">{totalEquipoLocal}</h4>
          <p>{equipoLocal}</p>
        </div>
        <div className="text-2xl">-</div>
        <div>
          <h4 className="text-2xl font-bold">{totalEquipoVisitante}</h4>
          <p>{equipoVisitante}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            handleGetMatchDetails(partido);
          }}
        >
          Ver detalles de partido
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
