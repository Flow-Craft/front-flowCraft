'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// HOC para proteger rutas basadas en permisos
const withAuthorization = (WrappedComponent, permisoRequerido) => {
  return () => {
    const router = useRouter();

    useEffect(() => {
      const permisos = JSON.parse(
        window?.localStorage?.getItem('permisos') || '[]',
      );
      const tienePermiso = permisos.some(
        (permiso) => permiso.nombrePermiso === permisoRequerido,
      );

      if (!tienePermiso) {
        router.push('/inicio/noticias');
      }
    }, [router]);

    return <WrappedComponent />;
  };
};

export default withAuthorization;
