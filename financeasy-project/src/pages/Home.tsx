import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@/components/ui/Button";

export function Home() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl w-full px-6 py-14">
        {/* HERO */}
        <section className="rounded-2xl bg-card border border-border p-10 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Controle suas finanças com simplicidade e clareza
              </h1>

              <p className="text-muted-foreground text-lg max-w-2xl">
                Cadastre contas e cartões, registre transações e acompanhe análises
                para entender seus gastos e planejar seu futuro financeiro.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link to="/register">Comece já - é grátis</Link>
              </Button>

              <Button asChild size="lg" variant="secondary">
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Contas e cartões", "Centralize suas contas bancárias e cartões de crédito em um só lugar"],
            ["Transações completas", "Registre receitas e despesas e mantenha seu histórico sempre organizado."],
            ["Análises inteligentes", "Entenda para onde seu dinheiro vai com resumos mensais e categorias."],
            ["Simulação do futuro", "Projete seu saldo ao longo do tempo com base nos seus gastos mensais."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </section>

        {/* COMO FUNCIONA */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-foreground" id="como-funciona">
            Como funciona
          </h2>
          <p className="text-muted-foreground mt-2">
            Em poucos passos você organiza sua vida financeira e começa a ter clareza.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["01", "Cadastre contas e cartões", "Comece estruturando o que você já usa no dia a dia."],
              ["02", "Registre suas transações", "Adicione entradas e saídas para acompanhar o histórico."],
              ["03", "Acompanhe e simule", "Veja análises e projeções para tomar decisões melhores."],
            ].map(([n, title, desc]) => (
              <div key={n} className="rounded-xl border border-border bg-card p-6">
                <span className="text-sm text-muted-foreground">{n}</span>
                <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCO IMAGEM */}
        <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Visualize seus gastos com clareza</h2>
            <p className="text-muted-foreground mt-3">
              Resumos mensais, categorias e visão geral do seu dinheiro — tudo em um painel simples.
            </p>
          </div>

          <img
            src="https://img.freepik.com/fotos-premium/close-da-exibicao-do-grafico-financeiro-com-grafico-generico-de-velas-de-ativos-volateis-rede-neural-gerada-em-maio-de-2023-nao-baseado-em-qualquer-cena-ou-padrao-real_636705-11174.jpg"
            alt="Gráfico genérico"
            className="w-full h-auto rounded-2xl border border-border"
          />
        </section>

        {/* CTA FINAL */}
        <section className="mt-16 rounded-2xl border border-border bg-primary/10 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Pronto para ter controle de verdade?</h2>
            <p className="text-muted-foreground mt-2">Comece agora e organize suas finanças em poucos minutos.</p>
          </div>

          <Button asChild size="lg">
            <Link to="/register">Comece já - é grátis</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </>
  );
}
