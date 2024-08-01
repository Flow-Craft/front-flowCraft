"use client"
import { checkJWT } from '@/app/lib/actions';
import { useEffect, useState } from 'react';

export default function AreYouLogued() {
  const [pathName, setPathName] = useState(window.location.pathname)
  useEffect(() => {
    checkJWT()
  }, [pathName]);
  return (
    <>
    </>
  );
}
