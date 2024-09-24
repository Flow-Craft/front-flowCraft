'use client';
import React, { useEffect } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export const ChangePasswordLogin = ({ errors  }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <div className="mt-2">
      <div className="flex flex-col items-center">
        <div className="w-[90%] md:w-[65%]">
          <InputWithLabel
            label="Contraseña"
            name="Contrasena"
            type={showPassword ? 'text' : 'password'}
            required
            onClickIcon={() => {
              setShowPassword(!showPassword);
            }}
            Icon={showPassword ? EyeIcon : EyeSlashIcon}
          />
          <InputWithLabel
            label=" Confirmar Contraseña"
            name="OtraContrasena"
            type={showConfirmPassword ? 'text' : 'password'}
            Icon={showConfirmPassword ? EyeIcon : EyeSlashIcon}
            onClickIcon={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            required
          />
          <div className="mt-9 flex w-full content-between justify-between">
            <div aria-live="polite" aria-atomic="true" className="mr-4">
              {errors &&
                errors.map((error) => (
                  <p
                    className="mt-2 text-sm font-bold text-red-500"
                    key={error.message}
                  >
                    {error.message}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
