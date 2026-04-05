/** Max upload size for TC PDFs (must match storage bucket limit). */
export const MAX_PDF_BYTES = 5 * 1024 * 1024;

export function isPdfMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 5) return false;
  const head = String.fromCharCode(
    bytes[0],
    bytes[1],
    bytes[2],
    bytes[3],
    bytes[4],
  );
  return head === "%PDF-";
}
