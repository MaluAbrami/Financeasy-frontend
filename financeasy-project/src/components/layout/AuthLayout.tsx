import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function AuthLayout({title, subtitle, children}: Props) {
    return (
        <>
            <Header/>
            <main className="bg-bg">
                <section className="mx-auto max-w-6xl py-16">
                    <div className="mx-auto max-w-md bg-surface shadow rounded-2xl p-8">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {subtitle && <p className="mt-2 text-sm text-text-muted">{subtitle}</p>}
                        <div className="mt-6">
                            {children}
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}