import React from 'react';

const SkeletonProfile = () => {
  return (
    <div className="flex min-h-screen w-full animate-pulse flex-col items-center justify-center p-6 rtl:space-x-reverse">
      {/* Skeleton para los botones superiores */}
      <div className="mb-6 flex w-full justify-between">
        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300"></div>
        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300"></div>
      </div>

      {/* Skeleton de la imagen */}
      <div className="mb-6 h-[240px] w-full max-w-lg animate-pulse rounded-md bg-gray-300"></div>

      {/* Skeleton del nombre */}
      <div className="mb-4 h-6 w-48 animate-pulse rounded-md bg-gray-300"></div>

      {/* Skeleton de las etiquetas de información */}
      <div className="mb-4 flex w-full max-w-lg flex-col justify-between gap-6 md:flex-row">
        <div className="flex w-full flex-col gap-2 md:w-[45%]">
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-[45%]">
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
          <div className="h-4 animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </div>

      {/* Skeleton de los botones inferiores */}
      <div className="flex w-full max-w-lg justify-center gap-3">
        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300"></div>
        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
