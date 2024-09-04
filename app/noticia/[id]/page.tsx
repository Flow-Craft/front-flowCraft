'use client';
import { getNewsByIdSimpatizante as getNewsByIdAction } from '@/app/utils/actions';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function Page() {
  const params = useParams();
  const { id } = params;
  const getNewByID = async (id: any) => {
    const result = await getNewsByIdAction(id);
    console.log(result);
  };
  useEffect(() => {
    getNewByID(id);
  }, [id]);
  return <section className=""></section>;
}
