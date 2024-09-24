'use client';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import {
  changePasswordWithoutCode,
  createTimer,
  getTyCToBack,
  getUserByDni,
  loginUser,
} from '../utils/actions';
import { ToasterComponent } from './toaster/ToasterComponent';
import Link from 'next/link';
import { FlowModal } from './components/FlowModal/FlowModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTORIZATION_KEY, LOCAL_STORAGE_NAME_KEY } from '../utils/const';
import toast from 'react-hot-toast';
import { InputWithLabel } from './components/InputWithLabel/InputWithLabel';
import { ChangePasswordLogin } from './dashboard/changePasswordLogin';

export default function LoginForm() {
  const [tyC, setTyC] = useState<{ tyc: string }>({ tyc: '' });
  const [openModal, setOpenModal] = useState(false);
  const [openModalfindUser, setOpenModalfindUser] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<any>('');
  const [userLoged, setUserLoged] = useState({});
  const [errors, setErrors] = useState([]);
  const getTyC = useCallback(async () => {
    const result: any = await getTyCToBack();
    setTyC(result);
  }, []);
  const LoginAgain = async () => {
    try {
      const response = await loginUser({ ...userLoged, ReaceptarTyC: true });
      if (response?.nombre) {
        window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, response?.nombre);
        await createTimer(100);
        window.location.href = '/';
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
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
  const handleCancel = () => {
    setOpenModal(false);
    toast.error(
      'Debes aceptar los nuevos términos y condiciones para continuar',
    );
  };

  const handleCancelFindUser = () => {
    setOpenModalfindUser(false);
  };

  const getUserEmail = async (e: any) => {
    try {
      const result: any = await getUserByDni(e.target.dni.value);
      if (result?.email) {
        const [username, domain] = result?.email.split('@');
        const anonymizedUsername =
          username[0] +
          '*'.repeat(username.length - 2) +
          username[username.length - 1];
        setUserName(anonymizedUsername + '@' + domain);
      }
    } catch (error: any) {
      toast.error('DNI incorrecto');
    }
  };

  const handleCloseWithUserName = () => {
    setUserName('');
    setOpenModalfindUser(false);
  };

  const ChangePassword = async (e: any) => {
    setErrors([]);
    const result: any = await changePasswordWithoutCode(
      e.target.Contrasena.value,
      e.target.OtraContrasena.value,
      userEmail.email,
      userEmail.jwt
    );
    if (result?.error) {
      setErrors(result.errors);
    } else {
      toast.success(
        'Su contraseña fue cambiada correctamente. Por favor vuelva a ingresar sus datos.',
      );
      setOpenChangePassword(false);
      setUserEmail('');
    }
  };

  const handelLoginUser = async (e: any) => {
    e.preventDefault();
    const response = await loginUser({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    if (response?.usuario?.nombre) {
      window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, response?.nombre);
      window.localStorage.setItem(AUTORIZATION_KEY, response.JWT);
      window.location.replace('/');
    }

    if(response?.error === 'Contraseña vencida'){
      console.log(response)
      setOpenChangePassword(true);
      setUserEmail({email:e.target.email.value, jwt:response.JWT});
    }

    if (response?.aceptarNuevaMenteTyC) {
      setUserLoged({
        email: e.target.email.value,
        password: e.target.password.value,
      });
      setOpenModal(true);
    }
  };
  useEffect(() => {
    getTyC();
  }, []);  
  return (
    <div>
      <form onSubmit={handelLoginUser}>
        <div>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-lg font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ejemplo@gmail.com"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4 flex flex-row justify-end">
              <a
                onClick={() => {
                  setOpenModalfindUser(true);
                }}
                className="pointer hover:text-blue-600"
              >
                no recuerdo mi usuario
              </a>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-lg font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Ingrese su contraseña por favor"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-end">
            <Link
              href={'/cambiar_contrasena'}
              className="pointer hover:text-blue-600"
            >
              cambiar contraseña
            </Link>
          </div>
          <Button className="mt-4 w-full bg-blue-600 text-lg">
            Iniciar Sesion{' '}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
        <ToasterComponent position="top-center" />
      </form>
      <FlowModal
        title={!userName ? 'Por favor ingrese su DNI' : 'Su usuario es:'}
        isOpen={openModalfindUser}
        modalBody={
          <div>
            {!userName ? (
              <InputWithLabel name={'dni'} type="number" min={1} />
            ) : (
              <div>{userName}</div>
            )}
          </div>
        }
        onAcceptModal={!userName ? getUserEmail : handleCloseWithUserName}
        onCancelModal={handleCancelFindUser}
        primaryTextButton={!userName ? 'Recuperar mi usuario' : 'Gracias!'}
        type="submit"
      />
      <FlowModal
        title="Debe aceptar los nuevos terminos y condiciones"
        isOpen={openModal}
        modalBody={tyc}
        onAcceptModal={LoginAgain}
        onCancelModal={handleCancel}
        primaryTextButton="Aceptar terminos y condiciones"
      />
      <FlowModal
        title="Debe actualizar su contraseña"
        isOpen={openChangePassword}
        modalBody={
          <div>
            <ChangePasswordLogin errors={errors} />
          </div>
        }
        onAcceptModal={ChangePassword}
        onCancelModal={() => {
          setOpenChangePassword(false);
          window.localStorage.clear()
        }}
        primaryTextButton="Actualizar"
        type="submit"
      />
    </div>
  );
}
