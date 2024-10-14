import React, { useEffect } from 'react';

export const FormDetallePartido = ({ partido }) => {
  useEffect(() => {
    console.log('partido', partido);
  }, [partido]);

  return (
    <section className="flex w-full flex-wrap gap-4">
      <div>
        <div className="min-w-[200px] flex-1 ">
          <h2 className="text-xl font-bold">Equipo Local</h2>
          <ul>
            {partido?.local?.equipo?.equipoUsuarios.map((user) => {
              return <li key={user.id}>{user?.numCamiseta} - {user.usuario?.nombre} {user.usuario?.apellido}</li>;
            })}
          </ul>
        </div>
      </div>
      <div className="min-w-[200px] flex-1 ">
        <h2 className="text-xl font-bold">Equipo Local</h2>
        <ul>
          {partido?.visitante?.equipo?.equipoUsuarios.map((user) => {
            return <li key={user.id}>{user?.numCamiseta} - {user.usuario?.nombre} {user.usuario?.apellido}</li>;
          })}
        </ul>
      </div>
      <div className="min-w-[200px] flex-1 ">
        <div>
          <span className="text-xl font-bold">Disciplina: </span>
          <span>{partido?.disciplinas?.[0]?.nombre}</span>
        </div>
        <div>
          <span className="text-xl font-bold">Categoria: </span>
          <span>
            {partido?.categoria?.nombre}-{partido?.categoria?.genero}
          </span>
        </div>
        <div>
          <span className="text-xl font-bold">Fecha de partido: </span>
          <span>{new Date(partido.fechaInicio).toLocaleDateString()}</span>
        </div>
        <div>
          <button
            className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
            type="button"
            onClick={() => {}}
          >
            Suspender Partido
          </button>
        </div>
      </div>
    </section>
  );
};
