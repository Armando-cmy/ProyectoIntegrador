import Image from "next/image";

export default function LoginShowcase() {
  return (
    <section className="story-panel" aria-labelledby="story-title">
      <div className="showcase-visual">
        <Image
          className="showcase-vehicle"
          src="/images/login-vehicle.jpeg"
          alt="Automóvil premium Global Car"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 50vw"
        />
        <div className="showcase-image-shade" aria-hidden="true" />
      </div>

      <div className="showcase-copy">
        <div className="eyebrow"><span /> EL CAMINO EMPIEZA AQUÍ</div>
        <h1 id="story-title">TU PRÓXIMO DESTINO<br /><em>ESTÁ A UN CLIC.</em></h1>
        <p className="story-copy">
          Acceso exclusivo a nuestra flota premium.<br />
          Todo en un solo lugar.
        </p>
        <div className="story-footer">
          <span>01</span>
          <div className="story-rule" />
          <span>DISEÑADO PARA LLEGAR MÁS LEJOS</span>
        </div>
      </div>
    </section>
  );
}
