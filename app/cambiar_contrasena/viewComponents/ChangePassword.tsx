'use client';

import { Button } from '@/app/ui/button';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { ToasterComponent } from '@/app/ui/toaster/ToasterComponent';
import { changePassword, createTimer } from '@/app/utils/actions';
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ZodIssue } from 'zod';
import { useRouter } from 'next/navigation';
import { LOGIN_HREF } from '@/app/utils/const';

export default function ChangePassword({ email, code }: any) {
  const [errors, setErrors] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const handleChangePassword = async (e: any) => {
    try {
      e.preventDefault();
      setErrors([]);
      const result = await changePassword(
        e.target.Contrasena.value,
        e.target.OtraContrasena.value,
        email,
        code,
      );
      if (result?.error) {
        setErrors(result.errors);
      } else {
        toast.success(
          'Su contraseña fue cambiada correctamente. Será redirigido al login.',
        );
        await createTimer(3000);
        router.push(LOGIN_HREF);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <div className="mt-2">
      <form
        className="flex flex-col items-center"
        onSubmit={handleChangePassword}
      >
        <div className="w-[90%] md:w-[65%]">
          <label
            className="mb-3 mt-5 block text-lg font-medium text-gray-900 "
            htmlFor="email"
          >
            Por favor ingrese su nueva contraseña
          </label>
          <InputWithLabel
            label="Contraseña"
            name="Contrasena"
            type={showPassword ? 'text' : 'password'}
            required
            onClickIcon={() => {
              setShowPassword(!showPassword);
            }}
            Icon={showPassword ? EyeIcon : EyeSlashIcon}
          />
          <InputWithLabel
            label=" Confirmar Contraseña"
            name="OtraContrasena"
            type={showConfirmPassword ? 'text' : 'password'}
            Icon={showConfirmPassword ? EyeIcon : EyeSlashIcon}
            onClickIcon={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            required
          />
          <Button className="mt-4 w-full bg-blue-600 text-lg">
            Enviar Codigo{' '}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
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
          </div>
        </div>
        <ToasterComponent position="top-center" />
      </form>
    </div>
  );
}
