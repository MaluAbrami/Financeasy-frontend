export function Home() {
  return (
    <>
      <section className="flex flex-col items-center bg-bg">
        <div className="m-3">
          <h1>É bom vê-lo(a) novamente!</h1>
          <h2>Mantenha seu controle financeiro em dia com o Financeasy</h2>
        </div>

        <div className="flex flex-row justify-around w-1/4 m-3 bg-surface shadow rounded-2xl">
          <div className="flex flex-col items-start gap-1.5 m-5">
            <p>Já possui uma conta?</p>
            <button className="btn btn-primary">Entrar</button>
          </div>

          <div className="flex flex-col items-start gap-1.5 m-5">
            <p>Ainda não possui uma conta?</p>
            <button className="btn btn-primary">Cadastra-se Já</button>
          </div>
        </div>
      </section>
    </>
  );
}
