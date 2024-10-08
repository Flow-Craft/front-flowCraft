'use client';
import ChangePassword from '@/app/cambiar_contrasena/viewComponents/ChangePassword';
import GetVerificationCode from '@/app/cambiar_contrasena/viewComponents/GetVerificationCode';
import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  const [selectedStep, setSelectedStep] = useState(2);
  const [email, setEmail] = useState('');
  const [validCode, setValidCode] = useState('');

  const steps = useMemo(() => {
    switch (selectedStep) {
      case 1:
        return <div />;
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
    // Evita el envío si ya se ha enviado un email
    if (value) {
      setEmail(value);
    }
  }, []);
  return (
    <section>
      <div className="mt-6 self-start px-9 text-3xl font-bold">
        Cambiar contraseña
      </div>
      <section>{steps}</section>
      <Toaster />
    </section>
  );
}
