import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import React, { useEffect, useState } from 'react';

export const Fases = ({ cantidadDeFases }) => {
  const [fases, setFases] = useState([]);
  console.log('fases', fases);
  function generarLlaveDeTorneo(fases) {
    const fasesTorneo = [];
    let partidosPorFase = Math.pow(2, fases - 1); // Empieza con 2^(fases-1) partidos en la primera fase

    for (let i = 1; i <= fases; i++) {
      const fase = {
        id: i,
        nombre: `Fase ${i}`,
        fecha: '',
        partidos: {},
      };

      // Crear los partidos de la fase actual
      for (let j = 0; j < partidosPorFase; j++) {
        fase.partidos[j] =
          i === 1
            ? { equipoLocal: '', equipoVisitante: '', fecha: '' }
            : { fecha: '' };
      }

      fasesTorneo.push(fase);
      partidosPorFase /= 2; // Reducir los partidos para la siguiente fase
    }

    setFases(fasesTorneo);
  }

  useEffect(() => {
    generarLlaveDeTorneo(cantidadDeFases);
  }, [cantidadDeFases]);

  return (
    <div className=" w-full">
      {fases.map((fase, i) => {
        return (
          <div key={i} className=" w-full">
            <span className="mt-3 w-full text-xl font-semibold">
              Fase {i + 1}
            </span>
            {
              <div>
                {Object.entries(fase.partidos).map(([id, partido]) => {
                  return (
                    <div
                      key={id}
                      className="my-3 flex w-full flex-row items-end"
                    >
                      {i !== 0 && (
                        <div className="ml-4">
                          <InputWithLabel
                            label={`Fecha y hora del partido ${Number(id) + 1}`}
                            value={partido.fecha}
                            onChange={(e) => {
                              partido.fecha = e.target.value;
                            }}
                            name="FechaInicio"
                            type="datetime-local"
                          />
                        </div>
                      )}
                      {i === 0 && (
                        <div className="flex w-full flex-row items-center justify-around">
                          <div className="min-w-[200px]">
                            <SelectWithLabel
                              name="cantidadDeEquipos"
                              options={[]}
                              label="Equipo Local"
                            />
                          </div>
                          <span>VS</span>
                          <div className="min-w-[200px]">
                            <SelectWithLabel
                              name="cantidadDeEquipos"
                              options={[]}
                              label="Equipo Visitante"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            }
          </div>
        );
      })}
    </div>
  );
};
