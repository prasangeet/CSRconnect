'use client';

import { Toaster as Sonner } from 'sonner';
import { useTheme } from 'next-themes';

export function CustomToaster({
  position = 'top-right',
  richColors = true,
  closeButton = true,
  ...props
}) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === 'dark' ? 'dark' : 'light'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-border group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:text-gray-50 rounded-xl",
          title: "group-[.toast]:text-gray-950 dark:group-[.toast]:text-gray-50 text-base font-medium",
          description: "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400 text-sm",
          actionButton: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-[#ff9ede] group-[.toast]:to-[#7b6dff] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-white group-[.toaster]:border-green-500 group-[.toaster]:text-green-600 dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:border-green-500 dark:group-[.toaster]:text-green-400",
          error: "group-[.toaster]:bg-white group-[.toaster]:border-red-500 group-[.toaster]:text-red-600 dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:border-red-500 dark:group-[.toaster]:text-red-400",
          info: "group-[.toaster]:bg-white group-[.toaster]:border-blue-500 group-[.toaster]:text-blue-600 dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:border-blue-500 dark:group-[.toaster]:text-blue-400",
          warning: "group-[.toaster]:bg-white group-[.toaster]:border-yellow-500 group-[.toaster]:text-yellow-600 dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:border-yellow-500 dark:group-[.toaster]:text-yellow-400",
          loader: "group-[.toast]:text-muted-foreground",
        },
      }}
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      {...props}
    />
  );
}   