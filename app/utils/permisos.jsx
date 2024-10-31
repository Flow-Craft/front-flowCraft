import { useState, useEffect, useCallback } from 'react';

const usePermisos = () => {
  const [permisos, setPermisos] = useState({});

  useEffect(() => {
    // Cargar permisos desde el local storage
    const storedPermisos = localStorage.getItem('permisos');
    if (storedPermisos) {
      const permisosArray = JSON.parse(storedPermisos);

      // Transformar la lista de permisos en un objeto con nombrePermiso como clave y funcionalidades como valor
      const permisosObj = permisosArray.reduce((acc, permiso) => {
        if (!acc[permiso.nombrePermiso]) {
          acc[permiso.nombrePermiso] = [];
        }
        acc[permiso.nombrePermiso].push({
          modulo: permiso.modulo,
          funcionalidades: permiso.funcionalidades,
        });
        return acc;
      }, {});

      setPermisos(permisosObj);
    }
  }, []);

  // Función para obtener perfiles específicos según el nombre de permiso
  const getPermisosByNombre = useCallback(
    (nombrePermiso) => {
      return permisos[nombrePermiso] || [];
    },
    [permisos],
  );

  return { permisos, getPermisosByNombre };
};

export default usePermisos;
