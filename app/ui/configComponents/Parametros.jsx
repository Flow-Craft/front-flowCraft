'use client';
import { getTyCToBack } from '@/app/utils/actions';
import React, { useState } from 'react';
import { FlowModal } from '../components/FlowModal/FlowModal';

export const ParametrosTab = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openTerminosYcondiciones, setOpenTerminosYcondiciones] =
    useState(false);
  const [terminosYCondicionesAnteriores, setTerminosYCondicionesAnteriores] =
    useState('');
  const [nuevosTerminosYCondiciones, setNuevosTerminosYCondiciones] =
    useState('');
  const [terminosYcondicionesEjemplo, setTerminosYcondicionesEjemplo] =
    useState(null);
  const handleChangeTerminosYCondiciones = async () => {
    const result = await getTyCToBack();
    setTerminosYCondicionesAnteriores(result?.['tyc']);
  };
  const getTerminosYcondiciones = async () => {
    const result = await getTyCToBack();
    setOpenTerminosYcondiciones(true);
    setTerminosYcondicionesEjemplo(
      <div>
        {nuevosTerminosYCondiciones?.['tyc'].split('\n').map((pf, index) => (
          <p key={index} className="mb-6">
            {pf}
          </p>
        ))}
      </div>,
    );
  };
  return (
    <>
      <section className="flex w-full justify-between">
        <button
          className="mt-7 rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            handleChangeTerminosYCondiciones();
            setOpenModal(true);
          }}
        >
          Actualizar terminos y condiciones
        </button>
        <button
          className="mt-7 rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            getTerminosYcondiciones();
          }}
        >
          Ver terminos y condiciones
        </button>
      </section>
      <FlowModal
        title="Debe aceptar los nuevos terminos y condiciones"
        isOpen={openModal}
        size="full"
        modalBody={
          <>
            <label
              className="mb-3 mt-5 block text-lg font-medium text-gray-900"
              htmlFor={'descripcion'}
            >
              Descripcion
              <textarea
                name="Descripcion"
                rows="20"
                cols="50"
                defaultValue={terminosYCondicionesAnteriores}
                value={nuevosTerminosYCondiciones}
                onChange={(e) => {
                  setNuevosTerminosYCondiciones(e.target.value);
                }}
                className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
              />
            </label>
          </>
        }
        onAcceptModal={() => {
          setOpenModal(false);
        }}
        onCancelModal={() => {
          setOpenModal(false);
        }}
        primaryTextButton="Aceptar terminos y condiciones"
      />

      <FlowModal
        title="Debe aceptar los nuevos terminos y condiciones"
        isOpen={openTerminosYcondiciones}
        modalBody={terminosYcondicionesEjemplo}
        onAcceptModal={() => {
          setOpenTerminosYcondiciones(false);
        }}
        onCancelModal={() => {
          setOpenTerminosYcondiciones(false);
        }}
        primaryTextButton="Aceptar terminos y condiciones"
      />
    </>
  );
};
