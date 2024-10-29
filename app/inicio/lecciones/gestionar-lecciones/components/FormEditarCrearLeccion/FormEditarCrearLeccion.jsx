import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import React from 'react';

const diasDeLaSemana = [
  { label: 'Lunes', value: 'Lunes' },
  { label: 'Martes', value: 'Martes' },
  { label: 'Miércoles', value: 'Miércoles' },
  { label: 'Jueves', value: 'Jueves' },
  { label: 'Viernes', value: 'Viernes' },
  { label: 'Sábado', value: 'Sábado' },
  { label: 'Domingo', value: 'Domingo' },
];

export const FormEditarCrearLeccion = ({
  onChange,
  value,
  categorias,
  disciplina,
  profesores,
  diasDeLaSemana,
}) => {
  return (
    <section className=" flex w-full flex-col md:flex-row md:justify-evenly">
      <div className="w-full md:w-[40%]">
        <InputWithLabel
          label="Nombre"
          name={'nombre'}
          value={value?.Nombre}
          type="text"
          onChange={(e) => {
            onChange((current) => ({ ...current, Nombre: e.target.value }));
          }}
        />
        <InputWithLabel
          label="Cantidad Maxima"
          name={'CantMaxima'}
          type="number"
          min={1}
          value={value?.CantMaxima}
          onChange={(e) => {
            onChange((current) => ({ ...current, CantMaxima: e.target.value }));
          }}
        />
        <InputWithLabel
          label="Lugar"
          name={'Lugar'}
          value={value?.Lugar}
          type="text"
          onChange={(e) => {
            onChange((current) => ({ ...current, Lugar: e.target.value }));
          }}
        />
        <InputWithLabel
          label="Hora Inicio"
          name={'HoraInicio'}
          value={value?.HoraInicio}
          type="time"
          onChange={(e) => {
            onChange((current) => ({ ...current, HoraInicio: e.target.value }));
          }}
        />

        <InputWithLabel
          label="Hora Fin"
          name={'HoraFin'}
          value={value?.HoraFin}
          type="time"
          onChange={(e) => {
            onChange((current) => ({ ...current, HoraFin: e.target.value }));
          }}
        />
      </div>
      <div className="w-full md:w-[40%]">
        <SelectWithLabel
          name="categiria"
          label="Categoria"
          options={categorias}
          value={value?.Categoria}
          onChange={(seleccion) => {
            onChange((current) => ({ ...current, Categoria: seleccion }));
          }}
        />
        <SelectWithLabel
          name="dias"
          label="Dias de la semana"
          options={diasDeLaSemana}
          value={value?.DiasDeLaSemana}
          isMulti
          onChange={(seleccion) => {
            onChange((current) => ({ ...current, DiasDeLaSemana: seleccion }));
          }}
        />
        <SelectWithLabel
          name="disciplinas"
          label="Profesor"
          options={profesores}
          value={value?.Profesor}
          onChange={(seleccion) => {
            onChange((current) => ({ ...current, Profesor: seleccion }));
          }}
        />
        <SelectWithLabel
          name="profesores"
          label="Disciplina"
          options={disciplina}
          value={value?.Disciplina}
          onChange={(seleccion) => {
            onChange((current) => ({ ...current, Disciplina: seleccion }));
          }}
        />
        <label
          className="mb-3 mt-5 block text-lg font-medium text-gray-900"
          htmlFor={'descripcion'}
        >
          Descripcion
          <textarea
            name="Descripcion"
            rows="7"
            cols="50"
            className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            value={value?.Descripcion}
            type="text"
            onChange={(e) => {
              onChange((current) => ({
                ...current,
                Descripcion: e.target.value,
              }));
            }}
          />
        </label>
      </div>
    </section>
  );
};
