import type React from "react";
import { forwardRef } from "react";

type Props = {
    label: string;
    type?: string;
    placeHolder?: string;
    error?: string;
    autoComplete?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, type = "text", placeholder, error, autoComplete, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {label}
        </label>

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`h-11 rounded-xl border bg-bg px-4 text-sm outline-none transition
            ${error ? "border-error" : "border-muted"}
            focus:border-primary`}
          {...rest}
        />

        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";