'use client';
import { LOCAL_STORAGE_NAME_KEY } from '@/app/lib/const';
import { useEffect, useState } from 'react';

export default function UserName() {
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName =
      window.localStorage.getItem(LOCAL_STORAGE_NAME_KEY) || '';
    setName(storedName);
  }, []);

  return (
    <>
      <div>{`Hola ${name}!!!`}</div>
      <div className="font-bold">Administrativo</div>
    </>
  );
}
