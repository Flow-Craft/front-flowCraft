import { formatDate } from '@/app/utils/functions';
import React from 'react';

export const ModalBlockUser = ({ userSelected }: any) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="self-center text-center">
        <img
          className="mb-2 h-56 w-auto max-w-lg"
          src={`data:image/png;base64,${userSelected.fotoPerfil}`}
        />
        <label className="text-4xl font-bold ">
          {userSelected.nombre} {userSelected.apellido}
        </label>
      </div>
      <div>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Email:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {userSelected.email || ''}
          </label>
        </section>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Dirrecion:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {userSelected.direccion || ''}
          </label>
        </section>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Nacimiento:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {formatDate(userSelected.fechaNacimiento) || ''}
          </label>
        </section>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            DNI:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {userSelected.dni || ''}
          </label>
        </section>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Telefono:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {userSelected.telefono || ''}
          </label>
        </section>
        <section className="flex flex-row gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Sexo:
          </label>
          <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
            {userSelected.sexo || ''}
          </label>
        </section>
      </div>
    </section>
  );
};
