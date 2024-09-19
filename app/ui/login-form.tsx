'use client';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { createTimer, getTyCToBack, loginUser } from '../utils/actions';
import { ToasterComponent } from './toaster/ToasterComponent';
import Link from 'next/link';
import { FlowModal } from './components/FlowModal/FlowModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LOCAL_STORAGE_NAME_KEY } from '../utils/const';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [tyC, setTyC] = useState<{ tyc: string }>({ tyc: '' });
  const [openModal, setOpenModal] = useState(false);
  const [userLoged, setUserLoged] = useState({});
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
  const handelLoginUser = async (e: any) => {
    e.preventDefault();
    const response = await loginUser({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    if (response?.nombre) {
      window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, response?.nombre);
      window.location.replace('/');
    }

    if (response.aceptarNuevaMenteTyC) {
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
        title="Debe aceptar los nuevos terminos y condiciones"
        isOpen={openModal}
        modalBody={tyc}
        onAcceptModal={LoginAgain}
        onCancelModal={handleCancel}
        primaryTextButton="Aceptar terminos y condiciones"
      />
    </div>
  );
}
