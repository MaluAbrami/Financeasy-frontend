export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-muted bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* TOP */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand (span 2) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold">
                F
              </div>

              <div>
                <p className="text-lg font-semibold leading-none">Financeasy</p>
                <p className="text-sm text-text-muted">Controle financeiro pessoal</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm text-text-muted leading-relaxed">
              Organize contas e cartões, registre transações e acompanhe análises e simulações
              para ter clareza e controle real do seu dinheiro.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-lg border border-muted px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-muted transition"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="#"
                className="rounded-lg border border-muted px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-muted transition"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="rounded-lg border border-muted px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-muted transition"
                aria-label="GitHub"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <p className="text-sm font-semibold">Produto</p>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>
                <a className="hover:text-text transition" href="#como-funciona">
                  Como funciona
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  Simulações
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  Preços
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <p className="text-sm font-semibold">Suporte</p>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>
                <a className="hover:text-text transition" href="#">
                  Central de ajuda
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  Contato
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  Status do sistema
                </a>
              </li>
              <li>
                <a className="hover:text-text transition" href="#">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM (fora do grid) */}
        <div className="mt-12 flex flex-col gap-4 border-t border-muted pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-text-muted">
            © {year} Financeasy. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            <a className="hover:text-text transition" href="#">
              Termos de uso
            </a>
            <a className="hover:text-text transition" href="#">
              Política de privacidade
            </a>
            <a className="hover:text-text transition" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
