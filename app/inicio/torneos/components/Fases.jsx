import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { getEquipoByDisciplinaYCategoria } from '@/app/utils/actions';
import React, { useEffect, useState } from 'react';

export const Fases = ({
  cantidadDeFases,
  categoria,
  disciplina,
  onChangeFase,
  equiposDefault = null,
}) => {
  const [fases, setFases] = useState([]);
  console.log('fases', fases);
  const [equipos, setEquipos] = useState([]);

  const getEquipos = async () => {
    const result = await getEquipoByDisciplinaYCategoria(
      disciplina.value,
      categoria.value,
    );
    setEquipos(result.map((eqa) => ({ value: eqa.id, label: eqa.nombre })));
  };

  function generarLlaveDeTorneo(fases, equipos) {
    const fasesTorneo = [];
    let partidosPorFase = Math.pow(2, fases - 1); // Empieza con 2^(fases-1) partidos en la primera fase
    let equipoIndex = 0;

    const fase = {
      id: 1,
      nombre: `Fase ${1}`,
      fecha: '',
      partidos: {},
    };

    // Crear los partidos de la fase actual
    for (let j = 0; j < partidosPorFase; j++) {
      fase.partidos[j] = {
        equipoLocal: equipos?.[equipoIndex] || '',
        equipoVisitante: equipos?.[equipoIndex + 1] || '',
      };
      equipoIndex += 2;
    }

    fasesTorneo.push(fase);
    partidosPorFase /= 2; // Reducir los partidos para la siguiente fase

    setFases(fasesTorneo);
    onChangeFase(fasesTorneo);
  }

  useEffect(() => {
    if (cantidadDeFases) {
      generarLlaveDeTorneo(cantidadDeFases, equiposDefault);
    }
  }, [cantidadDeFases]);

  useEffect(() => {
    if (disciplina?.value && categoria?.value && cantidadDeFases) getEquipos();
  }, [categoria, disciplina, cantidadDeFases]);
  return (
    <div className=" h-[100vh] w-full">
      {fases.length > 0 &&
        fases.map((fase, i) => {
          return (
            <div key={i} className=" w-full">
              <span className="mt-3 w-full text-xl font-semibold">
                Fase {i + 1}: Por favor seleccione los equipos
              </span>
              {
                <div>
                  {Object.entries(fase.partidos).map(([id, partido]) => {
                    return (
                      <div
                        key={id}
                        className="my-3 flex w-full flex-row items-end"
                      >
                        <div className="flex w-full flex-row items-center justify-around">
                          <div className="min-w-[200px]">
                            <SelectWithLabel
                              name="cantidadDeEquipos"
                              options={equipos}
                              value={partido.equipoLocal}
                              onChange={(equipo) => {
                                const newFases = JSON.parse(
                                  JSON.stringify(fases),
                                );
                                newFases[i].partidos[id]['equipoLocal'] =
                                  equipo;
                                onChangeFase(newFases);
                                setFases(newFases);
                              }}
                              label="Equipo Local"
                            />
                          </div>
                          <span>VS</span>
                          <div className="min-w-[200px]">
                            <SelectWithLabel
                              name="cantidadDeEquipos"
                              options={equipos}
                              label="Equipo Visitante"
                              value={partido.equipoVisitante}
                              onChange={(equipo) => {
                                const newFases = JSON.parse(
                                  JSON.stringify(fases),
                                );
                                newFases[i].partidos[id]['equipoVisitante'] =
                                  equipo;
                                onChangeFase(newFases);
                                setFases(newFases);
                              }}
                            />
                          </div>
                        </div>
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
