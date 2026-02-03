type Props = {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeHolder?: string;
    error?: string;
    autoComplete?: string;
}

export function TextField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeHolder,
    error,
    autoComplete
} : Props) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor={name}>
                {label}
            </label>

            <input 
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeHolder}
                autoComplete={autoComplete}
                className={`h-11 rounded-x1 border bg-bg px-4 text-sm outline-none transition
                    ${error? "border-error" : "border-muted"}
                    focus:border-primary
                `} 
            />

            {error && <p className="text-xs text-error">{error}</p>} 
        </div>
    );
}