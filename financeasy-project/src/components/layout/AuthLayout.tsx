import type { ReactNode } from "react";

type Props = {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-14 bg-background">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}