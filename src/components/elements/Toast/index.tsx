interface ToastProps {
  toastMessage?: string;
}

export const Toast = ({ toastMessage }: ToastProps) => {
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="rounded-lg bg-black/90 px-4 py-2 text-sm text-white">{toastMessage}</div>
    </div>
  );
};
