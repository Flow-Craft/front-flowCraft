import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';

export const FormModal = ({ errors, newToEdit = null }) => {
  return (
    <section>
      <InputWithLabel
        name={'titulo'}
        type="text"
        label="Título de la noticia"
        required
        wrong={!!errors.find((e) => e.path[0] === 'titulo')}
        defaultValue={newToEdit?.titulo}
      />
      <InputWithLabel
        name={'imagenDeLaNoticia'}
        type="file"
        label="Imagen de la noticia"
        wrong={!!errors.find((e) => e.path[0] === 'foto')}
        required
      />
      <InputWithLabel
        name={'fechaInicio'}
        type="date"
        label="Fecha Inicio"
        wrong={!!errors.find((e) => e.path[0] === 'fechaInicio')}
        min={!newToEdit ? new Date().toISOString().split('T')[0] : undefined}
        defaultValue={newToEdit?.fechaInicio?.split('T')[0]}
        required
      />
      <InputWithLabel
        name={'fechaFin'}
        type="date"
        label="Fecha Fin"
        min={!newToEdit ? new Date().toISOString().split('T')[0] : undefined}
        wrong={!!errors.find((e) => e.path[0] === 'fechaFin')}
        defaultValue={newToEdit?.fechaFin?.split('T')[0]}
        required
      />
      <label
        className="mb-3 mt-5 block text-lg font-medium text-gray-900"
        htmlFor={'descripcion'}
      >
        Descripción
        <label className="text-red-600"> *</label>
        <textarea
          name="descripcion"
          rows="5"
          cols="50"
          defaultValue={newToEdit?.descripcion}
          className={`w-full ${!!errors.find((e) => e.path[0] === 'descripcion') ? 'border-red-600' : 'border-gray-200'}  resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
        />
      </label>
      {errors &&
        errors.map((error) => (
          <p
            className="mt-1 text-sm font-bold text-red-500"
            key={error.message}
          >
            {error.message}
          </p>
        ))}
    </section>
  );
};

export default FormModal;
