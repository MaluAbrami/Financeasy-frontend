import { Header } from "../components/layout/Header";

export function Home() {
  return (
    <>
      <Header></Header>
      <section className="mx-auto max-w-6xl w-full px-6 py-16">
        <div className="bg-surface shadow rounded-2xl p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Controle suas finanças com simplicidade e clareza
              </h1>

              <p className="text-text-muted text-lg max-w-2xl">
                Cadastre contas e cartões, registre transações e acompanhe análises
                para enteder seus gastos e planejar seu futuro financeiro.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="btn btn-primary"> Comece já - é grátis</button>
              <button className="btn btn-secondary"><a href="#como-funciona">Ver como funciona</a></button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-surface p-5">
            <h3 className="font-semibold">Contas e cartões</h3>
            <p className="text-text-muted mt-2 text-sm">Centralize suas contas bancárias e cartões de crédito em um só lugar</p>
          </div>

          <div className="rounded-2xl bg-surface p-5">
            <h3 className="font-semibold">Transações completas</h3>
            <p className="text-text-muted mt-2 text-sm">Registre receitas e despesas e mantenha seu histórico sempre organizado.</p>
          </div>

          <div className="rounded-2xl bg-surface p-5">
            <h3 className="font-semibold">Análises inteligentes</h3>
            <p className="text-text-muted mt-2 text-sm">Entenda para onde seu dinheiro vai com resumos mensais e categorias.</p>
          </div>

          <div className="rounded-2xl bg-surface p-5">
            <h3 className="font-semibold">Simulação do futuro</h3>
            <p className="text-text-muted mt-2 text-sm">Projete seu saldo ao longo do tempo com base nos seus gastos mensais.</p>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-bold" id="como-funciona">Como funciona</h2>
          <p className="text-text-muted mt-2">Em poucos passos você organiza sua vida financeira e começa a ter clareza.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-secondary p-6">
              <span className="text-sm text-text-muted">01</span>
              <h3 className="mt-2 font-semibold">Cadastre contas e cartões</h3>
              <p className="text-text-muted mt-2 text-sm">Comece estruturando o que você já usa no dia a dia.</p>
            </div>

            <div className="rounded-xl border border-secondary p-6">
              <span className="text-sm text-text-muted">02</span>
              <h3 className="mt-2 font-semibold">Registre suas transações</h3>
              <p className="text-text-muted mt-2 text-sm">Adicione entradas e saídas para acompanhar o histórico.</p>
            </div>

            <div className="rounded-xl border border-secondary p-6">
              <span className="text-sm text-text-muted">03</span>
              <h3 className="mt-2 font-semibold">Acompanhe e simule</h3>
              <p className="text-text-muted mt-2 text-sm">Veja análises e projeções para tomar decisões melhores.</p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Visualize seus gastos com clareza</h2>
            <p className="text-text-muted mt-3">Resumos mensais, categorias e visão geral do seu dinheiro - tudo em um painel simples.</p>
          </div>

          <img 
          src="https://img.freepik.com/fotos-premium/close-da-exibicao-do-grafico-financeiro-com-grafico-generico-de-velas-de-ativos-volateis-rede-neural-gerada-em-maio-de-2023-nao-baseado-em-qualquer-cena-ou-padrao-real_636705-11174.jpg" 
          alt="Gráfico genérico" 
          className="w-full h-auto rounded-2xl"/>
        </div>

        <div className="mt-16 rounded-2xl bg-primary-soft p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2>Pronto para ter controle de verdade?</h2>
            <p>Comece agora e organize suas finanças em poucos minutos.</p>
          </div>

          <button className="btn btn-primary">Comece já - é grátis</button>
        </div>
      </section>
    </>
  );
}
