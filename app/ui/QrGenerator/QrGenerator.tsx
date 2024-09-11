import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FlowModal } from '../components/FlowModal/FlowModal';

export const QrGenerator = ({
  label,
  userData,
}: {
  label: string;
  userData: any;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const bodyQr = (
    <section className="flex w-full justify-center">
      <QRCode
        value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        logoImage="/logoQr.jpeg"
        logoWidth={50}
        logoHeight={50}
        size={300}
        qrStyle="fluid"
        logoPaddingStyle="circle"
      />
    </section>
  );
  return (
    <div>
      <button
        className="flex cursor-pointer flex-col items-center"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <img className="h-20 w-20" src="/logoQr.jpeg" />
        <label className="font-bold text-blue-600">{label}</label>
      </button>
      <FlowModal
        title="Credencial del usuario"
        modalBody={bodyQr}
        isOpen={openModal}
        onAcceptModal={() => {
          setOpenModal(false);
        }}
        onCancelModal={() => {
          setOpenModal(false);
        }}
        secondaryTextButton=""
      />
    </div>
  );
};
