'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MenuPrincipal from './ui/menuPrincipal/menuPrincipal';
import { getNewsAction } from './utils/actions';
import { ShareInSocialMedia } from './ui/components/ShareInSocialMedia/ShareInSocialMedia';
import { FlowCard } from './ui/components/FlowCard/FlowCard';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [news, setNews] = useState([]);
  const router = useRouter();
  const getNews = useCallback(async () => {
    const result: any = await getNewsAction();
    setNews(result);
  }, []);

  const handleNew = useCallback((newId: number) => {
    router.push(`/noticia/${newId}`);
  }, []);
  const cardHeader = useCallback(
    (nw: any) => {
      return (
        <section className="relative">
          <section className="absolute right-0 top-0 z-10">
            <ShareInSocialMedia newID={nw.id} />
          </section>
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

  const CardMap = useCallback(
    (nw: any) => {
      return <FlowCard CardHeaderContent={cardHeader(nw)} />;
    },
    [news],
  );

  useEffect(() => {
    getNews();
  }, []);
  return (
    <main className="flex min-h-screen flex-col p-2">
      <MenuPrincipal />
      <div className="mt-6 self-start px-9 text-3xl font-bold">Noticias</div>
      <div className="mt-4 flex grow flex-col gap-4  p-7 md:flex-row">
        {news.map((nw: any) => {
          return (
            <div className="cursor-pointer" key={nw.id}>
              {CardMap(nw)}
            </div>
          );
        })}
      </div>
    </main>
  );
}
