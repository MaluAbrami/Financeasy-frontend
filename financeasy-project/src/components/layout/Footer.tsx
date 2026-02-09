export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground">
                F
              </div>

              <div>
                <p className="text-lg font-semibold leading-none text-foreground">Financeasy</p>
                <p className="text-sm text-muted-foreground">Controle financeiro pessoal</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              Organize contas e cartões, registre transações e acompanhe análises e simulações
              para ter clareza e controle real do seu dinheiro.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {["Instagram", "LinkedIn", "GitHub"].map((t) => (
                <a
                  key={t}
                  href="#"
                  className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Produto</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Como funciona", "Funcionalidades", "Simulações", "Preços"].map((t) => (
                <li key={t}>
                  <a className="hover:text-foreground transition" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Suporte</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Central de ajuda", "Contato", "Status do sistema", "FAQ"].map((t) => (
                <li key={t}>
                  <a className="hover:text-foreground transition" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">© {year} Financeasy. Todos os direitos reservados.</p>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {["Termos de uso", "Política de privacidade", "Cookies"].map((t) => (
              <a key={t} className="hover:text-foreground transition" href="#">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
