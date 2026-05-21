# Kolbjørnbakken og Berte Styris veg veilag

Statisk hjemmeside for veilaget – med informasjon om styret, dokumenter,
prosjekter, praktisk info og personvern. Hostes via GitHub Pages.

**Live:** https://kobsv.github.io/

## Teknologi

Ren HTML, CSS og JavaScript – ingen rammeverk, ingen build-steg.
Skjemaer håndteres via [Web3Forms](https://web3forms.com).

## Prosjektstruktur

```
veilaget/
├── index.html          Selve hjemmesiden (struktur og innhold)
├── style.css           Design og layout
├── script.js           Interaktivitet (meny, skjema, dokumentliste)
├── update-docs.bat     Hjelpeskript: oppdater dokumentlisten (Windows)
├── update-docs.ps1     Selve PowerShell-skriptet
└── docs/               Mappe for dokumenter (PDF, Word, Excel osv.)
    ├── docs-data.js    Auto-generert manifest over dokumentene
    └── README.txt      Bruksanvisning for dokumenter-mappen
```

## Slik legger du til et nytt dokument

1. Kopier filen (PDF, Word, Excel...) inn i `docs/`-mappen
2. Dobbeltklikk på `update-docs.bat` (Windows)
3. Skriptet oppdaterer `docs/docs-data.js` automatisk
4. Commit og push endringene til GitHub
5. Nettsiden oppdateres innen 1–2 minutter

## Slik kjører du lokalt

Du kan dobbeltklikke `index.html` og åpne den direkte i nettleseren –
ingen server nødvendig.

## Slik publiserer du endringer

Endringer i koden eller dokumenter må committes og pushes til GitHub.
GitHub Pages bygger og publiserer automatisk fra `main`-branchen.

```bash
git add .
git commit -m "Kort beskrivelse av endringen"
git push
```

## Konfigurasjon

### Kontaktskjema

Skjemaet i Kontakt-seksjonen sender meldinger via Web3Forms.
For å aktivere:

1. Opprett gratiskonto på [web3forms.com](https://web3forms.com)
2. Skriv inn e-postadressen som skal motta henvendelser
3. Kopier din `access_key`
4. Erstatt teksten `DIN_ACCESS_KEY_HER` i `index.html` med nøkkelen

Skjemaet har et innebygd honeypot-felt som filtrerer ut de fleste bots.

## Lisens

[Org.nr: organisasjonsnummer]
© Kolbjørnbakken og Berte Styris veg veilag
