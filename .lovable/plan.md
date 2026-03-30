

## Kontakt-Seite entfernen — nur im Footer behalten

### Was passiert

Die Kontakt-Seite ist redundant: Telefon, E-Mail, Social Links und Standort-Adressen stehen bereits im Footer und auf den Standort-Detailseiten. Wir entfernen die Seite und den Nav-Link.

### Änderungen

| Datei | Aktion |
|---|---|
| `src/components/layout/Navbar.tsx` | `{ to: "/kontakt", label: "Kontakt" }` aus `navLinks` entfernen (Zeile 42) |
| `src/components/layout/Navbar.tsx` | Kontakt auch aus `mobileNav` entfernen (muss ich prüfen wo genau) |
| `src/components/layout/Footer.tsx` | `{ to: "/kontakt", label: "Kontakt" }` aus `navLinks` entfernen (Zeile 14) — Kontaktdaten (Telefon, E-Mail, Social) bleiben im Footer selbst |
| `src/components/layout/Footer.tsx` | `legalLinks` zeigen auf `/kontakt` für Impressum/Datenschutz — müssen auf `#` oder eine zukünftige Seite umgeleitet werden |
| `src/App.tsx` | Route `/kontakt` entfernen |
| `src/pages/Kontakt.tsx` | Datei kann gelöscht werden |

### Footer bleibt unverändert

Der Footer zeigt weiterhin Telefon, E-Mail und Social Links — dort gehört die Info hin. Die Standort-Detailseiten haben Adressen und Öffnungszeiten.

### Legal-Links (Impressum/Datenschutz)

Aktuell zeigen beide auf `/kontakt`. Diese werden vorerst auf `#` gesetzt — eine eigene Impressum/Datenschutz-Seite kann später erstellt werden.

