'use client';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { loginUser } from '../utils/actions';
import { ToasterComponent } from './toaster/ToasterComponent';
import Link from 'next/link';

export default function LoginForm() {
  const handelLoginUser = async (e: any) => {
    e.preventDefault();
    const response = await loginUser({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    console.log(response);
  };
  return (
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
  );
}
