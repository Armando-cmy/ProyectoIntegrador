"use client";

import type { Product } from "./catalog-data";

export type CartItem = { product: Product; quantity: number };
export type Reservation = {
  code: string;
  createdAt: string;
  status: "Pendiente de confirmación";
  items: CartItem[];
  total: number;
};

type ReservationPanelProps = {
  items: CartItem[];
  reservations: Reservation[];
  verificationOnly?: boolean;
  onChangeQuantity: (productId: string, quantity: number) => void;
  onReserve: () => void;
};

export default function ReservationPanel({ items, reservations, verificationOnly = false, onChangeQuantity, onReserve }: ReservationPanelProps) {
  return (
    <div className="gc-content-stack">
      <div className="gc-section-intro">
        <div><span className="gc-kicker">{verificationOnly ? "SEGUIMIENTO DE SOLICITUDES" : "TU SELECCIÓN GLOBAL CAR"}</span><h2>{verificationOnly ? "Verificar reserva" : "Reservaciones"}</h2><p>{verificationOnly ? "Consulta el código y estado de tus solicitudes de reserva." : "Revisa los productos seleccionados y envía tu solicitud."}</p></div>
      </div>
      {!verificationOnly && (
        <section className="gc-panel-card">
          <div className="gc-panel-heading"><div><span className="gc-kicker">SOLICITUD ACTUAL</span><h3>Productos por reservar</h3></div><span className="gc-count-badge">{items.length} PRODUCTOS</span></div>
          {items.length === 0 ? <div className="gc-cart-empty">Aún no agregaste productos. Explora el catálogo para comenzar.</div> : (
            <>
              <div className="gc-cart-list">
                {items.map(({ product, quantity }) => (
                  <div className="gc-cart-row" key={product.id}>
                    <div className="gc-cart-image" style={{ backgroundImage: `url("${product.image}")` }} />
                    <div className="gc-cart-description"><strong>{product.name}</strong><span>{product.code} · Bs. {product.price.toLocaleString("es-BO")} c/u</span></div>
                    <div className="gc-quantity-control"><button type="button" onClick={() => onChangeQuantity(product.id, quantity - 1)} aria-label={`Reducir cantidad de ${product.name}`}>−</button><span>{quantity}</span><button type="button" onClick={() => onChangeQuantity(product.id, quantity + 1)} aria-label={`Aumentar cantidad de ${product.name}`}>+</button></div>
                    <strong className="gc-line-total">Bs. {(product.price * quantity).toLocaleString("es-BO")}</strong>
                  </div>
                ))}
              </div>
              <div className="gc-cart-footer"><span>Total estimado <strong>Bs. {items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString("es-BO")}</strong></span><button type="button" className="gc-gold-button" onClick={onReserve}>SOLICITAR RESERVA <span>→</span></button></div>
            </>
          )}
        </section>
      )}
      <section className="gc-panel-card">
        <div className="gc-panel-heading"><div><span className="gc-kicker">HISTORIAL</span><h3>{verificationOnly ? "Estado de tus reservas" : "Reservas anteriores"}</h3></div><span className="gc-count-badge">{reservations.length} SOLICITUDES</span></div>
        {reservations.length === 0 ? <div className="gc-cart-empty">Todavía no tienes reservas. Tus solicitudes aparecerán aquí.</div> : (
          <div className="gc-reservation-list">
            {reservations.map((reservation) => (
              <article className="gc-reservation-row" key={reservation.code}>
                <div><span className="gc-kicker">CÓDIGO DE RESERVA</span><strong>{reservation.code}</strong></div>
                <div><span className="gc-kicker">FECHA</span><span>{new Date(reservation.createdAt).toLocaleDateString("es-BO")}</span></div>
                <div><span className="gc-kicker">PRODUCTOS</span><span>{reservation.items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
                <div><span className="gc-reservation-status"><i />{reservation.status}</span><strong>Bs. {reservation.total.toLocaleString("es-BO")}</strong></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
