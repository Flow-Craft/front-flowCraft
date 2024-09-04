'use client';
import { ShareInSocialMedia } from '@/app/ui/components/ShareInSocialMedia/ShareInSocialMedia';
import { getNewsByIdSimpatizante as getNewsByIdAction } from '@/app/utils/actions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [news, setNews] = useState<any>({})
  const params = useParams();
  const { id } = params;
  const getNewByID = async (id: any) => {
    const result = await getNewsByIdAction(id);
    setNews(result);
  };
  useEffect(() => {
    getNewByID(id);
  }, [id]);
  return (<section className="flex flex-col items-center justify-center w-full p-4">
        <section className="relative">
          <section className="absolute right-0 top-0 z-10">
            <ShareInSocialMedia newID={news.id} />
          </section>
          <img
              src={`data:image/png;base64,${news.imagen}`}
              alt="My Decoded Image"
          />
      </section>
    <h2>Item 1</h2>
    <h2>Item 1</h2>
  </section>);
}
