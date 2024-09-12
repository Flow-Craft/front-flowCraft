'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '../components/SelectWithLabel/SelectWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { createTimer } from '@/app/utils/actions';
import {
  PencilIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const ACTIVE_VALUES = [
  { label: 'SI', value: true },
  { label: 'NO', value: false },
];

const userEjemplo = [
  {
    id: 14,
    dni: 39235416,
    nombre: 'Mario',
    apellido: 'Merida',
    sexo: 'H',
    direccion: 'adolfo calle 245',
    telefono: '2616730665',
    email: 'sould.of.demon@gmail.com',
    fechaNacimiento: '1995-08-19T00:00:00',
  },
  {
    id: 15,
    dni: 39235416,
    nombre: 'Mario',
    apellido: 'Merida',
    sexo: 'H',
    direccion: 'adolfo calle 245',
    telefono: '2616730665',
    email: 'sould.of.demon@gmail.com',
    fechaNacimiento: '1995-08-19T00:00:00',
  },
  {
    id: 16,
    dni: 39235416,
    nombre: 'Mario',
    apellido: 'Merida',
    sexo: 'H',
    direccion: 'adolfo calle 245',
    telefono: '2616730665',
    email: 'sould.of.demon@gmail.com',
    fechaNacimiento: '1995-08-19T00:00:00',
  },
  {
    id: 17,
    dni: 39235416,
    nombre: 'Mario',
    apellido: 'Merida',
    sexo: 'H',
    direccion: 'adolfo calle 245',
    telefono: '2616730665',
    email: 'sould.of.demon@gmail.com',
    fechaNacimiento: '1995-08-19T00:00:00',
  },
];

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'DNI' },
  { name: 'Email' },
  { name: 'Tef' },
  { name: 'Acciones' },
];

export const UserTab = () => {
  const [usersToShow, setUsersToShow] = useState<any>([]);
  const getUsers = useCallback(async () => {
    try {
      await createTimer(3000);
      return userEjemplo;
    } catch (error) {}
  }, []);
  const handleClick = (id: number) => {
    window.alert(id);
  };
  const ActionTab = (id: number) => {
    return (
      <div className="flex flex-row gap-4">
        <TagIcon
          onClick={() => {
            handleClick(id);
          }}
          className="w-[50px] text-slate-500"
        />
        <UserIcon
          onClick={() => {
            handleClick(id);
          }}
          className="w-[50px] text-slate-500"
        />
        <PencilIcon
          onClick={() => {
            handleClick(id);
          }}
          className="w-[50px] text-slate-500"
        />
        <TrashIcon
          onClick={() => {
            handleClick(id);
          }}
          className="w-[50px] text-slate-500"
        />
      </div>
    );
  };
  const userToTab = useCallback(async () => {
    try {
      await createTimer(3000);
      const newUserToShow =
        userEjemplo &&
        userEjemplo.map((user: any) => {
          return {
            name: user.nombre,
            apellido: user.apellido,
            dni: user.dni,
            email: user.email,
            telefono: user.telefono,
            acciones: ActionTab(user.id),
            id: user.id,
          };
        });
      setUsersToShow(newUserToShow);
    } catch (error) {}
  }, []);
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
          className="ml-auto rounded-lg bg-blue-500 p-2 text-center text-xl text-white"
          disabled
        >
          Crear Usuario
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={usersToShow} />
      </section>
    </div>
  );
};
