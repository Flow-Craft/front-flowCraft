'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDisciplinasctionAction } from '../utils/actions';
import { FlowTags } from '../ui/components/flowTags/flowTags';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  const [disciplinas, setDisciplinas] = useState<any>([]);
  const getDisciplinas = useCallback(async () => {
    const result: any = await getDisciplinasctionAction();
    setDisciplinas(result);
  }, []);
  useEffect(() => {
    getDisciplinas();
  }, []);

  return (
    <>
      <div className="mt-6 self-start px-9 text-3xl font-bold">Disciplinas</div>
      <section className="flex flex-wrap gap-2 p-8">
        {disciplinas.map((dis: any) => {
          return (
            <div key={dis.id}>
              <FlowTags title={dis.nombre} />
            </div>
          );
        })}
      </section>
      <Toaster />
    </>
  );
}
