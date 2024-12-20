'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '../components/SelectWithLabel/SelectWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import {
  bloquearUsuarioAdmin,
  clearPasswordByEmail,
  createTimer,
  desbloquearUsuarioAdmin,
  EditUserByAdmin,
  eliminarUsuarioAction,
  getPerfilesAction,
  getUsersAdmin,
  registrarUsuarioAdmin,
  verifyRegistryUserByAdmin,
} from '@/app/utils/actions';
import {
  PencilIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { ModalBlockUser } from './User/ModalBlockUser';
import { ModalCreateEditUser } from './User/ModalCreateEditUser';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';

const ACTIVE_VALUES = [
  { label: 'SI', value: true },
  { label: 'NO', value: false },
];

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'DNI' },
  { name: 'Email' },
  { name: 'Teléfono' },
  { name: 'Estado' },
  { name: 'Acciones' },
];

export const UserTab = () => {
  const [usersToShow, setUsersToShow] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [openBlockUserModal, setOpenBlockUserModal] = useState(false);
  const [openDetailUserModal, setOpenDetailUserModal] = useState(false);
  const [editCreateUser, setEditCreateUser] = useState(false);
  const [usuarioADesbloquear, setUsuarioADesbloquear] = useState(false);
  const [usuarioDadoDeBaja, setUsuarioDadoDeBaja] = useState(false);
  const [userSelected, setUserSelected] = useState<any>({});
  const [errors, setErrors] = useState<any>([]);
  const [perfiles, setPerfiles] = React.useState([]);
  const handleClick = (user: JSON) => {
    setUserSelected(user);
    setEditCreateUser(true);
  };

  const openUserModalBlock = (user: JSON) => {
    setUserSelected(user);
    setOpenBlockUserModal(true);
  };
  const openModalUsuarioEditar = (user: JSON) => {
    setUserSelected(user);
    setOpenDetailUserModal(true);
  };
  const openModalUsuarioDetalles = (user: JSON) => {
    setUserSelected(user);
    setUsuarioDadoDeBaja(true);
  };

  const openModalUsuarioADesbloquear = (user: JSON) => {
    setUserSelected(user);
    setUsuarioADesbloquear(true);
  };

  const blanquearContraseña = async (user: any) => {
    try {
      await clearPasswordByEmail(user.email);
      toast.success(`Se blanqueó la contraseña del usuario ${user.email}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getPerfilesToSelect = async () => {
    try {
      const result: any = await getPerfilesAction();
      const perfilToShow = result.map((pf: any) => ({
        label: pf.perfil.nombrePerfil,
        value: pf.perfil.nombrePerfil,
      }));
      setPerfiles(perfilToShow);
    } catch (error) {
      console.log(error);
    }
  };

  const filterUsers = (e: any) => {
    e.preventDefault();

    // Capturamos los valores de los filtros
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
      dni: e.target.dni.value.trim(), // Asegura que no haya espacios vacíos
      estado: e.target.activo.value === 'true' ? 'Activo' : 'Desactivado',
    };
    console.log('users', users);

    // Filtramos los usuarios
    const userFiltered = users.filter((usuario: any) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? usuario.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Filtrar por DNI si está presente
      const filtroDniValido = filtros.dni
        ? usuario.dni.toString().includes(filtros.dni)
        : true; // Ignorar si está vacío

      // Siempre filtrar por estado
      const filtroEstadoValido =
        filtros.estado === 'Activo'
          ? usuario.estado === 'Activo'
          : filtros.estado === 'Desactivado'
            ? usuario.estado === 'Desactivado' || usuario.estado === 'Bloqueado'
            : usuario.estado === null;

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido && filtroDniValido && filtroEstadoValido;
    });
    // Mapeamos los usuarios filtrados
    const userMappeds = userFiltered.map((user: any) => {
      return {
        name: user.nombre,
        apellido: user.apellido,
        dni: user.dni,
        email: user.email,
        telefono: user.telefono,
        estado: user.estado,
        acciones: ActionTab(user, setErrors), // Esto asumo es un componente que ya tienes
        id: user.id,
      };
    });
    setUsersToShow(userMappeds);
  };

  const handleAccept = async (e: any) => {
    try {
      await bloquearUsuarioAdmin(userSelected.id, e.target.razon.value);
      toast.success('usuario bloqueado con éxito');
      setUserSelected({});
      userToTab();
      setOpenDetailUserModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDarDeBajaUsuario = async (e: any) => {
    try {
      await eliminarUsuarioAction(userSelected.id);
      setUserSelected({});
      toast.success('usuario dado de baja con éxito');
      userToTab();
      setOpenBlockUserModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDesbloquearUsuario = async (e: any) => {
    try {
      await desbloquearUsuarioAdmin(userSelected.id, e.target.razon.value);
      toast.success('usuario desbloqueado con éxito');
      userToTab();
      setUsuarioADesbloquear(false);
    } catch (error) {
      console.log(error);
    }
  };
  const userToTab = async () => {
    try {
      const result: any = await getUsersAdmin();
      setUsers(result.usuarios);
      const newUserToShow =
        result.usuarios &&
        result.usuarios.map((user: any) => {
          return {
            name: user.nombre,
            apellido: user.apellido,
            dni: user.dni,
            email: user.email,
            telefono: user.telefono,
            estado: user.estado,
            acciones: ActionTab(
              result.usuarios.find((usr: any) => usr.id === user.id),
              setErrors,
            ),
            id: user.id,
          };
        });
      setUsersToShow(newUserToShow);
    } catch (error) {}
  };

  const createUser = async (event: any) => {
    try {
      setErrors([]);
      const result: any = await verifyRegistryUserByAdmin({
        Nombre: event.target.Nombre.value,
        Apellido: event.target.Apellido.value,
        Direccion: event.target.Direccion.value,
        Telefono: event.target.Telefono.value,
        Dni: event.target.Dni.value,
        Email: event.target.Email.value,
        FechaNacimiento: event.target.FechaNacimiento.value,
        FotoPerfilNo64: event.target.FotoPerfilNo64.files[0],
        Perfil: event.target.Perfil.value,
        Sexo: event.target.Sexo.value,
      });
      if (result?.error) {
        setErrors(result.errors);
        return;
      }
      if (result.data) {
        await registrarUsuarioAdmin(result.data);
        setEditCreateUser(false);
        toast.success('Usuario creado con éxito');
        userToTab();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const editUserAction = async (event: any) => {
    try {
      setErrors([]);
      const result = await EditUserByAdmin({
        Id: userSelected.id,
        Nombre: event.target.Nombre.value,
        Apellido: event.target.Apellido.value,
        Direccion: event.target.Direccion.value,
        Telefono: event.target.Telefono.value,
        Dni: event.target.Dni.value,
        Email: event.target.Email.value,
        FechaNacimiento: event.target.FechaNacimiento.value,
        fotoPerfil: userSelected.fotoPerfil,
        Perfil: event.target.Perfil.value,
        Sexo: event.target.Sexo.value,
      });
      if (result?.error) {
        setErrors(result.errors);
        return;
      }
      setEditCreateUser(false);
      userToTab();
      toast.success('Usuario editado con éxito');
      setErrors([]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const ActionTab = (user: any, setErrors: any) => {
    return (
      <div className="flex flex-row gap-4">
        {user.estado === 'Activo' && (
          <Tooltip label="blanquear contraseña">
            <TagIcon
              onClick={() => {
                blanquearContraseña(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Bloqueado' && (
          <Tooltip label="Desbloquear Usuario">
            <UserIcon
              onClick={() => {
                openModalUsuarioADesbloquear(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Activo' && (
          <Tooltip label="Mas detalles">
            <UserIcon
              onClick={() => {
                openModalUsuarioEditar(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Desactivado' && (
          <Tooltip label="Mas detalles">
            <UserIcon
              onClick={() => {
                openModalUsuarioDetalles(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Activo' && (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                setErrors([]);
                handleClick(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Activo' && (
          <Tooltip label="Dar de baja">
            <TrashIcon
              onClick={() => {
                openUserModalBlock(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };
  useEffect(() => {
    userToTab();
    getPerfilesToSelect();
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterUsers}
      >
        <div className="flex flex-row flex-wrap gap-5">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel name={'nombre'} type="text" />
          </section>

          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              DNI:
            </label>
            <InputWithLabel name={'dni'} type="number" />
          </section>

          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Activo:
            </label>
            <SelectWithLabel
              name="activo"
              options={ACTIVE_VALUES}
              defaultValue={ACTIVE_VALUES.find((val) => val.value === true)}
            />
          </div>

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
            setErrors([]);
            setUserSelected({});
            setEditCreateUser(true);
          }}
        >
          Crear Usuario
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={usersToShow} />
      </section>
      <FlowModal
        title="Usuario a dar de baja"
        modalBody={<ModalBlockUser userSelected={userSelected} />}
        primaryTextButton="Dar de baja al Usuario"
        isOpen={openBlockUserModal}
        scrollBehavior="outside"
        onAcceptModal={onDarDeBajaUsuario}
        onCancelModal={() => {
          setOpenBlockUserModal(false);
        }}
        type="submit"
      />
      <FlowModal
        title="Usuario"
        modalBody={<ModalBlockUser userSelected={userSelected} showReazon />}
        primaryTextButton={'Bloquear'}
        isOpen={openDetailUserModal}
        scrollBehavior="outside"
        onAcceptModal={handleAccept}
        onCancelModal={() => {
          setOpenDetailUserModal(false);
        }}
        type="submit"
      />
      <FlowModal
        title="Usuario"
        modalBody={<ModalBlockUser userSelected={userSelected} />}
        primaryTextButton={'Ok'}
        isOpen={usuarioDadoDeBaja}
        scrollBehavior="outside"
        onAcceptModal={() => {
          setUserSelected({});
          setUsuarioDadoDeBaja(false);
        }}
        onCancelModal={() => {
          setUserSelected({});
          setUsuarioDadoDeBaja(false);
        }}
        type="submit"
      />
      <FlowModal
        title="Usuario"
        modalBody={
          <ModalBlockUser userSelected={userSelected} showReazon={true} />
        }
        primaryTextButton={'Desbloquear Usuario'}
        isOpen={usuarioADesbloquear}
        scrollBehavior="outside"
        onAcceptModal={onDesbloquearUsuario}
        onCancelModal={() => {
          setUsuarioADesbloquear(false);
          setUserSelected({});
        }}
        type="submit"
      />
      <FlowModal
        title={userSelected?.id ? 'Editar Usuario' : 'Crear Usuario'}
        modalBody={
          <ModalCreateEditUser
            errors={errors}
            user={userSelected}
            perfiles={perfiles}
          />
        }
        primaryTextButton={userSelected?.id ? 'Editar' : 'Crear'}
        isOpen={editCreateUser}
        scrollBehavior="outside"
        onAcceptModal={userSelected?.id ? editUserAction : createUser}
        onCancelModal={() => {
          setEditCreateUser(false);
          setErrors([]);
          setUserSelected({});
        }}
        type="submit"
        size="full"
      />
      <Toaster />
    </div>
  );
};
