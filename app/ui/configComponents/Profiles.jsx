'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { PencilIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import { EditCreatProfile } from './Perfiles/EditCreatProfile';
import {
  createPerfilAction,
  editPerfilAction,
  eliminarPerfilAdmin,
  getPerfilesAdmin,
  getPermisosAdmin,
} from '../../utils/actions';
import { formatDate } from '@/app/utils/functions';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Descripcion' },
  { name: 'Alta' },
  { name: 'Edicion' },
  { name: 'Acciones' },
];

export const ProfilesTab = () => {
  const [profilesToShow, setProfilesToShow] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [openDeleteProfile, setopenDeleteProfile] = useState(false);
  const [profileToDelte, setprofileToDelte] = useState(null);
  const [openCreateProfile, setOpenCreateProfile] = useState(false);
  const [perfilToEdit, setPerfilToEdit] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [permisosSelected, setPermisosSelected] = useState([]);
  const [errors, setErrors] = useState([]);
  const getPermisos = async () => {
    try {
      const result = await getPermisosAdmin();
      const resultToShow = result.map((permiso) => ({
        value: permiso.id,
        label: `${permiso.nombrePermiso} - ${permiso.funcionalidades}`,
      }));
      setPermisos(resultToShow);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteDicipline = async () => {
    try {
      await eliminarPerfilAdmin(profileToDelte.perfil.id);
      toast.success('Perfil eliminado con exito');
      PerfilesToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setopenDeleteProfile(false);
      setprofileToDelte(null);
    }
  };

  const filterPerfiles = (e) => {
    e.preventDefault();
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
    };
    // Filtramos los usuarios
    const disFiltered = profiles.filter((dis) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? dis.perfil.nombrePerfil
            .toLowerCase()
            .includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido;
    });
    // Mapeamos los usuarios filtrados
    const newProfilesToShow =
      disFiltered &&
      disFiltered.map((dis) => {
        return {
          nombre: dis.perfil.nombrePerfil,
          descripcion: dis.perfil.descripcionPerfil,
          fechaCreacion: formatDate(dis.perfil.fechaCreacion),
          fechaModificacion: dis.perfil.fechaModificacion
            ? formatDate(dis.perfil.fechaModificacion)
            : '--/--/--',
          acciones: ActionTab(
            disFiltered.find((disc) => disc.perfil.id === dis.perfil.id),
          ),
          id: dis.perfil.id,
        };
      });

    setProfilesToShow(newProfilesToShow);
  };

  const handleEliminarDisciplina = (dis) => {
    setopenDeleteProfile(true);
    setprofileToDelte(dis);
  };

  const handleFormPerfil = async (e) => {
    try {
      setErrors([]);
      let serPerfilToEdit = {
        Perfil: {
          NombrePerfil: e.target.nombre.value,
          DescripcionPerfil: e.target.descripcion.value,
        },
        Permisos: permisosSelected.map((perm) => perm.value),
      };
      if (perfilToEdit?.id) {
        let perfil = {
          Perfil: {
            Id: perfilToEdit.id,
            NombrePerfil: e.target.nombre.value,
            DescripcionPerfil: e.target.descripcion.value,
          },
          Permisos: permisosSelected.map((perm) => perm.value),
        };
        await editPerfilAction(perfil);
        toast.success('perfil editado con exito');
        PerfilesToTab();
        return;
      }
      const result = await createPerfilAction(serPerfilToEdit, setErrors);
      if (result?.error) {
        setErrors(result.errors);
      }
      toast.success('perfil creado con exito');
      PerfilesToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPerfilToEdit(null);
      setOpenCreateProfile(false);
      setPermisosSelected([]);
    }
  };
  const PerfilesToTab = async () => {
    try {
      const result = await getPerfilesAdmin();
      setProfiles(result);
      const newProfilesToShow =
        result &&
        result.map((dis) => {
          return {
            nombre: dis.perfil.nombrePerfil,
            descripcion: dis.perfil.descripcionPerfil,
            fechaCreacion: formatDate(dis.perfil.fechaCreacion),
            fechaModificacion: dis.perfil.fechaModificacion
              ? formatDate(dis.perfil.fechaModificacion)
              : '--/--/--',
            acciones: ActionTab(
              result.find((disc) => disc.perfil.id === dis.perfil.id),
            ),
            id: dis.perfil.id,
          };
        });
      setProfilesToShow(newProfilesToShow);
    } catch (error) {}
  };
  const ActionTab = (perfil) => {
    return (
      <div className="flex flex-row gap-4">
        {!perfil.fechaBaja && (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                const perfilToEdit = {
                  id: perfil.perfil.id,
                  nombre: perfil.perfil.nombrePerfil,
                  descripcion: perfil.perfil.descripcionPerfil,
                };
                const permisosToEdit = perfil.permisos?.map((per) => ({
                  label: `${per.modulo} - ${per.nombrePermiso}`,
                  value: per.id,
                }));
                setPerfilToEdit(perfilToEdit);
                setPermisosSelected(permisosToEdit);
                setOpenCreateProfile(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {!perfil.fechaBaja && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                handleEliminarDisciplina(perfil);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };
  useEffect(() => {
    PerfilesToTab();
    getPermisos();
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterPerfiles}
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
            setOpenCreateProfile(true);
          }}
        >
          Crear Perfil
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={profilesToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`Eliminar Perfil ${profileToDelte?.perfil?.nombrePerfil}`}
        modalBody={<div>{profileToDelte?.perfil?.descripcionPerfil}</div>}
        primaryTextButton="¿Esta seguro que desea eliminar este perfil?"
        isOpen={openDeleteProfile}
        scrollBehavior="outside"
        onAcceptModal={deleteDicipline}
        onCancelModal={() => {
          setopenDeleteProfile(false);
          setprofileToDelte(null);
        }}
      />
      <FlowModal
        title={`${perfilToEdit?.id ? 'Editar perfil' : 'Crear perfil'}`}
        modalBody={
          <div>
            <EditCreatProfile
              permisos={permisos}
              permisosSelected={permisosSelected}
              setPermisosSelected={setPermisosSelected}
              errors={errors}
              perfil={perfilToEdit}
            />
          </div>
        }
        primaryTextButton="Guardar"
        isOpen={openCreateProfile}
        scrollBehavior="outside"
        onAcceptModal={handleFormPerfil}
        type="submit"
        onCancelModal={() => {
          setOpenCreateProfile(false);
          setPerfilToEdit(false);
        }}
      />
    </div>
  );
};
