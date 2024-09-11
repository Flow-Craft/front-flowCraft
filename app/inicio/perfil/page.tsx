'use client';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { QrGenerator } from '@/app/ui/QrGenerator/QrGenerator';
import {
  cancelUserAction,
  createTimer,
  getUserToShow,
  UpdateUser,
} from '@/app/utils/actions';
import { SEX_SELECT_OPTIONS } from '@/app/utils/const';
import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ZodIssue } from 'zod';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { separarNombreCompleto } from '@/app/utils/functions';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { useRouter } from 'next/navigation';
import SkeletonProfile from './pageSkeleton';
import Link from 'next/link';

export default function Page() {
  const [userToShow, setUserToShow] = useState<any>({});
  const [areSend, setAreSend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openFirstModal, setOpenFirstModal] = useState(false);
  const [openSecondModal, setSecondModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [imageSelected, setImageSelected] = useState<File>();
  const router = useRouter();
  const getUser = async () => {
    try {
      const result: any = await getUserToShow();
      setUserToShow(result);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const dataToQr = useMemo(() => {
    if (userToShow) {
      return {
        id: userToShow.id,
        email: userToShow.email,
        nombre: userToShow.nombre,
      };
    }
    return {};
  }, [userToShow]);
  const editProfile = (e: any) => {
    e.preventDefault();
    setEditMode(true);
  };
  const makeMyselfSocio = (e: any) => {
    e.preventDefault();
    setAreSend(true);
    toast.success('Se ha enviado la solicitud');
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    setImageSelected(file); // Almacena el archivo en el estado
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput')!.click(); // Dispara el input file al hacer click en el botón
  };

  const saveProfile = async (e: any) => {
    try {
      e.preventDefault();
      let userToEdit = Object.assign({}, userToShow);
      const nameAndLastName = separarNombreCompleto(e.target.Nombre.value);
      userToEdit = {
        id: userToShow.id,
        Nombre: nameAndLastName.Nombre,
        Apellido: nameAndLastName.Apellido,
        Email: e.target.Email.value,
        Direccion: e.target.Direccion.value,
        FechaNacimiento: e.target.Nacimiento.value,
        Dni: userToShow.dni.toString(),
        Telefono: e.target.Telefono.value,
        Sexo: e.target.Sexo.value,
        FotoPerfil: imageSelected,
      };
      const result = await UpdateUser(userToEdit, setErrors);
      if (result?.error) {
        setErrors(result.errors);
        return;
      }
      toast.success('usuario editador correctamente');
      setEditMode(false);
      setImageSelected(undefined);
      getUser();
    } catch (error: any) {
      toast.error(error!.message);
    } finally {
      await createTimer(3000);
      toast.dismiss();
    }
  };

  const handleDarmeBaja = (e: any) => {
    e.preventDefault();
    setOpenFirstModal(true);
  };

  const handleOpenSecondModal = () => {
    setOpenFirstModal(false);
    setSecondModal(true);
  };

  const cancelUser = async () => {
    try {
      await cancelUserAction();
      setSecondModal(false);
      toast.success('Se dio de baja correctamente se deslogueara');
      await createTimer(3000);
      toast.dismiss();
      window.localStorage.clear();
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const labelAndEdit = (
    label: string,
    field: any,
    type = 'text',
    editable = true,
  ) => {
    const labelSelect =
      type === 'select' &&
      SEX_SELECT_OPTIONS.find((option) => option.value === field);
    if (editMode && type === 'select') {
      return (
        <section className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            {label}:
          </label>
          <SelectWithLabel
            name={label}
            defaultValue={SEX_SELECT_OPTIONS.find(
              (option) => option.value === field,
            )}
            options={SEX_SELECT_OPTIONS}
            required
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Sexo')}
          />
        </section>
      );
    }
    if (editMode && editable) {
      return (
        <section className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            {label}:
          </label>
          <InputWithLabel
            name={label}
            defaultValue={
              label === 'Nacimiento'
                ? new Date(field).toISOString().split('T')[0]
                : field
            }
            type={type}
            wrong={!!errors.find((e: ZodIssue) => e.path[0] === label)}
            required
          />
        </section>
      );
    }
    return (
      <section className="flex flex-row gap-3">
        <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
          {label}:
        </label>
        <label className="mb-3 mt-5 block text-lg font-medium text-gray-900">
          {labelSelect ? labelSelect.label : field}
        </label>
      </section>
    );
  };
  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return <SkeletonProfile />;
  }
  return (
    <section>
      <section className="flex h-[104px] w-full flex-row items-center justify-between">
        {!editMode ? (
          <QrGenerator label="generar QR" userData={dataToQr} />
        ) : (
          <div />
        )}
        <div>
          {userToShow.mostrarBotonAsociarse ? (
            <button
              disabled={areSend || editMode}
              className={`${areSend || editMode ? 'bg-blue-300' : 'cursor-pointer bg-blue-600'} rounded-full p-5 text-center  text-3xl text-white`}
              onClick={makeMyselfSocio}
            >
              Hacete socio!
            </button>
          ) : (
            <span className="rounded-full bg-blue-300 p-5 text-center text-2xl font-bold text-white ">
              Ya eres socio
            </span>
          )}
        </div>
      </section>
      <form onSubmit={saveProfile}>
        <section className="mb-4 mt-8 flex w-full flex-col items-center justify-center ">
          <section className="relative ">
            {editMode && imageSelected ? (
              <div>{imageSelected!.name}</div>
            ) : (
              <div className="h-[24px]" />
            )}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              style={{ display: 'none' }} // Oculta el input file
              onChange={handleFileChange} // Maneja el cambio de archivo
            />
            {editMode && (
              <ArrowDownTrayIcon
                onClick={triggerFileInput}
                className="absolute left-4 top-[70px] z-50 h-20 w-20 -translate-y-1/2 cursor-pointer text-white peer-focus:text-gray-900 md:left-3"
              />
            )}
            <img
              className="h-auto w-full max-w-lg"
              src={`data:image/png;base64,${userToShow.fotoPerfil}`}
            />
          </section>
          {!editMode ? (
            <label className="mt-7 text-4xl font-bold ">
              {userToShow.nombre} {userToShow.apellido}
            </label>
          ) : (
            <div className="mt-4 text-5xl font-bold">
              <InputWithLabel
                name={'Nombre'}
                defaultValue={`${userToShow.nombre} ${userToShow.apellido}`}
                type={'text'}
                wrong={!!errors.find((e: ZodIssue) => e.path[0] === 'Telefono')}
                required
              />
            </div>
          )}
        </section>
        <section className=" flex w-full flex-row flex-wrap md:gap-10">
          <div className="md:w-[45%]">
            {labelAndEdit('Email', userToShow.email, 'email')}
            {labelAndEdit('Direccion', userToShow.direccion)}
            {labelAndEdit(
              'Nacimiento',
              formatDate(userToShow.fechaNacimiento),
              'date',
            )}
          </div>
          <div className="md:w-[45%]">
            {labelAndEdit('DNI', userToShow.dni, '', false)}
            {labelAndEdit('Telefono', userToShow.telefono, 'number')}
            {labelAndEdit('Sexo', userToShow.sexo, 'select')}
          </div>
        </section>
        <section className="flex w-full flex-row justify-between">
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
          {editMode ? (
            <div className=" flex flex-row">
              <button
                className={`h-[44px] cursor-pointer rounded-full bg-slate-400 p-2  text-center text-xl text-white`}
                onClick={(e) => {
                  e.preventDefault();
                  setImageSelected(undefined);
                  setErrors([]);
                  setEditMode(false);
                }}
              >
                Cancelar
              </button>
              <button
                className={`ml-3 h-[44px] cursor-pointer rounded-full bg-blue-500  p-2 text-center text-xl text-white`}
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row">
                <button
                  className={`cursor-pointer rounded-full bg-red-500 p-2 text-center  text-xl text-white`}
                  onClick={handleDarmeBaja}
                >
                  Darme de baja
                </button>
                <button
                  className={`ml-3 cursor-pointer rounded-full bg-blue-500 p-2  text-center text-xl text-white`}
                  onClick={editProfile}
                >
                  Editar mi perfil
                </button>
              </div>
              <div className="mt-4 hover:text-blue-600">
                <Link
                  href={`/inicio/cambiar-contrasenia?email=${userToShow.email}`}
                >
                  Cambiar Contraseña (se deslogueara)
                </Link>
              </div>
            </div>
          )}
        </section>
      </form>
      <Toaster />
      <FlowModal
        title="Darse de baja"
        modalBody={
          <div className="text-2xl font-bold text-neutral-950">
            ¿Esta seguro que desea darse de baja?{' '}
          </div>
        }
        primaryTextButton="No"
        secondaryTextButton="Si"
        isOpen={openFirstModal}
        onAcceptModal={() => {
          setOpenFirstModal(false);
        }}
        onCancelModal={handleOpenSecondModal}
      />
      <FlowModal
        title="Darse de baja"
        modalBody={
          <div className="text-2xl font-bold text-neutral-950">
            ¿Esta seguro de esta decision, tendra que volver al club para poder
            volver a activar su cuenta?{' '}
          </div>
        }
        primaryTextButton="No"
        secondaryTextButton="Si, estoy seguro"
        isOpen={openSecondModal}
        onAcceptModal={() => {
          setSecondModal(false);
        }}
        onCancelModal={cancelUser}
      />
    </section>
  );
}
