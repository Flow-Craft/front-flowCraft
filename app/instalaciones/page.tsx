'use client';
import { useCallback, useEffect, useState } from 'react';
import { getInstalacionesAction } from '../utils/actions';
import { FlowTags } from '../ui/components/flowTags/flowTags';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  const [instalaciones, setInstalaciones] = useState<any>([]);
  const getInstaciones = useCallback(async () => {
    const result: any = await getInstalacionesAction();
    setInstalaciones(result);
  }, []);
  const getDescription = useCallback(
    (ins: any) => {
      return (
        <section className="flex flex-row  gap-3">
          <span>*{ins.ubicacion}</span>
          <span> </span>
          <span>*{ins.precio}$</span>
        </section>
      );
    },
    [instalaciones],
  );
  useEffect(() => {
    getInstaciones();
  }, []);

  return (
    <>
      <div className="mt-6 self-start px-9 text-3xl font-bold">
        Instalaciones
      </div>
      <section className="flex flex-wrap gap-2 p-8">
        {instalaciones.map((ins: any) => {
          return (
            <div key={ins.id}>
              <FlowTags title={ins.nombre} description={getDescription(ins)} />
            </div>
          );
        })}
      </section>
      <Toaster />
    </>
  );
}
