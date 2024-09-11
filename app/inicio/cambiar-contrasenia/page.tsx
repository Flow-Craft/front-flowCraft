'use client';
import ChangePassword from '@/app/cambiar_contrasena/viewComponents/ChangePassword';
import GetVerificationCode from '@/app/cambiar_contrasena/viewComponents/GetVerificationCode';
import { createTimer, sentRecoverPasswordCode } from '@/app/utils/actions';
import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const [selectedStep, setSelectedStep] = useState(1);
  const [email, setEmail] = useState('');
  const [validCode, setValidCode] = useState('');
  const handleSendEmail = async () => {
    try {
      await sentRecoverPasswordCode(email);
      toast.success(
        'Se ha enviado su código de verificación con éxito. Por favor, revise su correo.',
      );
      await createTimer(3000);
      setSelectedStep(2);
    } catch (e: any) {
      console.error(e.message);
    }
  };
  const steps = useMemo(() => {
    switch (selectedStep) {
      case 1:
        return (
          <div>
            <Toaster />
          </div>
        );
      case 2:
        return (
          <GetVerificationCode
            email={email}
            setValidCode={setValidCode}
            nextStep={setSelectedStep}
          />
        );
      default:
        return <ChangePassword email={email} code={validCode} />;
    }
  }, [selectedStep]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const value = queryParams.get('email');
    if (value) {
      setEmail(value);
      handleSendEmail();
    }
  }, []);
  return (
    <section>
      <div className="mt-6 self-start px-9 text-3xl font-bold">
        Cambiar contraseña
      </div>
      <section>{steps}</section>
    </section>
  );
}
