export function formatCOP(n: number | null | undefined) {
  return "$" + Number(n || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CartLine = {
  productId: string;
  productName: string;
  brand: string;
  tone: string;
  qty: number;
  price: number;
};

export function buildWhatsAppMessage(storeName: string, lines: CartLine[], depositPercent: number) {
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  let msg = `Hola, ${storeName}. Quiero reservar:\n\n`;
  lines.forEach((l) => {
    msg += `Producto: ${l.brand} — ${l.productName}\n`;
    msg += `Tono: ${l.tone}\n`;
    msg += `Cantidad: ${l.qty}\n`;
    msg += `Precio: ${formatCOP(l.price)}\n`;
    msg += `Subtotal: ${formatCOP(l.price * l.qty)}\n\n`;
  });
  msg += `Total: ${formatCOP(total)}\n`;
  msg += `Abono (${depositPercent}%): ${formatCOP((total * depositPercent) / 100)}`;
  return msg;
}
