export interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function TextArea(props: TextAreaProps) {
  const { value = "", placeholder = "", onChange, className = "" } = props;

  return (
    <textarea
      className={`min-h-48 rounded-md border-2 border-gray-700 dark:border-gray-300 focus:outline-none dark:bg-gray-600 dark:text-slate-50 p-2 pb-0 w-full h-full ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></textarea>
  );
}
