/* ============================================================
   script.js — interaktivitet for Veilaget-hjemmesiden
   Forventer at docs/docs-data.js er lastet inn først,
   slik at window.veilagetDocs er tilgjengelig.
   ============================================================ */

// ---------- Hamburger-meny (mobil) ----------
var menyKnapp = document.getElementById('menyKnapp');
var hovedmeny = document.getElementById('hovedmeny');

// Toggle meny åpen/lukket når man klikker på hamburgerknappen
menyKnapp.addEventListener('click', function() {
  var erAapen = hovedmeny.classList.toggle('aapen');
  menyKnapp.classList.toggle('aapen', erAapen);
  menyKnapp.setAttribute('aria-expanded', erAapen);
  menyKnapp.setAttribute('aria-label', erAapen ? 'Lukk meny' : 'Åpne meny');
});

// Lukk menyen automatisk når man klikker på en lenke
hovedmeny.querySelectorAll('a').forEach(function(lenke) {
  lenke.addEventListener('click', function() {
    hovedmeny.classList.remove('aapen');
    menyKnapp.classList.remove('aapen');
    menyKnapp.setAttribute('aria-expanded', 'false');
    menyKnapp.setAttribute('aria-label', 'Åpne meny');
  });
});

// ---------- One-page-navigasjon ----------
// Vis bare den seksjonen som matcher URL-hashen (#om, #styret osv.)
function visAktivSeksjon() {
  // Hvis ingen hash er satt, start på "hjem"
  var hash = window.location.hash.replace('#', '') || 'hjem';

  // Skjul alle seksjoner ved å fjerne "aktiv"-klassen
  document.querySelectorAll('.side-seksjon').forEach(function(seksjon) {
    seksjon.classList.remove('aktiv');
  });

  // Vis den valgte seksjonen (hvis den finnes)
  var aktivSeksjon = document.getElementById(hash);
  if (aktivSeksjon) {
    aktivSeksjon.classList.add('aktiv');
  } else {
    // Hvis hashen ikke matcher noe, fall tilbake til hjem
    document.getElementById('hjem').classList.add('aktiv');
  }

  // Marker tilsvarende lenke i menyen
  document.querySelectorAll('nav a').forEach(function(lenke) {
    if (lenke.getAttribute('href') === '#' + hash) {
      lenke.classList.add('aktiv-meny');
    } else {
      lenke.classList.remove('aktiv-meny');
    }
  });

  // Rull til toppen av siden når man bytter
  window.scrollTo(0, 0);
}

// Kjør funksjonen når URL-hashen endrer seg
window.addEventListener('hashchange', visAktivSeksjon);

// Kjør funksjonen én gang når siden lastes inn
visAktivSeksjon();

// ---------- Kontaktskjema ----------
// Sender skjemaet til Web3Forms via fetch (AJAX) slik at brukeren
// blir på siden og får en bekreftelse uten å bli omdirigert.
// Web3Forms vil ha JSON-body (i motsetning til Formspree som tar FormData).
document.getElementById('kontaktSkjema').addEventListener('submit', async function(e) {
  e.preventDefault();  // hindrer at nettleseren sender skjemaet på vanlig måte
  var form = this;
  var bekreftelse = document.getElementById('bekreftelse');
  var sendKnapp = form.querySelector('button[type="submit"]');

  // Honeypot-sjekk: hvis bot-feltet er fylt ut, er det en bot - dropp stille
  if (form.querySelector('[name="botcheck"]').checked) {
    bekreftelse.style.display = 'block';  // Vis falsk bekreftelse til boten
    return;
  }

  // Deaktiver knappen mens vi sender
  sendKnapp.disabled = true;
  sendKnapp.textContent = 'Sender...';

  // Konverter FormData til vanlig objekt → JSON (Web3Forms-format)
  var formData = new FormData(form);
  var data = Object.fromEntries(formData.entries());

  try {
    var svar = await fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    var resultat = await svar.json();

    if (svar.ok && resultat.success) {
      // Alt gikk bra – vis bekreftelse og tøm skjemaet
      bekreftelse.style.display = 'block';
      form.reset();
      bekreftelse.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Beklager, noe gikk galt: ' + (resultat.message || 'ukjent feil') + '. Prøv igjen senere.');
    }
  } catch (err) {
    alert('Kunne ikke sende meldingen. Sjekk internettforbindelsen og prøv igjen.');
  } finally {
    sendKnapp.disabled = false;
    sendKnapp.textContent = 'Send melding';
  }
});

// ---------- Dokumentliste ----------
// Velger riktig ikon basert på filtype
function velgIkon(filnavn) {
  var endelse = filnavn.split('.').pop().toLowerCase();
  if (endelse === 'pdf') return '📄';
  if (endelse === 'doc' || endelse === 'docx') return '📝';
  if (endelse === 'xls' || endelse === 'xlsx') return '📊';
  if (endelse === 'jpg' || endelse === 'jpeg' || endelse === 'png') return '🖼️';
  if (endelse === 'txt') return '📃';
  return '📁';
}

// Gjør filnavn pent: "arsmote-referat-2025.pdf" → "Arsmote referat 2025"
function pyntFilnavn(filnavn) {
  var utenEndelse = filnavn.replace(/\.[^.]+$/, '');
  var medMellomrom = utenEndelse.replace(/[-_]/g, ' ');
  return medMellomrom.charAt(0).toUpperCase() + medMellomrom.slice(1);
}

// Bygger HTML for dokumentlisten basert på window.veilagetDocs
function renderDokumenter() {
  var liste = document.getElementById('dokumentListe');
  var dokumenter = window.veilagetDocs || [];

  if (dokumenter.length === 0) {
    liste.innerHTML = '<li>Ingen dokumenter funnet.</li>';
    return;
  }

  liste.innerHTML = '';
  dokumenter.forEach(function(dok) {
    var li = document.createElement('li');
    li.innerHTML =
      '<div class="dok-ikon">' + (dok.ikon || velgIkon(dok.filnavn)) + '</div>' +
      '<div class="dok-info">' +
        '<div class="tittel">' + (dok.tittel || pyntFilnavn(dok.filnavn)) + '</div>' +
        '<div class="dato">' + (dok.dato || '') + '</div>' +
      '</div>' +
      '<a class="dok-link" href="docs/' + dok.filnavn + '" target="_blank">Åpne</a>';
    liste.appendChild(li);
  });
}

renderDokumenter();
