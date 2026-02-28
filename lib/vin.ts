const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVin(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function isValidVin(value: string | null | undefined) {
  return VIN_PATTERN.test(normalizeVin(value));
}

export function buildCarfaxUrl(value: string | null | undefined) {
  const vin = normalizeVin(value);
  if (!vin) return null;
  return `https://www.carfax.com/vehicle/${encodeURIComponent(vin)}`;
}
