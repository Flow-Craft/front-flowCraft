'use client';
import { ShareInSocialMedia } from '@/app/ui/components/ShareInSocialMedia/ShareInSocialMedia';
import { getNewsByIdSimpatizante as getNewsByIdAction } from '@/app/utils/actions';
import { AUTORIZATION_KEY } from '@/app/utils/const';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [news, setNews] = useState({});
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const getNewByID = async (id) => {
    const result = await getNewsByIdAction(id);
    setNews(result);
  };
  useEffect(() => {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    if (!token) {
      router.push(`/noticia/${id}`);
    }
    getNewByID(id);
  }, [id]);
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 p-4">
      <img
        src={`data:image/png;base64,${news.imagen}`}
        alt="My Decoded Image"
      />
      <div className="flex items-end">
        <span className="mt-4 text-3xl font-bold">{news.titulo}</span>
        <div className="ml-8">
          <ShareInSocialMedia newID={news.id} />
        </div>
      </div>
      <section className="">
        {news?.['descripcion']?.split('\n').map((pf, index) => (
          <p key={index} className="mb-6">
            {pf}
          </p>
        ))}
      </section>
    </section>
  );
}
