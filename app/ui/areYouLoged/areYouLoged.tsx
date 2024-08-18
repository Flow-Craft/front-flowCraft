'use client';
import { checkJWT } from '@/app/utils/actions';
import { useEffect, useState } from 'react';

export default function AreYouLogued() {
  useEffect(() => {
    checkJWT();
  }, []);
  return <></>;
}
