'use client';
import {
  getEquiposByDisciplinaCategoriaYUsuario,
  getTorneoByUsuario,
  getTorneosAdmin,
  inscribirmeATorneoAdmin,
} from '@/app/utils/actions';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CardTorneo } from '../components/CardTorneo';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';

export default function Page() {
  const [torneosAbiertos, setTorneosAbiertos] = useState([]);
  const [openDetallesDelTorneo, setOpenDetallesDelTorneo] = useState(false);
  const [modalSeleccionarEquipo, setModalSeleccionarEquipo] = useState(false);
  const [darseDeBajaTorneo, setDarseDeBajaTorneo] = useState(false);
  const [equiposUsuario, setEquiposUsuario] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState({});
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({});
  const getTorneos = async () => {
    try {
      const result = await getTorneosAdmin();
      const resultUsuario = await getTorneoByUsuario();
      setTorneosAbiertos(
        result.filter((torneo) => torneo.torneoEstado === 'Abierto'),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSeleccionarTorneo = async (torneo) => {
    setOpenDetallesDelTorneo(true);
    setTorneoSeleccionado(torneo);
    const result = await getEquiposByDisciplinaCategoriaYUsuario(
      torneo.categoria.id,
      torneo.disciplina.id,
    );
    setEquiposUsuario(result);
  };

  const handleInscribirseAunTorneo = async () => {
    try {
      setModalSeleccionarEquipo(true);
    } catch (error) {
      toast.error(error.title);
    }
  };

  const handleInscribirmeAUnTorneo = async () => {
    try {
      await inscribirmeATorneoAdmin(
        equipoSeleccionado.value,
        torneoSeleccionado.id,
      );
      toast.success('te inscribiste con exito');
      setModalSeleccionarEquipo(false);
      setEquipoSeleccionado({});
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
        >
          Equipos
        </button>
      </section>
      <div className="mt-6 grid h-[80vh] w-full grid-rows-2 gap-4">
        <div>
          <span className="ml-6 text-2xl font-bold">Mis Torneos</span>
        </div>
        <div>
          <span className="ml-6 text-2xl font-bold">Torneos Abiertos</span>
          <section className="ml-6 flex max-w-[80vw] flex-row gap-2 overflow-x-auto pt-6">
            {torneosAbiertos.length > 0 ? (
              torneosAbiertos.map((torneo) => (
                <>
                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      handleSeleccionarTorneo(torneo, false);
                    }}
                    disabled={torneo.lleno}
                  >
                    <CardTorneo key={torneo.id} torneo={torneo} disabled />
                  </button>
                </>
              ))
            ) : (
              <span className="ml-6 text-xl font-semibold">
                Nada que mostrar
              </span>
            )}
          </section>
        </div>
      </div>
      <FlowModal
        title={'Detalles del torneo'}
        sx={{ minWidth: '900px' }}
        modalBody={
          <div className="mt-6 grid w-full grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-4">
              <span className="text-2xl">
                Nombre:{' '}
                <span className="font-semibold">
                  {torneoSeleccionado?.nombre}
                </span>
              </span>
              <span className="text-2xl">
                Disciplina:
                <span className="font-semibold">
                  {torneoSeleccionado?.disciplina?.nombre}
                </span>
              </span>
              <span className="text-2xl">
                Cantidad de Equipos:{' '}
                <span className="font-semibold">
                  {torneoSeleccionado?.cantEquipos}
                </span>
              </span>
              <span className="text-2xl">
                Fecha de inicio:{' '}
                <span className="font-semibold">
                  {new Date(torneoSeleccionado?.fechaInicio).toLocaleDateString(
                    'es-ES',
                  )}
                </span>
              </span>
              <span className="text-2xl">
                Descripcion:
                <span className="font-semibold">
                  {' '}
                  {torneoSeleccionado?.descripcion}
                </span>
              </span>
            </div>
            <div>
              <img
                src={`data:${torneoSeleccionado?.imageType};base64,${torneoSeleccionado?.banner}`}
                alt="Torneo Banner"
                className="h-auto w-full max-w-lg"
              />
            </div>
          </div>
        }
        primaryTextButton={'Inscribirse'}
        isOpen={openDetallesDelTorneo}
        onAcceptModal={() => {
          handleInscribirseAunTorneo();
          setOpenDetallesDelTorneo(false);
        }}
        onCancelModal={() => {
          setOpenDetallesDelTorneo(false);
          setTorneoSeleccionado({});
        }}
      />
      <FlowModal
        title={'Desincribirse a un torneo'}
        modalBody={
          <span className="text-2xl">
            Nombre:{' '}
            <span className="font-semibold">{torneoSeleccionado?.nombre}</span>
          </span>
        }
        primaryTextButton={'Aceptar'}
        isOpen={darseDeBajaTorneo}
        onAcceptModal={() => {}}
        onCancelModal={() => {
          setDarseDeBajaTorneo(false);
          setTorneoSeleccionado({});
        }}
      />
      <FlowModal
        title={'Inscribirse a un torneo.'}
        modalBody={
          <SeleccionarEquipo
            equipos={equiposUsuario}
            onChange={setEquipoSeleccionado}
          />
        }
        primaryTextButton={'Confirmar Equipo'}
        disabled={!equipoSeleccionado.value}
        isOpen={modalSeleccionarEquipo}
        onAcceptModal={() => {
          handleInscribirmeAUnTorneo();
        }}
        onCancelModal={() => {
          setModalSeleccionarEquipo(false);
          setEquipoSeleccionado({});
          setTorneoSeleccionado({});
        }}
      />
    </section>
  );
}

const SeleccionarEquipo = ({ equipos, onChange }) => {
  return (
    <div className="min-h-[200px] min-w-[170px]">
      <SelectWithLabel
        name="filtro"
        label="seleccione un equipo"
        options={equipos.map((q) => ({ label: q.nombre, value: q.id }))}
        onChange={(e) => {
          onChange(e);
        }}
      />
    </div>
  );
};
