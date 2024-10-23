'use client';
import {
  desinscribirseAEventoAdmin,
  getEventoByUsuarioByIdAdmin,
  inscribirseAEventoAdmin,
} from '@/app/utils/actions';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const EventoPage = () => {
  const [evento, setEvento] = useState({});
  const [inscripto, setInscripto] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const getEvent = async (id) => {
    try {
      const result = await getEventoByUsuarioByIdAdmin(id);
      console.log('result', result);
      setEvento(result.evento);
      setInscripto(result.inscripto);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inscribirseAEvento = async () => {
    try {
      await inscribirseAEventoAdmin(id);
      toast.success('inscripcion completa');
      getEvent(id);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const desinscribirseAEvento = async () => {
    try {
      await desinscribirseAEventoAdmin(id);
      toast.success('desinscripcion completa');
      getEvent(id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getEvent(id);
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      {/* Botón para regresar a /inicio/evento */}
      <div className="mb-4">
        <button
          onClick={() => router.push('/inicio/eventos')}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Volver a Inicio
        </button>
      </div>

      {/* Imagen del banner (si existe) */}
      {evento.banner && (
        <div className="mb-6 flex justify-center">
          <img
            src={`data:${evento?.imageType};base64,${evento?.banner}`}
            alt="Evento Banner"
            className="h-auto w-full max-w-lg"
          />
        </div>
      )}

      {/* Información del evento */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">{evento?.titulo}</h1>
        <p className="mb-4 text-gray-700">{evento?.descripcion}</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 className="font-semibold">Fecha de Inicio:</h2>
            <p>{new Date(evento?.fechaInicio).toLocaleString()}</p>
          </div>
          <div>
            <h2 className="font-semibold">Fecha de Finalización:</h2>
            <p>{new Date(evento?.fechaFinEvento).toLocaleString()}</p>
          </div>
          <div>
            <h2 className="font-semibold">Cupo Máximo:</h2>
            <p>{evento?.cupoMaximo}</p>
          </div>
          <div>
            <h2 className="font-semibold">Link Stream:</h2>
            <a
              href={evento?.linkStream}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Ver Stream
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Instalación:</h2>
            <p>{evento?.instalacion?.nombre}</p>
            <p>{evento?.instalacion?.ubicacion}</p>
          </div>
          <div>
            <h2 className="font-semibold">Categoría:</h2>
            <p>{evento?.categoria?.nombre}</p>
            <p>{evento?.categoria?.descripcion}</p>
          </div>
        </div>

        {/* Disciplinas */}
        <h2 className="mt-6 font-semibold">Disciplinas:</h2>
        <ul className="list-disc pl-5">
          <li key={evento.disciplina?.id} className="mb-2">
            <h3 className="font-semibold">{evento.disciplina?.nombre}</h3>
            <p>{evento.disciplina?.descripcion}</p>
          </li>
        </ul>

        {/* Botón para inscribirse */}
        <div className="mt-6">
          {!inscripto ? (
            <button
              disabled={evento?.eventoLleno}
              className={`rounded px-4 py-2 ${
                evento?.eventoLleno
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                inscribirseAEvento();
              }}
            >
              {evento?.eventoLleno ? 'Evento Lleno' : 'Inscribirse'}
            </button>
          ) : (
            <button
              className={`rounded bg-red-500 px-4 py-2 hover:bg-red-700`}
              onClick={(e) => {
                e.preventDefault();
                desinscribirseAEvento();
              }}
            >
              Desinscribirse
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventoPage;
