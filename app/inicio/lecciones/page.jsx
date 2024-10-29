'use client';

import withAuthorization from '@/app/utils/autorization';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  return (
    <section>
      <div className="w-100 flex flex-row items-center justify-between">
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Lecciones
        </div>
        <button
          className="h-[50px] rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          onClick={() => {
            router.push('/inicio/lecciones/gestionar-lecciones');
          }}
        >
          Gestionar Lecciones
        </button>
      </div>
      <section></section>
    </section>
  );
}

export default withAuthorization(Page, 'Lecciones');
