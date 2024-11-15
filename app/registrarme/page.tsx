'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getTyCToBack,
  registryUser,
  verifyRegistryUser,
} from '../utils/actions';
import { Button } from '../ui/button';
import { InputWithLabel } from '../ui/components/InputWithLabel/InputWithLabel';
import { ZodIssue } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { SelectWithLabel } from '../ui/components/SelectWithLabel/SelectWithLabel';
import { SEX_SELECT_OPTIONS } from '../utils/const';
import { Toaster } from 'react-hot-toast';
import { FlowModal } from '../ui/components/FlowModal/FlowModal';

export default function Page() {
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socio, setSocio] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [event, setEvent] = useState<any>({});
  const [tyC, setTyC] = useState<{ tyc: string }>({ tyc: '' });

  const getTyC = useCallback(async () => {
    const result: any = await getTyCToBack();
    setTyC(result);
  }, []);
  const handleRegistryUser = useCallback(async () => {
    setOpenModal(false);
    await registryUser(event);
  }, [event]);

  const tyc = useMemo(() => {
    return (
      <div>
        {tyC?.['tyc'].split('\n').map((pf, index) => (
          <p key={index} className="mb-6">
            {pf}
          </p>
        ))}
      </div>
    );
  }, [tyC]);

  const handleCancel = useCallback((event: any) => {
    setOpenModal(false);
    setErrors([
      {
        code: 'too_small',
        minimum: 4,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Debe aceptar los términos y condiciones para registrarse',
        path: ['TyC'],
      },
    ]);
  }, []);

  const handleSubmitForm = async (event: any) => {
    event.preventDefault();
    setErrors([]);
    const result = await verifyRegistryUser({
      Nombre: event.target.Nombre.value,
      Apellido: event.target.Apellido.value,
      Contrasena: event.target.Contrasena.value,
      OtraContrasena: event.target.OtraContrasena.value,
      Direccion: event.target.Direccion.value,
      Telefono: event.target.Telefono.value,
      Dni: event.target.Dni.value,
      Email: event.target.Email.value,
      FechaNacimiento: event.target.FechaNacimiento.value,
      Socio: socio,
      FotoPerfilNo64: event.target.FotoPerfilNo64.files[0],
      Sexo: event.target.Sexo.value,
    });
    if (result?.error) {
      setErrors(result.errors);
    } else {
      setEvent({
        Nombre: event.target.Nombre.value,
        Apellido: event.target.Apellido.value,
        Contrasena: event.target.Contrasena.value,
        OtraContrasena: event.target.OtraContrasena.value,
        Direccion: event.target.Direccion.value,
        Telefono: event.target.Telefono.value,
        Dni: event.target.Dni.value,
        Email: event.target.Email.value,
        FechaNacimiento: event.target.FechaNacimiento.value,
        Socio: socio,
        FotoPerfilNo64: event.target.FotoPerfilNo64.files[0],
        Sexo: event.target.Sexo.value,
      });
      setOpenModal(true);
    }
  };
  useEffect(() => {
    getTyC();
  }, []);
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center">
      <div className="self-start px-9 text-3xl font-bold">Registrarme</div>
      <form
        className=" flex w-full flex-col md:flex-row md:justify-evenly"
        onSubmit={handleSubmitForm}
      >
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Nombre"
            name="Nombre"
            type="text"
            placeHolder="Pepe"
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Nombre')}
            required
          />
          <InputWithLabel
            label="Apellido"
            name="Apellido"
            type="text"
            placeHolder="Argento"
            required
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Apellido')}
          />
          <InputWithLabel
            label="Telefono"
            name="Telefono"
            type="number"
            placeHolder="2616738554"
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Telefono')}
            required
          />
          <InputWithLabel
            label="Direccion"
            name="Direccion"
            type="string"
            placeHolder="Calle false 123"
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Direccion')}
            required
          />
          <InputWithLabel
            label="EMAIL"
            name="Email"
            type="email"
            placeHolder="ejemplo@gmail.com"
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Email')}
            required
          />
          <InputWithLabel
            label="DNI"
            name="Dni"
            type="dni"
            placeHolder="123456789"
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Dni')}
            required
          />
        </div>
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Fecha de nacimiento"
            name="FechaNacimiento"
            type="date"
            placeHolder="18/08/1995"
            wrong={
              !!errors.find((e: ZodIssue) => e.path[0] === 'FechaNacimiento')
            }
            required
          />
          <InputWithLabel
            label="Contraseña"
            name="Contrasena"
            type={showPassword ? 'text' : 'password'}
            required
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Contrasena')}
            onClickIcon={() => {
              setShowPassword(!showPassword);
            }}
            Icon={showPassword ? EyeIcon : EyeSlashIcon}
          />
          <InputWithLabel
            label=" Confirmar Contraseña"
            name="OtraContrasena"
            type={showConfirmPassword ? 'text' : 'password'}
            wrong={
              !!errors.find((e: ZodIssue) => e.path[0] === 'OtraContrasena')
            }
            Icon={showConfirmPassword ? EyeIcon : EyeSlashIcon}
            onClickIcon={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            required
          />
          <InputWithLabel
            label="Foto"
            name="FotoPerfilNo64"
            type="file"
            required
            wrong={
              !!errors.find((e: ZodIssue) => e.path[0] === 'FotoPerfilNo64')
            }
          />
          <SelectWithLabel
            name="Sexo"
            options={SEX_SELECT_OPTIONS}
            label="Sexo"
            required
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Sexo')}
          />
          <InputWithLabel
            label="Socio"
            name="Socio"
            type="checkbox"
            stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            value={socio}
            onChange={(e: any) => {
              setSocio(e.target.checked);
            }}
          />
          <div className="mt-9 flex w-full content-between justify-between">
            <div aria-live="polite" aria-atomic="true" className="mr-4">
              {errors &&
                errors.map((error: ZodIssue) => (
                  <p
                    className="mt-2 text-sm font-bold text-red-500"
                    key={error.message}
                  >
                    {error.message}
                  </p>
                ))}
            </div>
            <Button className={`bg-blue-400 font-bold`}>REGISTRARME</Button>
          </div>
        </div>
        {openModal && (
          <FlowModal
            title="Debe aceptar los términos y condiciones"
            isOpen={openModal}
            modalBody={tyc}
            onAcceptModal={handleRegistryUser}
            onCancelModal={handleCancel}
            primaryTextButton="Aceptar términos y condiciones"
          />
        )}
      </form>
      <Toaster />
    </div>
  );
}
