'use client';

import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import {
  crearLeccionAdmin,
  editarLeccionAdmin,
  eliminarLeccionAdmin,
  getCategoriaAdmin,
  getDisciplinasctionAction,
  getLeccionesAdmin,
  getPerfilByNombreAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FormEditarCrearLeccion } from './components/FormEditarCrearLeccion/FormEditarCrearLeccion';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Dias' },
  { name: 'Cantidad Alumnos' },
  { name: 'Disciplina' },
  { name: 'Categoria' },
  { name: 'Acciones' },
];

const diasDeLaSemana = [
  { label: 'Lunes', value: 'Lunes' },
  { label: 'Martes', value: 'Martes' },
  { label: 'Miércoles', value: 'Miércoles' },
  { label: 'Jueves', value: 'Jueves' },
  { label: 'Viernes', value: 'Viernes' },
  { label: 'Sábado', value: 'Sábado' },
  { label: 'Domingo', value: 'Domingo' },
];

function Page() {
  const router = useRouter();
  const [lecciones, setLecciones] = useState([]);
  const [leccionesToShow, setLeccionesToShow] = useState([]);
  const [openModalCrearEditarLecciones, setOpenModalCrearEditarLecciones] =
    useState(false);
  const [nuevaLeccion, setNuevaLeccion] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [disiciplina, setDisiciplina] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState({});
  const [modalEliminarLeccion, setModalEliminarLeccion] = useState(false);

  const getLecciones = async () => {
    try {
      const resultCategoria = await getCategoriaAdmin();
      const categorias = resultCategoria.map((leccion) => ({
        value: leccion.id,
        label: leccion.nombre,
      }));
      setCategorias(categorias);
      const resultDisciplina = await getDisciplinasctionAction();
      const disciplinas = resultDisciplina.map((leccion) => ({
        value: leccion.id,
        label: leccion.nombre,
      }));
      setDisiciplina(disciplinas);
      const profesores = await getPerfilByNombreAdmin('Profesor');
      const opcionesProf = profesores.map((mp) => ({
        value: mp.id,
        label: `${mp.dni} - ${mp.apellido} ${mp.nombre}`,
      }));
      setProfesores(opcionesProf);
      const result = await getLeccionesAdmin();
      setLecciones(result);
      const newsolicitudesToShow =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombre: dis.nombre,
            dias: dis.dias.map((value) => `${value} `),
            alumnos: dis.cantMaxima,
            dis: dis.disciplina.nombre,
            cat: dis.categoria.nombre,
            acciones: ActionTab(
              result.find((disc) => disc.id === dis.id),
              categorias,
              disciplinas,
              opcionesProf,
            ),
          };
        });
      setLeccionesToShow(newsolicitudesToShow);
    } catch (error) {
      console.error(error);
    }
  };

  const crearLeccion = async () => {
    try {
      const horarios = [];
      nuevaLeccion.DiasDeLaSemana.forEach(() => {
        horarios.push(`${nuevaLeccion.HoraInicio}-${nuevaLeccion.HoraFin}`);
      });
      await crearLeccionAdmin({
        Nombre: nuevaLeccion.Nombre,
        Dias: nuevaLeccion.DiasDeLaSemana.map((dia) => dia.value),
        Horarios: horarios,
        CantMaxima: nuevaLeccion.CantMaxima,
        Descripcion: nuevaLeccion.Descripcion,
        Lugar: nuevaLeccion.Lugar,
        IdDisciplina: nuevaLeccion.Disciplina.value,
        IdCategoria: nuevaLeccion.Categoria.value,
        IdProfesor: nuevaLeccion.Profesor.value,
      });
      toast.success('leccion creada correctamente');
      setNuevaLeccion({});
      setOpenModalCrearEditarLecciones(false);
      getLecciones();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editarLeccion = async () => {
    try {
      const horarios = [];
      nuevaLeccion.DiasDeLaSemana.forEach(() => {
        horarios.push(`${nuevaLeccion.HoraInicio}-${nuevaLeccion.HoraFin}`);
      });
      await editarLeccionAdmin({
        Id: nuevaLeccion.Id,
        Nombre: nuevaLeccion.Nombre,
        Dias: nuevaLeccion.DiasDeLaSemana.map((dia) => dia.value),
        Horarios: horarios,
        CantMaxima: nuevaLeccion.CantMaxima,
        Descripcion: nuevaLeccion.Descripcion,
        Lugar: nuevaLeccion.Lugar,
        IdDisciplina: nuevaLeccion.Disciplina.value,
        IdCategoria: nuevaLeccion.Categoria.value,
        IdProfesor: nuevaLeccion.Profesor.value,
      });
      toast.success('leccion creada correctamente');
      setNuevaLeccion({});
      setOpenModalCrearEditarLecciones(false);
      getLecciones();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const estaDeshabilitado = (obj) => {
    if (Object.keys(obj).length === 0) return true;

    const requiredFields = [
      'Nombre',
      'CantMaxima',
      'DiasDeLaSemana',
      'Lugar',
      'HoraInicio',
      'HoraFin',
      'Categoria',
      'Disciplina',
      'Descripcion',
      'Profesor',
    ];

    return requiredFields.some((field) => {
      // Verifica si la propiedad falta o está vacía
      return !(field in obj) || obj[field] === '';
    });
  };

  const ActionTab = (categoria, categorias, disciplinas, profesores) => {
    return (
      <div className="flex flex-row gap-4">
        {categoria.activa ? (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                const leccionAeditar = {
                  Id: categoria.id,
                  Nombre: categoria.nombre,
                  CantMaxima: categoria.cantMaxima,
                  DiasDeLaSemana: diasDeLaSemana.filter((dia) =>
                    categoria.dias.includes(dia.value),
                  ),
                  Lugar: categoria.lugar,
                  HoraInicio: categoria.horarios[0].split('-')[0],
                  HoraFin: categoria.horarios[0].split('-')[1],
                  Categoria: categorias.find(
                    (dis) => dis.value === categoria.categoria.id,
                  ),
                  Disciplina: disciplinas.find(
                    (dis) => dis.value === categoria.disciplina.id,
                  ),
                  Descripcion: categoria.descripcion,
                  Profesor: profesores.find(
                    (prof) => prof.value === categoria.idProfesor,
                  ),
                };
                setNuevaLeccion(leccionAeditar);
                setOpenModalCrearEditarLecciones(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {categoria.activa && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                setModalEliminarLeccion(true);
                setLeccionSeleccionada(categoria);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const eliminarLeccion = async () => {
    try {
      await eliminarLeccionAdmin({ Id: leccionSeleccionada.id });
      toast.success('leccion eliminada con exito');
      getLecciones();
      setModalEliminarLeccion(false);
      setLeccionSeleccionada({});
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getLecciones();
  }, []);
  return (
    <div className="mt-7">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Lecciones
        </div>
        <button
          className="h-[50px] rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          onClick={() => {
            setOpenModalCrearEditarLecciones(true);
          }}
        >
          Crear Leccion
        </button>
      </div>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={leccionesToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`${nuevaLeccion.Id ? 'Editar leccion' : 'Crear leccion'}`}
        sx={{ minWidth: '900px' }}
        modalBody={
          <div>
            <FormEditarCrearLeccion
              onChange={setNuevaLeccion}
              value={nuevaLeccion}
              categorias={categorias}
              disciplina={disiciplina}
              profesores={profesores}
              diasDeLaSemana={diasDeLaSemana}
            />
          </div>
        }
        primaryTextButton="Aceptar"
        disabled={estaDeshabilitado(nuevaLeccion)}
        isOpen={openModalCrearEditarLecciones}
        scrollBehavior="outside"
        onAcceptModal={nuevaLeccion.Id ? editarLeccion : crearLeccion}
        type="submit"
        onCancelModal={() => {
          setOpenModalCrearEditarLecciones(false);
        }}
      />
      <FlowModal
        title={`Eliminar leccion`}
        modalBody={
          <div>
            <span className="text-3xl">
              Esta seguro que desea eliminar la leccion{' '}
              {leccionSeleccionada.nombre}
            </span>
          </div>
        }
        primaryTextButton="Aceptar"
        isOpen={modalEliminarLeccion}
        scrollBehavior="outside"
        onAcceptModal={eliminarLeccion}
        type="submit"
        onCancelModal={() => {
          setModalEliminarLeccion(false);
          leccionSeleccionada({});
        }}
      />
    </div>
  );
}

export default withAuthorization(Page, 'Lecciones');
