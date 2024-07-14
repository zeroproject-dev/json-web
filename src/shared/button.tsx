export interface ButtonProps {
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  const { onClick, children } = props;
  return (
    <button
      type="button"
      className="bg-gray-300 dark:bg-gray-700 dark:text-slate-50 h-full px-4 py-2 rounded-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
