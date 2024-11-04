import { Tooltip } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const CardTorneo = ({ torneo, onEdit, onDelete, disabled }) => {
  console.log('torneo', torneo);
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-blue-300 p-2">
      <div className="flex items-center">
        {!disabled && (
          <div className="w-1/10 p-2">
            <div className="flex flex-col gap-4">
              <Tooltip label="Editar">
                <PencilIcon
                  className={`w-[30px] cursor-pointer text-slate-500`}
                  onClick={() => {
                    onEdit(torneo);
                  }}
                />
              </Tooltip>
              <Tooltip label="Eliminar">
                <TrashIcon
                  className={`w-[30px] cursor-pointer text-slate-500`}
                  onClick={() => {
                    onDelete(torneo);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        )}

        {/* Columna 2 - 45% */}
        <div className="w-9/20 p-2 ">
          <p className="text-2xl font-bold text-white">{torneo?.nombre}</p>
          <p className="font-semibold text-white">
            Categoria: {torneo?.categoria?.nombre}
          </p>
          <p className="font-semibold text-white">
            Disciplina: {torneo?.disciplina?.nombre}
          </p>
        </div>

        {/* Columna 3 - 45% */}
        <div className="w-9/20 p-4">
          <img
            src={`data:image/png;base64,${torneo?.banner}`}
            alt="banner"
            className="h-auto max-w-[130px] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
