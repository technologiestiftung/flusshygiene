export function hasAutoData(
  auto: boolean,
  truncate?: boolean,
  solo?: boolean,
): string {
  if (solo === true) {
    return auto ? " ✓" : " ✘";
  } else {
    return `${truncate ? "Autom." : "Automatisierte Datenagregation"}:${
      auto ? " ✓" : " ✘"
    }`;
  }
}
