'use client';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getInscripcionesALecciones,
  getleccionesAsignadas,
  getUsersAdmin,
  iniciarLeccionAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { Tooltip } from '@chakra-ui/react';
import { ChartBarIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Categoria' },
  { name: 'Disciplina' },
  { name: 'Dias' },
  { name: 'Horarios' },
  { name: 'Lugar' },
  { name: 'Acciones' },
];

const diasSemana = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

function Page() {
  const [leccionesAMostrar, setLeccionesAMostrar] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [modalInicioDeClase, setModalInicioDeClase] = useState(false);
  const [alumnosPresentes, setAlumnosPresentes] = useState([]);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState({});
  const router = useRouter();
  const obtenerLecciones = async () => {
    const result = await getleccionesAsignadas();
    const leccionesToShow =
      result &&
      result.map((lecc) => ({
        id: lecc.id,
        nombre: lecc.nombre,
        categoria: lecc.categoria.nombre,
        disciplina: lecc.disciplina.nombre,
        dias: (
          <ul>
            {lecc.dias.map((dia, i) => (
              <li key={i}>{dia}</li>
            ))}
          </ul>
        ),
        horarios: lecc.horarios[0],
        lugar: lecc.lugar,
        acciones: ActionTab(result.find((disc) => disc.id === lecc.id)),
      }));
    setLeccionesAMostrar(leccionesToShow);
  };
  const handleStartLesson = async (id) => {
    try {
      const result = await getInscripcionesALecciones(id);
      const alumnos = result &&
      result
        .filter((alumno) => alumno.fechaBaja === null)
        .map((alumno) => (alumno.usuarioId))
      const {usuarios} = await getUsersAdmin();  
      const usuariosParaLaClase = usuarios.filter(usuario => alumnos.includes(usuario.id)).map((alumno)=>({
          value: alumno.id,
          label: `${alumno.dni} - ${alumno.apellido} ${alumno.nombre}`,
      }))
      setAlumnos(usuariosParaLaClase)
      setModalInicioDeClase(true);
    } catch (error) {
      toast.error(error.message)
    }
  };

  const iniciarLeccion = async () => {
    try {
      await iniciarLeccionAdmin({
        AlumnosAsist: alumnosPresentes.map((alumno) => alumno.value),
        IdLeccion: leccionSeleccionada.id,
      });
      toast.success('leccion creada con ');
      setLeccionSeleccionada({});
      setModalInicioDeClase(false);
      setAlumnosPresentes([]);
      router.push(
        `/inicio/lecciones/profesor/estadisticas/${leccionSeleccionada.id}`,
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    obtenerLecciones();
  }, []);

  const ActionTab = (leccion) => {
    console.log('leccion', leccion);
    const obtenerMinutos = (hora) => {
      const [horas, minutos] = hora.split(':').map(Number);
      return horas * 60 + minutos;
    };
    const mostrarPlay = (estaEnRango, esDiaDeLeccion, esFinalizadoHoy) => {
      if (esFinalizadoHoy) {
        return false;
      }
      if (estaEnRango && esDiaDeLeccion !== -1) {
        return true;
      }
      return false;
    };
    const fecha = new Date(); // Fecha actual
    const offset = -3; // UTC-3
    fecha.setHours(fecha.getHours() + offset);
    const diaSemana = diasSemana[fecha.getDay()];
    const esDiaDeLeccion = leccion.dias.findIndex((dia) => dia === diaSemana);
    const [horaInicio, horaFin] = leccion.horarios[0].split('-');
    const minutosActuales = fecha.getHours() * 60 + fecha.getMinutes();
    const minutosInicio = obtenerMinutos(horaInicio);
    const minutosFin = obtenerMinutos(horaFin);
    const estaEnRango =
      minutosActuales >= minutosInicio && minutosActuales <= minutosFin;
    const objetoConIdMasGrande = leccion.leccionHistoriales.reduce(
      (max, obj) => (obj.id > max.id ? obj : max),
    );
    
    const fechaActual = fecha.toISOString().split('T')[0];
    // Extraer la fecha de inicio del objeto
    const fechaInicio = objetoConIdMasGrande.fechaInicio.split('T')[0];
    // Verificar si el detalle y la fecha coinciden
    const esFinalizadoHoy =
      objetoConIdMasGrande.detalleCambioEstado == 'Se finalizó la leccion' &&
      fechaInicio == fechaActual;
      console.log('mostrarPlay(estaEnRango, esDiaDeLeccion, esFinalizadoHoy)', mostrarPlay(estaEnRango, esDiaDeLeccion, esFinalizadoHoy))
      console.log('esFinalizadoHoy', esFinalizadoHoy)
      console.log('esDiaDeLeccion', esDiaDeLeccion)
      console.log('estaEnRango', estaEnRango)

    return (
      <div className="flex flex-row gap-4">
        {mostrarPlay(estaEnRango, esDiaDeLeccion, esFinalizadoHoy) ? (
          <Tooltip label="Empezar leccion">
            <PlayIcon
              onClick={() => {
                const fecha = new Date();
                const fechaActual = fecha.toISOString().split('T')[0];
                const fechaInicio =
                  objetoConIdMasGrande.fechaInicio.split('T')[0];
                if (
                  objetoConIdMasGrande.leccionEstado.nombreEstado ===
                    'ClaseIniciada' &&
                  fechaActual === fechaInicio
                ) {
                  router.push(
                    `/inicio/lecciones/profesor/estadisticas/${leccion.id}`,
                  );
                  return;
                }
                handleStartLesson(leccion.id);
                setLeccionSeleccionada(leccion);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        ) : (
          <Tooltip label="Editar Estadisticas">
            <ChartBarIcon
              onClick={() => {
                router.push(
                  `/inicio/lecciones/profesor/estadisticas/${leccion.id}?esEdicion=true`,
                );
                return;
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <section>
      <Toaster />
      <div className="w-100  mb-6 flex flex-row items-center justify-between">
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Lecciones
        </div>
      </div>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={leccionesAMostrar} />
      </section>
      <FlowModal
        title={`Iniciar leccion`}
        modalBody={
          <div>
            <SelectWithLabel
              name="dias"
              label="Alumnos presentes"
              options={alumnos}
              value={alumnosPresentes}
              isMulti
              onChange={setAlumnosPresentes}
            />
          </div>
        }
        primaryTextButton="Aceptar"
        isOpen={modalInicioDeClase}
        scrollBehavior="outside"
        onAcceptModal={iniciarLeccion}
        disabled={alumnosPresentes.length === 0}
        type="submit"
        onCancelModal={() => {
          setAlumnosPresentes([]);
          setAlumnos([]);
          setModalInicioDeClase(false);
          setLeccionSeleccionada({});
        }}
      />
    </section>
  );
}

export default withAuthorization(Page, 'Lecciones');
