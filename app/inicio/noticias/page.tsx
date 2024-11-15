'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { FlowCard } from '@/app/ui/components/FlowCard/FlowCard';
import { ShareInSocialMedia } from '@/app/ui/components/ShareInSocialMedia/ShareInSocialMedia';
import {
  createNew,
  deleteNewAction,
  editNew,
  getNewsAction,
} from '@/app/utils/actions';
import { AUTORIZATION_KEY } from '@/app/utils/const';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { Button } from '@/app/ui/button';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import toast, { Toaster } from 'react-hot-toast';
import FormModal from './formModal/formModal';
import { ZodIssue } from 'zod';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import usePermisos from '@/app/utils/permisos';

export default function Page() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [newToEdit, setNewToEdit] = useState<any>(null);
  const [newToDelete, setNewToDelete] = useState<any>(null);
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Noticias');

  const tituloRef = useRef<any>(null);
  const fechaInicioRef = useRef<any>(null);
  const fechaFinRef = useRef<any>(null);
  const router = useRouter();
  const getNews = useCallback(async () => {
    const result: any = await getNewsAction();
    setNews(result);
    setFilteredNews(result);
  }, []);
  const handleClearFilters = () => {
    if (tituloRef.current) tituloRef.current.value = '';
    if (fechaInicioRef.current) fechaInicioRef.current.value = '';
    if (fechaFinRef.current) fechaFinRef.current.value = '';
    setFilteredNews(news); // Restaura todas las noticias
  };

  const handleNew = useCallback((newId: number) => {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    router.push(token ? `/inicio/noticia/${newId}` : `/noticia/${newId}`);
  }, []);
  const cardHeader = useCallback(
    (nw: any, edit = (id: any) => {}, allowDel = (id: any) => {}) => {
      console.log('permisos', permisos);
      return (
        <section className="relative">
          <section className="absolute right-0 top-0 z-20">
            <ShareInSocialMedia newID={nw.id} />
          </section>
          {edit &&
            permisos.some(
              (perm: any) => perm.funcionalidades === 'ABM noticia',
            ) && (
              <section className="relative bg-slate-400">
                <div className="absolute bottom-[-40px] right-11 flex items-center justify-center rounded-full bg-gray-600 p-2">
                  <PencilIcon
                    className="h-[24px] w-[24px] cursor-pointer text-white"
                    onClick={() => {
                      edit(nw.id);
                    }}
                  />
                </div>
              </section>
            )}
          {allowDel &&
            permisos.some(
              (perm: any) => perm.funcionalidades === 'ABM noticia',
            ) && (
              <section className="relative bg-slate-400">
                <div className="absolute bottom-[-40px] left-0 flex items-center justify-center rounded-full bg-gray-600 p-2">
                  <TrashIcon
                    className="h-[24px] w-[24px] cursor-pointer text-white"
                    onClick={() => {
                      allowDel(nw.id);
                    }}
                  />
                </div>
              </section>
            )}
          <section
            onClick={() => {
              handleNew(nw.id);
            }}
          >
            <img
              src={`data:image/png;base64,${nw.imagen}`}
              alt="My Decoded Image"
            />
            <h4 className="p-4 text-4xl font-bold">{nw.titulo}</h4>
          </section>
        </section>
      );
    },
    [news],
  );

  const onEditNew = (e: any) => {
    const newToEdit = news.find((nw: any) => nw.id === e);
    setNewToEdit(newToEdit);
    setFirst(true);
  };

  const onDeleteNew = (e: any) => {
    setNewToDelete(e);
    setSecond(true);
  };

  const deleteNew = async () => {
    try {
      await deleteNewAction(newToDelete);
      toast.success('éxito');
      setSecond(false);
      setNewToDelete(null);
      getNews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const CardMap = useCallback(
    (nw: any) => {
      return (
        <FlowCard CardHeaderContent={cardHeader(nw, onEditNew, onDeleteNew)} />
      );
    },
    [news, permisos],
  );

  const EditNew = async (e: any) => {
    try {
      const fechaInicio = e.target.fechaInicio.value
        ? e.target.fechaInicio.value
        : newToEdit.fechaInicio;
      const fechaFin = e.target.fechaFin.value
        ? e.target.fechaFin.value
        : newToEdit.fechaFin;
      await editNew({
        ...newToEdit,
        id: newToEdit.id,
        titulo: e.target.titulo.value,
        foto: e.target.imagenDeLaNoticia.files[0] || newToEdit.imagen,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        descripcion: e.target.descripcion.value,
      });
      toast.success('Noticia editada con éxito');
      setNewToEdit({});
      setFirst(false);
      getNews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onCreateNew = async (e: any) => {
    try {
      const fechaInicio = e.target.fechaInicio.value
        ? new Date(e.target.fechaInicio.value)
        : null;
      const fechaFin = e.target.fechaFin.value
        ? new Date(e.target.fechaFin.value)
        : null;
      const result: any = await createNew({
        titulo: e.target.titulo.value,
        foto: e.target.imagenDeLaNoticia.files[0],
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        descripcion: e.target.descripcion.value,
      });
      if (result.error) {
        return setErrors(result.errors);
      }
      setErrors([]);
      toast.success('Noticia creada con éxito');
      getNews();
      setFirst(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  function filterNews(e: any) {
    e.preventDefault();
    const filterNews = news.filter((noticia: any) => {
      const coincideTitulo = e.target?.titulo?.value
        ? noticia.titulo
            .toLowerCase()
            .includes(e.target?.titulo?.value.toLowerCase())
        : true;

      const coincideFechaInicio = e.target?.fechaDesde?.value
        ? new Date(noticia.fechaInicio) >= new Date(e.target?.fechaDesde?.value)
        : true;

      const coincideFechaFin = e.target?.fechaHasta?.value
        ? new Date(noticia.fechaFin) <= new Date(e.target?.fechaHasta?.value)
        : true;

      return coincideTitulo && coincideFechaInicio && coincideFechaFin;
    });
    setFilteredNews(filterNews);
  }

  useEffect(() => {
    getNews();
  }, []);
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex w-full flex-row justify-between">
        <div className="mt-6 self-start px-9 text-3xl font-bold">Noticias</div>
        {permisos.some(
          (perm: any) => perm.funcionalidades === 'ABM noticia',
        ) && (
          <button
            className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            onClick={() => {
              setFirst(true);
            }}
          >
            Crear Noticia
          </button>
        )}
      </div>
      <form
        className="mt-5 flex w-full flex-row flex-wrap gap-3"
        onSubmit={filterNews}
      >
        <section className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Nombre:
          </label>
          <InputWithLabel name={'titulo'} type="text" ref={tituloRef} />
        </section>

        <section className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Fecha Desde:
          </label>
          <InputWithLabel
            name={'fechaInicio'}
            type="date"
            ref={fechaInicioRef}
          />
        </section>
        <section className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Fecha Hasta:
          </label>
          <InputWithLabel name={'fechaFin'} type="date" ref={fechaFinRef} />
        </section>

        <button
          className="ml-5 rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="submit"
        >
          Buscar
        </button>
        <button
          className="ml-5 rounded-lg bg-slate-400 p-2 text-center text-xl text-white"
          type="button"
          onClick={handleClearFilters}
        >
          Limpiar filtros
        </button>
      </form>
      <div className="mt-4 flex grow flex-col flex-wrap gap-4  p-7 md:flex-row">
        {filteredNews?.map((nw: any) => {
          return (
            <div className="cursor-pointer" key={nw.id}>
              {CardMap(nw)}
            </div>
          );
        })}
      </div>
      <FlowModal
        title="Noticia"
        modalBody={<FormModal errors={errors} newToEdit={newToEdit} />}
        primaryTextButton={newToEdit?.id ? 'Editar' : 'Crear'}
        isOpen={first}
        type="submit"
        scrollBehavior="outside"
        onAcceptModal={newToEdit?.id ? EditNew : onCreateNew}
        onCancelModal={() => {
          setFirst(false);
          setErrors([]);
          setNewToEdit({});
        }}
      />
      <FlowModal
        title="Noticia"
        modalBody={<>¿Está seguro que desea eliminar esta noticia</>}
        primaryTextButton={'Sí'}
        isOpen={second}
        scrollBehavior="outside"
        onAcceptModal={deleteNew}
        onCancelModal={() => {
          setSecond(false);
          setErrors([]);
          setNewToEdit({});
        }}
      />
      <Toaster />
    </main>
  );
}
