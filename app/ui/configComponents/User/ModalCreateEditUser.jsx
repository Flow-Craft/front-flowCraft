import React, { useState } from 'react';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';
import { SEX_SELECT_OPTIONS } from '@/app/utils/const';
import { SelectWithLabel } from '../../components/SelectWithLabel/SelectWithLabel';
import { getPerfilesAction } from '@/app/utils/actions';

export const ModalCreateEditUser = ({ errors = [], user, perfiles }) => {
  console.log('errors', errors)
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center">
      <section className=" flex w-full flex-col md:flex-row md:justify-evenly">
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Nombre"
            name="Nombre"
            type="text"
            defaultValue={user?.nombre}
            placeHolder="Pepe"
            wrong={!!errors.find((e) => e.path[0] === 'Nombre')}
            required
          />
          <InputWithLabel
            label="Apellido"
            name="Apellido"
            type="text"
            placeHolder="Argento"
            defaultValue={user?.apellido}
            required
            wrong={!!errors.find((e) => e.path[0] === 'Apellido')}
          />
          <InputWithLabel
            label="Teléfono"
            name="Telefono"
            type="number"
            placeHolder="2616738554"
            defaultValue={user?.telefono}
            wrong={!!errors.find((e) => e.path[0] === 'Telefono')}
            required
          />
          <InputWithLabel
            label="Dirección"
            name="Direccion"
            type="string"
            placeHolder="Calle false 123"
            defaultValue={user?.direccion}
            wrong={!!errors.find((e) => e.path[0] === 'Direccion')}
            required
          />
          <InputWithLabel
            label="EMAIL"
            name="Email"
            type="email"
            placeHolder="ejemplo@gmail.com"
            defaultValue={user?.email}
            wrong={!!errors.find((e) => e.path[0] === 'Email')}
            required
          />
          <InputWithLabel
            label="DNI"
            name="Dni"
            type="dni"
            placeHolder="123456789"
            defaultValue={user?.dni}
            wrong={!!errors.find((e) => e.path[0] === 'Dni')}
            required
          />
        </div>
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Fecha de nacimiento"
            name="FechaNacimiento"
            type="date"
            defaultValue={user?.fechaNacimiento?.split('T')[0]}
            placeHolder="18/08/1995"
            wrong={!!errors.find((e) => e.path[0] === 'FechaNacimiento')}
            required
          />
          <InputWithLabel
            label="Foto"
            name="FotoPerfilNo64"
            type="file"
            required
            wrong={!!errors.find((e) => e.path[0] === 'FotoPerfilNo64')}
          />
          <SelectWithLabel
            name="Sexo"
            options={SEX_SELECT_OPTIONS}
            defaultValue={SEX_SELECT_OPTIONS.find(
              (option) => option.value === user.sexo,
            )}
            label="Sexo"
            required
            wrong={!!errors.find((e) => e.path[0] === 'Sexo')}
          />
          <SelectWithLabel
            name="Perfil"
            options={perfiles}
            defaultValue={perfiles.find(
              (option) => option.value === user.perfil,
            )}
            label="Perfil"
            required
            wrong={!!errors.find((e) => e.path[0] === 'Perfil')}
          />
          <div className="mt-9 flex w-full content-between justify-between">
            <div aria-live="polite" aria-atomic="true" className="mr-4">
              {errors &&
                errors.map((error) => (
                  <p
                    className="mt-2 text-sm font-bold text-red-500"
                    key={error.message}
                  >
                    {error.message}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
