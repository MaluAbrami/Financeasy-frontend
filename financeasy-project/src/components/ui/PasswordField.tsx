import { forwardRef, useState } from "react";

type Props = {
    label: string;
    placeholder?: string;
    error?: string;
    autoComplete?: string;
} & React.HtmlHTMLAttributes<HTMLInputElement>;

export const PasswordField = forwardRef<HTMLInputElement, Props>(
  ({ label, placeholder, error, autoComplete, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{label}</label>

        <div
          className={`h-11 rounded-xl border bg-bg px-4 flex items-center gap-3 transition
            ${error ? "border-error" : "border-muted"}
            focus-within:border-primary`}
        >
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="w-full bg-transparent text-sm outline-none"
            {...rest}
          />

          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-xs text-text-muted hover:text-text transition"
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";