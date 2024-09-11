'use client';

import { Button } from '@/app/ui/button';
import {
  createTimer,
  sentRecoverPasswordCode,
  verifyRecorveryCode,
} from '@/app/utils/actions';
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ZodIssue } from 'zod';

export default function GetVerificationCode({
  email,
  setValidCode,
  nextStep,
}: any) {
  const [timeLeft, setTimeLeft] = useState(180); // 180 segundos = 3 minutos
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>([]);

  const reSendCode = async (e: any) => {
    try {
      e.preventDefault();
      await sentRecoverPasswordCode(email);
      toast.success(
        'Hemos enviado el codigo nuevamente . Por favor, revise su correo. Pssss.. no te olvides de la casilla de spam',
        {
          duration: 7000,
        },
      );
      setTimerFinished(false);
      setTimeLeft(180);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const verifyCode = async (e: any) => {
    e.preventDefault();
    setErrors([]);
    const result = await verifyRecorveryCode(e.target.code.value, email);
    if (result?.error) {
      setErrors(result.errors);
    } else {
      toast.success('Codigo correcto!');
      await createTimer(2000);
      setValidCode(e.target.code.value);
      nextStep(3);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Detenemos el timer cuando llega a 0
          setTimerFinished(true); // Indicamos que el tiempo terminó
          return 0;
        }
        return prevTime - 1; // Restamos 1 segundo
      });
    }, 1000);

    return () => clearInterval(timer); // Limpiamos el timer cuando el componente se desmonta
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return; // Evitamos crear un nuevo timer si el tiempo es 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Detenemos el timer cuando llega a 0
          setTimerFinished(true); // Indicamos que el tiempo terminó
          return 0;
        }
        return prevTime - 1; // Restamos 1 segundo
      });
    }, 1000);

    // Limpiamos el intervalo cuando el componente se desmonta o cambia `timeLeft`
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="mt-2">
      <form className="flex flex-col items-center" onSubmit={verifyCode}>
        <div className="w-[90%] md:w-[65%]">
          <label
            className="mb-3 mt-5 block text-lg font-medium text-gray-900 "
            htmlFor="code"
          >
            Por favor ingrese su codigo de verificacion
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="code"
              name="code"
              placeholder="777235"
              type="number"
            />
            <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <Button className="mt-4 w-full bg-blue-600 text-lg">
            Verificar Codigo{' '}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <div className="mt-4 flex flex-col items-end">
            <p>{`¿No recibiste tu codigo? Prueba intentarlo ${!timerFinished ? 'nuevamente en' : 'ahora mismo!!'}`}</p>
            {!timerFinished ? (
              <p>{formatTime(timeLeft)}</p>
            ) : (
              <button className=" hover:text-blue-600" onClick={reSendCode}>
                {' '}
                Enviar nuevamente
              </button>
            )}
          </div>
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
      </form>
    </div>
  );
}
