import React, { useEffect } from 'react';

export const FormDetallePartido = ({ partido, handleSuspenderPartido }) => {
  return (
    <section className="flex w-full flex-wrap gap-4">
      <div>
        <div className="min-w-[300px] flex-1 p-6 ">
          <h2 className="text-xl font-bold">Equipo Local</h2>
          <ul>
            {partido?.local?.equipo?.equipoUsuarios.map((user) => {
              return (
                <li key={user.id}>
                  {user?.numCamiseta} - {user.usuario?.nombre}{' '}
                  {user.usuario?.apellido}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="min-w-[300px] flex-1  p-6 ">
        <h2 className="text-xl font-bold">Equipo Local</h2>
        <ul>
          {partido?.visitante?.equipo?.equipoUsuarios.map((user) => {
            return (
              <li key={user.id}>
                {user?.numCamiseta} - {user.usuario?.nombre}{' '}
                {user.usuario?.apellido}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="min-w-[300px] flex-1 p-6 ">
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
          {partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado !==
          'Suspendido' ? (
            <button
              className="mt-8 rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
              type="button"
              onClick={() => {
                handleSuspenderPartido();
              }}
            >
              Suspender Partido
            </button>
          ) : (
            <span className="mt-7 text-xl font-bold">
              {partido?.historialEventoList?.[0]?.detalleCambioEstado}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
