'use client';
import React, { useCallback, useEffect, useState } from 'react';
import MenuPrincipal from './ui/menuPrincipal/menuPrincipal';
import { getNewsAction } from './utils/actions';
import { ShareInSocialMedia } from './ui/components/ShareInSocialMedia/ShareInSocialMedia';

export default function Page() {
  const [news, setNews] = useState([]);
  const getNews = useCallback(async () => {
    const result: any = await getNewsAction();
    console.log(result);
    setNews(result);
  }, []);

  useEffect(() => {
    getNews();
  }, []);
  return (
    <main className="flex min-h-screen flex-col p-2">
      <MenuPrincipal />
      <div className="mt-6 self-start px-9 text-3xl font-bold">Noticias</div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <ShareInSocialMedia newID={123} />
        ACA VAN A IR NOTICIAS PERO POR EL MOMENTO FLOWCRAFT EL QUE LEE
      </div>
    </main>
  );
}
