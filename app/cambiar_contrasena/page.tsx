'use client';

import { useMemo, useState } from 'react';
import GetEmailComponent from './viewComponents/GetEmailComponent';
import GetVerificationCode from './viewComponents/GetVerificationCode';
import ChangePassword from './viewComponents/ChangePassword';

export default function Page() {
  const [selectedStep, setSelectedStep] = useState(1);
  const [email, setEmail] = useState('');
  const [validCode, setValidCode] = useState('');
  const steps = useMemo(() => {
    switch (selectedStep) {
      case 1:
        return (
          <GetEmailComponent nextStep={setSelectedStep} setEmail={setEmail} />
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
  return (
    <section>
      <div className="mt-6 self-start px-9 text-3xl font-bold">
        Cambiar contraseña
      </div>
      <section>{steps}</section>
    </section>
  );
}
