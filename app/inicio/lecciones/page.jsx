'use client';

import withAuthorization from '@/app/utils/autorization';
import { useRouter } from 'next/navigation';
import { CarrouselDeLecciones } from './gestionar-lecciones/components/CarrouselDeLecciones/CarrouselDeLecciones';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  desinscribirseALeccion,
  getInscricionesDelUsuario,
  getLeccionesActivasAdmin,
  inscribirseALeccion,
} from '@/app/utils/actions';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import usePermisos from '@/app/utils/permisos';
function Page() {
  const [leccionesActivas, setLeccionesActivas] = useState([]);
  const [leccionDisponible, setLeccionDisponible] = useState({});
  const [leccionesDelUsuario, setLeccionesDelUsuario] = useState([]);
  const [esInscripcion, setEsInscripcion] = useState(false);
  const [openModalDetallesLeccion, setOpenModalDetallesLeccion] =
    useState(false);
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Lecciones');
  console.log('permisos', permisos);
  const router = useRouter();
  const getLeccionesActivas = async () => {
    try {
      // Llamadas en paralelo para optimizar el tiempo de espera
      const [leccionesActivasAdmin, inscripcionesUsuario] = await Promise.all([
        getLeccionesActivasAdmin(),
        getInscricionesDelUsuario(),
      ]);

      // Filtramos las inscripciones activas del usuario
      const inscripcionesActivasUsuario = inscripcionesUsuario.filter(
        (inscripcion) => inscripcion.fechaBaja === null,
      );

      // Obtenemos las lecciones del usuario basado en las inscripciones activas
      const leccionesDelUsuario = leccionesActivasAdmin.filter((leccion) =>
        inscripcionesActivasUsuario.some(
          (inscripcion) => inscripcion.leccion.id === leccion.id,
        ),
      );

      // Filtramos las lecciones activas excluyendo las ya inscritas por el usuario
      const leccionesActivas = leccionesActivasAdmin.filter(
        (leccion) =>
          !inscripcionesActivasUsuario.some(
            (inscripcion) => inscripcion.leccion.id === leccion.id,
          ),
      );

      // Establecemos los estados
      setLeccionesDelUsuario(leccionesDelUsuario);
      setLeccionesActivas(leccionesActivas);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCerrarOFinalizarInscripcion = () => {
    setLeccionDisponible({});
    setEsInscripcion(false);
    setOpenModalDetallesLeccion(false);
  };

  const handleAceptModal = async () => {
    try {
      if (esInscripcion) {
        await inscribirseALeccion({
          IdLeccion: leccionDisponible.id,
        });
      } else {
        await desinscribirseALeccion({
          IdLeccion: leccionDisponible.id,
        });
      }
      toast.success(
        esInscripcion ? 'Inscripcion exitosa' : 'Desinscripcion exitosa',
      );
      handleCerrarOFinalizarInscripcion();
      getLeccionesActivas();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleLeccionesDisponibles = (leccionDisponible) => {
    setLeccionDisponible(leccionDisponible);
    setEsInscripcion(true);
    setOpenModalDetallesLeccion(true);
  };

  const handleDesinscribirmeAleccion = (leccionDisponible) => {
    setLeccionDisponible(leccionDisponible);
    setEsInscripcion(false);
    setOpenModalDetallesLeccion(true);
  };

  useEffect(() => {
    getLeccionesActivas();
  }, []);

  return (
    <section>
      <Toaster />
      <div className="w-100 flex flex-row items-center justify-between">
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Lecciones
        </div>
        {permisos.some(
          (perm) => perm.funcionalidades === 'Gestionar lección',
        ) && (
          <button
            className="h-[50px] rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            onClick={() => {
              router.push('/inicio/lecciones/gestionar-lecciones');
            }}
          >
            Gestionar Lecciones
          </button>
        )}
      </div>
      <section className="grid h-full w-full grid-rows-3 gap-4">
        <div>
          <div className="mt-6 self-start px-9 pb-9 text-2xl font-bold">
            Mis Lecciones
          </div>
          <section>
            <CarrouselDeLecciones
              lecciones={leccionesDelUsuario}
              onClick={handleDesinscribirmeAleccion}
              otroColor={true}
            />
          </section>
        </div>
        <div>
          <div className="mt-6 self-start px-9 pb-9 text-2xl font-bold">
            Lecciones disponibles
          </div>
          <section>
            <CarrouselDeLecciones
              lecciones={leccionesActivas}
              onClick={handleLeccionesDisponibles}
            />
          </section>
        </div>
      </section>
      <FlowModal
        title={`Detalles de la leccion`}
        modalBody={
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex justify-center">
              <span className="text-3xl font-bold">Disciplina</span>
            </div>
            <div className="flex justify-center">
              <span className="text-2xl">
                {leccionDisponible?.disciplina?.nombre}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-3xl font-bold">Categoría</span>
            </div>
            <div className="flex justify-center">
              <span className="text-2xl">
                {leccionDisponible?.categoria?.nombre}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-3xl font-bold">Días</span>
            </div>
            <div className="flex justify-center">
              <span className="text-center text-2xl">
                {leccionDisponible?.dias?.map((dia) => ` ${dia} `)}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-center text-3xl font-bold">Horario</span>
            </div>
            <div className="flex justify-center">
              <span className="text-2xl">
                {leccionDisponible?.horarios?.[0]}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-3xl font-bold">Nombre</span>
            </div>
            <div className="flex justify-center">
              <span className="text-2xl">{leccionDisponible?.nombre}</span>
            </div>
          </div>
        }
        isOpen={openModalDetallesLeccion}
        scrollBehavior="outside"
        primaryTextButton={esInscripcion ? 'Inscribirse' : 'Desinscribirse'}
        onAcceptModal={() => {
          handleAceptModal();
        }}
        onCancelModal={() => {
          handleCerrarOFinalizarInscripcion();
        }}
      />
    </section>
  );
}

export default withAuthorization(Page, 'Lecciones');
