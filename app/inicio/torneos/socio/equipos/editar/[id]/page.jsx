'use client';
import withAuthorization from '@/app/utils/autorization';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import React, { useEffect, useMemo, useState } from 'react';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@chakra-ui/react';
import {
  crearNuevoEquipo,
  editarEquipoExistente,
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getEquiposById,
  getUsersAdmin,
} from '@/app/utils/actions';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const HEADER_TABLE = [
  { name: 'Num Camiseta' },
  { name: 'Posicion' },
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'DNI' },
  { name: 'Acciones' },
];

function Page() {
  const [categoria, setCategoria] = useState([]);
  const [equipoAEditar, setEquipoAEditar] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nombreDelEquipo, setNombreDelEquipo] = useState('');
  const [categoriaDelEquipo, setCategoriaDelEquipo] = useState({});
  const [disciplinaDelEquipo, setDisciplinaDelEquipo] = useState({});
  const [usuariosToShow, setUsuariosToShow] = useState([]);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [numeroCamiseta, setNumeroCamiseta] = useState('');
  const [esLocal, setEsLocal] = useState(false);
  const [usuarioAAgregar, setUsuarioAAgregar] = useState({});
  const [posicion, setPosicion] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const getAllFilters = async () => {
    const equipo = await getEquiposById(id);
    setEquipoAEditar(equipo);
    const categorias = await getCategoriasActivasAdmin();
    const disciplinas = await getDisciplinasctionAction();
    const usuarios = await getUsersAdmin();
    setUsuarios(usuarios.usuarios);
    const userOptions =
      usuarios?.usuarios &&
      usuarios.usuarios
        .filter((user) => user.estado === 'Activo')
        .map((user) => ({
          label: `${user.dni} - ${user.apellido}, ${user.nombre}`,
          value: user.id,
          dni: user.dni,
        }));
    const disOptions =
      disciplinas &&
      disciplinas.map((tp) => {
        return { label: tp.nombre, value: tp.id };
      });

    const catOptions =
      categorias &&
      categorias
        .map((tp) => {
          if (!tp.fechaBaja) {
            return { label: `${tp.genero} - ${tp.nombre}`, value: tp.id };
          }
        })
        .filter(Boolean);
    setCategoria(catOptions);
    setDisciplinas(disOptions);
    setCategoriaDelEquipo(
      catOptions.find((cat) => cat.value === equipo?.categoria?.id),
    );
    setDisciplinaDelEquipo(
      disOptions.find((cat) => cat.value === equipo?.disciplina?.id),
    );
    setNombreDelEquipo(equipo?.nombre);
    const usuariosMenosSeleccionados = userOptions.filter(
      (user) => !equipo.jugadores.some((jugador) => jugador.dni === user.dni),
    );
    setUsuariosToShow(usuariosMenosSeleccionados);
    const jugadoresSeleccionados = equipo.jugadores.map((userSelected) => {
      return {
        id: userSelected.dni,
        camiseta: userSelected.numCamiseta,
        posicion: userSelected.puesto,
        nombre: userSelected.nombre,
        apellido: userSelected.apellido,
        dni: userSelected.dni,
        acciones: (
          <XCircleIcon
            className={`w-[50px] cursor-pointer text-slate-500`}
            onClick={() => {
              eliminarDelEquipo(userSelected.dni, usuarios.usuarios);
            }}
          />
        ),
      };
    });
    setUsuariosSeleccionados(jugadoresSeleccionados);
    setEsLocal(equipo.local);
  };

  const eliminarDelEquipo = (dni, usuarios) => {
    setUsuariosSeleccionados((current) => {
      const newCurrent = current.filter((user) => user.dni !== dni);
      return newCurrent;
    });
    const userAAgregar = usuarios.find((user) => user.dni === dni);
    const nuevaOpcion = {
      label: `${userAAgregar.dni} - ${userAAgregar.apellido}, ${userAAgregar.nombre}`,
      value: userAAgregar.id,
      dni: userAAgregar.dni,
    };
    setUsuariosToShow((current) => [nuevaOpcion, ...current]);
  };
  const handleAgregarUsuario = () => {
    if (
      usuariosSeleccionados.find((user) => user.camiseta === numeroCamiseta)
    ) {
      toast.error('Ya existe un jugador con ese numero de camiseta');
      return;
    }
    const userSelected = usuarios.find(
      (user) => user.id === usuarioAAgregar.value,
    );
    const nuevoUsuario = {
      id: userSelected.dni,
      camiseta: numeroCamiseta,
      posicion: posicion,
      nombre: userSelected.nombre,
      apellido: userSelected.apellido,
      dni: userSelected.dni,
      acciones: (
        <XCircleIcon
          className={`w-[50px] cursor-pointer text-slate-500`}
          onClick={() => {
            eliminarDelEquipo(userSelected.dni, usuarios);
          }}
        />
      ),
    };
    setUsuarioAAgregar(null);
    setNumeroCamiseta('');
    setPosicion('');
    setUsuariosSeleccionados([nuevoUsuario, ...usuariosSeleccionados]);
    setUsuariosToShow(
      usuariosToShow.filter((user) => user.value !== usuarioAAgregar.value),
    );
  };
  const isDisable = useMemo(() => {
    return (
      !nombreDelEquipo ||
      usuariosSeleccionados.length === 0 ||
      !categoriaDelEquipo ||
      !disciplinaDelEquipo
    );
  }, [
    nombreDelEquipo,
    usuariosSeleccionados,
    categoriaDelEquipo,
    disciplinaDelEquipo,
  ]);

  const crearEquipo = async () => {
    try {
      const equipoAcrear = {
        Id: equipoAEditar.id,
        Nombre: nombreDelEquipo,
        Local: esLocal,
        Descripcion: 'Hola',
        IdDisciplina: disciplinaDelEquipo.value,
        IdCategoria: categoriaDelEquipo.value,
        Jugadores: usuariosSeleccionados.map((usuario) => ({
          Dni: usuario.dni,
          Puesto: usuario.posicion,
          NumCamiseta: Number(usuario.camiseta),
        })),
      };

      await editarEquipoExistente(equipoAcrear);
      toast.success('equipo editado con éxito');
      router.back();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllFilters();
  }, [id]);
  return (
    <section>
      <div>
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Crear Equipo
        </div>
        <div className="flex w-full flex-wrap items-center gap-8">
          <Toaster />
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel
              name={'nombre'}
              type="text"
              value={nombreDelEquipo}
              onChange={(e) => {
                setNombreDelEquipo(e.target.value);
              }}
            />
          </section>
          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Categoria:
            </label>
            <div className="min-w-[220px]">
              <SelectWithLabel
                name="categoria"
                options={categoria}
                value={categoriaDelEquipo}
                onChange={setCategoriaDelEquipo}
              />
            </div>
          </div>
          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Disciplina:
            </label>
            <div className="min-w-[220px]">
              <SelectWithLabel
                name="disciplina"
                options={disciplinas}
                value={disciplinaDelEquipo}
                onChange={setDisciplinaDelEquipo}
              />
            </div>
          </div>
          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Local:
            </label>
            <div className="min-w-[220px]">
              <InputWithLabel
                name={'nombre'}
                stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="checkbox"
                value={esLocal}
                onChange={(e) => {
                  setEsLocal(e.target.checked);
                }}
              />
            </div>
          </div>
          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Jugador:
            </label>
            <div className="min-w-[320px]">
              <SelectWithLabel
                name="jugador"
                options={usuariosToShow}
                value={usuarioAAgregar}
                onChange={setUsuarioAAgregar}
              />
            </div>
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Numero de camiseta:
            </label>
            <InputWithLabel
              name={'nombre'}
              type="number"
              min={1}
              value={numeroCamiseta}
              onChange={(e) => {
                setNumeroCamiseta(e.target.value);
              }}
            />
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Posicion:
            </label>
            <InputWithLabel
              name={'posicion'}
              type="text"
              value={posicion}
              onChange={(e) => {
                setPosicion(e.target.value);
              }}
            />
          </div>
          <Tooltip label="agregar al equipo">
            <PlusCircleIcon
              className="w-[50px] cursor-pointer rounded-lg bg-blue-500 p-2 text-center text-xl text-white"
              onClick={() => {
                if (usuarioAAgregar && numeroCamiseta && posicion)
                  handleAgregarUsuario();
              }}
            />
          </Tooltip>
        </div>

        <section className="mt-8">
          <FlowTable Header={HEADER_TABLE} dataToShow={usuariosSeleccionados} />
        </section>
      </div>
      <div className="mt-32">
        <div className="flex justify-end">
          <button
            className="mr-4 rounded-lg bg-blue-500 p-2 text-center text-xl text-white disabled:cursor-default disabled:bg-blue-300"
            disabled={isDisable}
            onClick={crearEquipo}
          >
            Guardar
          </button>
          <button
            className="rounded-lg bg-gray-500 p-2 text-center text-xl text-white"
            onClick={() => router.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </section>
  );
}

export default withAuthorization(Page, 'Torneos');
