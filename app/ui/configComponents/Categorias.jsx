'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import { EditarCrearCategoria } from './Categoria/EditarCrearCategoria';
import {
  crearCategoriaAdmin,
  editarCategoriaAdmin,
  eliminarCategoriaAdmin,
  getCategoriaAdmin,
} from '../../utils/actions';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Descripcion' },
  { name: 'Edad Minima' },
  { name: 'Edad Maxima' },
  { name: 'Genero' },
  { name: 'Acciones' },
];

export const CategoriasTab = () => {
  const [categoriasToShow, setCategoriasToShow] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openDeleteCategoria, setOpenDeleteCategoria] = useState(false);
  const [categoriaToDelte, setCategoriaToDelte] = useState(null);
  const [openCreateCategoria, setOpenCreateCategoria] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [errors, setErrors] = useState([]);

  const deleteCategoria = async () => {
    try {
      await eliminarCategoriaAdmin(categoriaToDelte.id);
      toast.success('Perfil eliminado con exito');
      categoriasToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOpenDeleteCategoria(false);
      setCategoriaToDelte(null);
    }
  };

  const filterCategorias = (e) => {
    e.preventDefault();
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
    };
    // Filtramos los usuarios
    const disFiltered = categorias.filter((dis) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? dis.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido;
    });
    // Mapeamos los usuarios filtrados
    const categoriasFiltradas =
      disFiltered &&
      disFiltered.map((dis) => {
        return {
          id: dis.id,
          nombre: dis.nombre,
          descripcion: dis.descripcion,
          edadMinima: dis.edadMinima,
          edadMaxima: dis.edadMaxima,
          genero: dis.genero,
          acciones: ActionTab(categorias.find((disc) => disc.id === dis.id)),
        };
      });
    setCategoriasToShow(categoriasFiltradas);
  };

  const handleEliminarDisciplina = (dis) => {
    setOpenDeleteCategoria(true);
    setCategoriaToDelte(dis);
  };

  const handleFormCategoria = async (e) => {
    try {
      setErrors([]);
      let categoria = {
        Nombre: e.target.nombre.value,
        Descripcion: e.target.descripcion.value,
        EdadMinima: Number(e.target.edadMinima.value),
        EdadMaxima: Number(e.target.edadMaxima.value),
        Genero: e.target.genero.value,
      };
      const result = await crearCategoriaAdmin(categoria, setErrors);
      if (result?.error) {
        setErrors(result.errors);
      }
      toast.success('Categoria creada con exito');
      categoriasToTab();
      setOpenCreateCategoria(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editarCategoria = async (e) => {
    try {
      let categoria = {
        Id: categoriaToEdit.id,
        Nombre: e.target.nombre.value,
        Descripcion: e.target.descripcion.value,
        EdadMinima: Number(e.target.edadMinima.value),
        EdadMaxima: Number(e.target.edadMaxima.value),
        Genero: e.target.genero.value,
      };
      await editarCategoriaAdmin(categoria);
      toast.success('Categoria editada con exito');
      categoriasToTab();
      setOpenCreateCategoria(false);
      setCategoriaToEdit({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const categoriasToTab = async () => {
    try {
      const result = await getCategoriaAdmin();
      setCategorias(result);
      const categorias =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombre: dis.nombre,
            descripcion: dis.descripcion,
            edadMinima: dis.edadMinima,
            edadMaxima: dis.edadMaxima,
            genero: dis.genero,
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
          };
        });
      setCategoriasToShow(categorias);
    } catch (error) {}
  };
  const ActionTab = (categoria) => {
    return (
      <div className="flex flex-row gap-4">
        {!categoria.fechaBaja ? (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                setCategoriaToEdit(categoria);
                setOpenCreateCategoria(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {!categoria.fechaBaja && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                handleEliminarDisciplina(categoria);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };
  useEffect(() => {
    categoriasToTab();
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterCategorias}
      >
        <div className="flex flex-row flex-wrap gap-5">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel name={'nombre'} type="text" />
          </section>
          <button
            className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            type="submit"
          >
            Buscar
          </button>
        </div>

        <button
          className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
          onClick={() => {
            setOpenCreateCategoria(true);
          }}
        >
          Crear Categoria
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={categoriasToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`Eliminar Categoria ${categoriaToDelte?.nombre}`}
        modalBody={
          <div>
            ¿Esta seguro que desea eliminar esta categoria?{' '}
            {categoriaToDelte?.descripcion}
          </div>
        }
        primaryTextButton="Si"
        isOpen={openDeleteCategoria}
        scrollBehavior="outside"
        onAcceptModal={deleteCategoria}
        onCancelModal={() => {
          setOpenDeleteCategoria(false);
          setCategoriaToDelte(null);
        }}
      />
      <FlowModal
        title={`${categoriaToEdit?.id ? 'Editar categoria' : 'Crear categoria'}`}
        modalBody={
          <div>
            <EditarCrearCategoria errors={errors} categoria={categoriaToEdit} />
          </div>
        }
        primaryTextButton="Guardar"
        isOpen={openCreateCategoria}
        scrollBehavior="outside"
        onAcceptModal={
          categoriaToEdit?.id ? editarCategoria : handleFormCategoria
        }
        type="submit"
        onCancelModal={() => {
          setOpenCreateCategoria(false);
          setCategoriaToEdit({});
          setErrors([]);
        }}
      />
    </div>
  );
};
