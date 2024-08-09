'use client';
import { checkJWT } from '@/app/lib/actions';
import { useEffect, useState } from 'react';

export default function AreYouLogued() {
  useEffect(() => {
    checkJWT();
  }, []);
  return <></>;
}
