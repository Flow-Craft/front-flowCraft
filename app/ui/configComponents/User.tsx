'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '../components/SelectWithLabel/SelectWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { createTimer, getUsersAdmin } from '@/app/utils/actions';
import {
  PencilIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { ModalBlockUser } from './User/ModalBlockUser';
import { Tooltip } from '@chakra-ui/react';

const ACTIVE_VALUES = [
  { label: 'SI', value: true },
  { label: 'NO', value: false },
];

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'DNI' },
  { name: 'Email' },
  { name: 'Tef' },
  { name: 'Estado' },
  { name: 'Acciones' },
];

export const UserTab = () => {
  const [usersToShow, setUsersToShow] = useState<any>([]);
  const [openBlockUserModal, setOpenBlockUserModal] = useState(false);
  const [openDetailUserModal, setOpenDetailUserModal] = useState(false);
  const [userSelected, setUserSelected] = useState<any>({});
  const handleClick = (user: JSON) => {
    window.alert(user);
  };
  const openUserModalBlock = (user: JSON) => {
    setUserSelected(user);
    setOpenBlockUserModal(true);
  };
  const openModalUsuarioEditar = (user: JSON) => {
    setUserSelected(user);
    setOpenDetailUserModal(true);
  };

  const handleAccept = () => {};
  const userToTab = async () => {
    try {
      const result: any = await getUsersAdmin();
      console.log(result);
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
            ),
            id: user.id,
          };
        });
      setUsersToShow(newUserToShow);
    } catch (error) {}
  };
  const ActionTab = (user: any) => {
    return (
      <div className="flex flex-row gap-4">
        <Tooltip label="Action 1">
          <TagIcon
            onClick={() => {
              handleClick(user);
            }}
            className="w-[50px] cursor-pointer text-slate-500"
          />
        </Tooltip>
        <Tooltip label="Mas detalles">
          <UserIcon
            onClick={() => {
              openModalUsuarioEditar(user);
            }}
            className="w-[50px] cursor-pointer text-slate-500"
          />
        </Tooltip>
        {user.estado === 'Activo' && (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                handleClick(user);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {user.estado === 'Activo' && (
          <Tooltip label="Bloquear">
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
  }, []);
  return (
    <div className="mt-7">
      <form className="flex w-full flex-wrap items-center">
        <div className="flex flex-row flex-wrap gap-5">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel name={'Nombre'} type="text" />
          </section>

          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              DNI:
            </label>
            <InputWithLabel name={'DNI'} type="number" />
          </section>

          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Activo:
            </label>
            <SelectWithLabel
              name="Activo"
              options={ACTIVE_VALUES}
              defaultValue={ACTIVE_VALUES.find((val) => val.value === true)}
            />
          </div>

          <button
            className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            disabled
          >
            Buscar
          </button>
        </div>

        <button
          className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
          disabled
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
        onAcceptModal={handleAccept}
        onCancelModal={() => {
          setOpenBlockUserModal(false);
        }}
      />
      <FlowModal
        title="Usuario"
        modalBody={<ModalBlockUser userSelected={userSelected} />}
        primaryTextButton="Aceptar"
        isOpen={openDetailUserModal}
        scrollBehavior="outside"
        onAcceptModal={() => {
          setOpenDetailUserModal(false);
        }}
        onCancelModal={() => {
          setOpenDetailUserModal(false);
        }}
      />
    </div>
  );
};
