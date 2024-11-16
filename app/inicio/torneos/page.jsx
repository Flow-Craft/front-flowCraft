'use client';

import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { eliminarTorneoAdmin, getTorneosAdmin } from '@/app/utils/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CardTorneo } from './components/CardTorneo';

export default function Page() {
  const [modalEliminarEvento, setModalEliminarEvento] = useState(false);
  const [torneosAbiertos, setTorneosAbiertos] = useState([]);
  const [torneosCompletos, setTorneosCompletos] = useState([]);
  const [torneosEnCurso, setTorneosEnCurso] = useState([]);
  const [torneosFinalizados, setTorneosFinalizados] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState({});
  const router = useRouter();

  const getTorneos = async () => {
    try {
      const result = await getTorneosAdmin();
      setTorneosAbiertos(
        result.filter((torneo) => torneo.torneoEstado === 'Abierto'),
      );
      setTorneosEnCurso(
        result.filter((torneo) => torneo.torneoEstado === 'EnCurso'),
      );
      setTorneosFinalizados(
        result.filter((torneo) => torneo.torneoEstado === 'Finalizado'),
      );
      setTorneosCompletos(
        result.filter((torneo) => torneo.torneoEstado === 'Completado'),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onEditTorneo = (torneo) => {
    router.push(`/inicio/torneos/editar/${torneo.id}`);
  };

  const onDeleteTorneo = (torneo) => {
    setTorneoSeleccionado(torneo);
    setModalEliminarEvento(true);
  };

  const eliminarTorneo = async () => {
    try {
      await eliminarTorneoAdmin(torneoSeleccionado.id);
      toast.success('torneo eliminado correctamente');
      setModalEliminarEvento(false);
      setTorneoSeleccionado({});
      getTorneos();
    } catch (error) {
      toast.error(error.title);
    }
  };

  useEffect(() => {
    getTorneos();
  }, []);

  return (
    <section>
      <Toaster />
      <section className="flex w-full flex-row justify-between">
        <div className="mt-3 self-start text-3xl font-bold">Torneos</div>
        <button
          className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            router.push('/inicio/torneos/crear');
          }}
        >
          Crear Torneos
        </button>
      </section>

      <div className="mt-6 grid w-full grid-rows-4 gap-4">
        <div>
          <span className="ml-6 text-2xl font-bold">Abiertos</span>
          <section className="mx-6 flex max-w-[80vw] flex-row gap-2 overflow-x-auto pt-6">
            {torneosAbiertos.length > 0 ? (
              torneosAbiertos.map((torneo) => (
                <CardTorneo
                  key={torneo.id}
                  torneo={torneo}
                  onEdit={onEditTorneo}
                  onDelete={onDeleteTorneo}
                />
              ))
            ) : (
              <span className="ml-6 text-xl font-semibold">
                Nada que mostrar
              </span>
            )}
          </section>
        </div>
        <div>
          <span className="ml-6 text-2xl font-bold">Completos</span>
          <section className="ml-6 flex max-w-[90vw] flex-row gap-2 overflow-x-auto pt-6">
            {torneosCompletos.length > 0 ? (
              torneosEnCurso.map((torneo) => {
                return (
                  <CardTorneo
                    key={torneo.id}
                    torneo={torneo}
                    onEdit={onEditTorneo}
                    onDelete={onDeleteTorneo}
                    disabledEditar
                  />
                );
              })
            ) : (
              <span className="ml-6 text-xl font-semibold">
                {' '}
                Nada que mostrar
              </span>
            )}
          </section>
        </div>
        <div>
          <span className="ml-6 text-2xl font-bold">En Curso</span>
          <section className="ml-6 flex max-w-[80vw] flex-row gap-2 overflow-x-auto pt-6">
            {torneosEnCurso.length > 0 ? (
              torneosEnCurso.map((torneo) => {
                return (
                  <CardTorneo
                    key={torneo.id}
                    torneo={torneo}
                    onEdit={onEditTorneo}
                    onDelete={onDeleteTorneo}
                    disabledEditar
                  />
                );
              })
            ) : (
              <span className="ml-6 text-xl font-semibold">
                {' '}
                Nada que mostrar
              </span>
            )}
          </section>
        </div>
        <div>
          <span className="ml-6 text-2xl font-bold"> Finalizados</span>
          <section className="ml-6 flex max-h-[80vw] flex-row gap-4 overflow-x-auto pt-6">
            {torneosFinalizados.length > 0 ? (
              torneosFinalizados.map((torneo) => {
                return (
                  <CardTorneo
                    key={torneo.id}
                    torneo={torneo}
                    onEdit={onEditTorneo}
                    onDelete={onDeleteTorneo}
                    disabledEditar
                  />
                );
              })
            ) : (
              <span className="ml-6 text-xl font-semibold">
                {' '}
                Nada que mostrar
              </span>
            )}
          </section>
        </div>
      </div>
      <FlowModal
        title={`Seguro que desea eliminar el torneo:${torneoSeleccionado.nombre}`}
        modalBody={<></>}
        primaryTextButton={'Si'}
        isOpen={modalEliminarEvento}
        scrollBehavior="outside"
        onAcceptModal={() => {
          eliminarTorneo();
        }}
        onCancelModal={() => {
          setTorneoSeleccionado({});
          setModalEliminarEvento(false);
        }}
      />
    </section>
  );
}
