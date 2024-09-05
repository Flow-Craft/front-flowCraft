'use client';

import { Button } from '@/app/ui/button';
import { ToasterComponent } from '@/app/ui/toaster/ToasterComponent';
import { createTimer, sentRecoverPasswordCode } from '@/app/utils/actions';
import { ArrowRightIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ZodIssue } from 'zod';

export default function GetEmailComponent({ nextStep, setEmail }: any) {
  const [errors, setErrors] = useState<any>([]);
  const handleSendEmail = async (e: any) => {
    try {
      e.preventDefault();
      setErrors([]);
      const result = await sentRecoverPasswordCode(e.target.email.value);
      if (result?.error) {
        setErrors(result.errors);
      } else {
        toast.success(
          'Se ha enviado su código de verificación con éxito. Por favor, revise su correo.',
        );
        await createTimer(3000);
        setEmail(e.target.email.value);
        nextStep(2);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <div className="mt-2">
      <form className="flex flex-col items-center" onSubmit={handleSendEmail}>
        <div className="w-[90%] md:w-[65%]">
          <label
            className="mb-3 mt-5 block text-lg font-medium text-gray-900 "
            htmlFor="email"
          >
            Por favor ingrese el email al cual le enviaremos el codigo de de
            verificacion para recuperar su contraseña
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              name="email"
              placeholder="ejemplo@gmail.com"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
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
