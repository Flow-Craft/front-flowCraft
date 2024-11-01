'use client';

import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [modalEliminarEvento, setModalEliminarEvento] = useState(false);
  const router = useRouter();
  return (
    <section>
      <section className="flex w-full flex-row justify-between">
        <div className="mt-3 self-start text-3xl font-bold">Crear Torneo</div>
        <button
          className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            router.push('/inicio/torneos/crear');
          }}
        >
          Crear Torneo
        </button>
      </section>

      <div className="mt-6 grid h-[80vh] w-full grid-rows-3 gap-4">
        <div className="flex items-center justify-center bg-blue-500 text-2xl text-white">
          Elemento 1
        </div>
        <div className="flex items-center justify-center bg-green-500 text-2xl text-white">
          Elemento 2
        </div>
        <div className="flex items-center justify-center bg-red-500 text-2xl text-white">
          Elemento 3
        </div>
      </div>
      <FlowModal
        title={`Seguro que desea eliminar el torneo:`}
        modalBody={<></>}
        primaryTextButton={'Si'}
        isOpen={modalEliminarEvento}
        scrollBehavior="outside"
        onAcceptModal={() => {}}
        onCancelModal={() => {
          setModalEliminarEvento(false);
        }}
      />
    </section>
  );
}
