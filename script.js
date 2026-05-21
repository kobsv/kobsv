/* ============================================================
   script.js — interaktivitet for Veilaget-hjemmesiden

   Innholdet på siden hentes nå fra JSON-filer i content/-mappen.
   Dette gjør at en CMS (Decap) kan redigere innholdet uten å
   måtte røre HTML eller JavaScript.
   ============================================================ */

// ---------- Hjelpefunksjon: hent JSON ----------
async function hentJson(filsti) {
  try {
    const respons = await fetch(filsti);
    if (!respons.ok) throw new Error('Status ' + respons.status);
    return await respons.json();
  } catch (err) {
    console.warn('Klarte ikke å laste ' + filsti + ':', err.message);
    return null;
  }
}

// ---------- Populer "Hjem"-seksjonen ----------
function populerHjem(data) {
  if (!data) return;
  document.getElementById('hjem-tittel').textContent = data.tittel || '';
  document.getElementById('hjem-undertittel').textContent = data.undertittel || '';
  document.getElementById('hjem-info').textContent = data.info || '';
}

// ---------- Populer "Styret" ----------
function populerStyret(data) {
  if (!data) return;
  const grid = document.getElementById('styret-grid');
  grid.innerHTML = '';  // tøm "Laster..."-meldingen

  if (data.tittel) {
    document.getElementById('styret-tittel').textContent = data.tittel;
  }

  (data.medlemmer || []).forEach(function (medlem) {
    const kort = document.createElement('div');
    kort.className = 'styremedlem';
    kort.innerHTML =
      '<h3>' + medlem.navn + '</h3>' +
      '<p class="rolle">' + medlem.rolle + '</p>' +
      '<p class="adresse">' + medlem.adresse + '</p>';
    grid.appendChild(kort);
  });
}

// ---------- Populer "Footer" ----------
function populerFooter(data) {
  if (!data) return;
  document.getElementById('footer-navn').textContent = data.navn || '';
  document.getElementById('footer-orgnr').textContent = data.orgnr || '';
  document.getElementById('footer-kopirett').textContent = data.kopirett || '';
}

// ---------- Hjelpefunksjon: list av paragrafer ----------
// Tar et array av strenger og lager <p>-elementer
function settAvsnitt(container, avsnitt) {
  container.innerHTML = '';
  (avsnitt || []).forEach(function (tekst) {
    const p = document.createElement('p');
    p.textContent = tekst;
    container.appendChild(p);
  });
}

// ---------- Populer "Om" ----------
function populerOm(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('om-tittel').textContent = data.tittel;
  settAvsnitt(document.getElementById('om-innhold'), data.avsnitt);
}

// ---------- Populer "Prosjekter" ----------
function populerProsjekter(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('prosjekter-tittel').textContent = data.tittel;
  document.getElementById('prosjekter-intro').textContent = data.intro || '';
  document.getElementById('prosjekter-status').textContent = data.status_tekst || '';

  const liste = document.getElementById('prosjekter-tiltak');
  liste.innerHTML = '';
  (data.tiltak || []).forEach(function (tiltak) {
    const li = document.createElement('li');
    li.textContent = tiltak;
    liste.appendChild(li);
  });
}

// ---------- Populer "Praktisk informasjon" ----------
function populerPraktisk(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('praktisk-tittel').textContent = data.tittel;

  const grid = document.getElementById('praktisk-grid');
  grid.innerHTML = '';
  (data.kort || []).forEach(function (kort) {
    const div = document.createElement('div');
    div.className = 'info-kort';
    div.innerHTML = '<h3></h3><p></p>';
    div.querySelector('h3').textContent = kort.tittel;
    div.querySelector('p').textContent = kort.tekst;
    grid.appendChild(div);
  });
}

// ---------- Populer "Personvern" ----------
function populerPersonvern(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('personvern-tittel').textContent = data.tittel;
  settAvsnitt(document.getElementById('personvern-innhold'), data.avsnitt);
}

// ---------- Populer "Kontakt" ----------
function populerKontakt(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('kontakt-tittel').textContent = data.tittel;
  document.getElementById('kontakt-intro').textContent = data.intro || '';
}

// ---------- Populer "Nyheter" ----------
function populerNyheter(data) {
  if (!data) return;
  if (data.tittel) document.getElementById('nyheter-tittel').textContent = data.tittel;
  document.getElementById('nyheter-intro').textContent = data.intro || '';

  const container = document.getElementById('nyheter-liste');
  container.innerHTML = '';

  const innlegg = (data.innlegg || []).slice().sort(function (a, b) {
    return (b.dato || '').localeCompare(a.dato || '');  // nyeste først
  });

  if (innlegg.length === 0) {
    container.innerHTML = '<p>Ingen nyheter publisert ennå.</p>';
    return;
  }

  innlegg.forEach(function (post) {
    const artikkel = document.createElement('article');
    artikkel.className = 'nyhetspost';
    artikkel.innerHTML =
      '<div class="nyhetspost-meta">' + (post.dato || '') + '</div>' +
      '<h3 class="nyhetspost-tittel"></h3>' +
      '<div class="nyhetspost-innhold"></div>';
    artikkel.querySelector('.nyhetspost-tittel').textContent = post.tittel || '';
    artikkel.querySelector('.nyhetspost-innhold').textContent = post.innhold || '';
    container.appendChild(artikkel);
  });
}

// ---------- Populer "Dokumenter" ----------
// Velger riktig ikon basert på filtype
function velgIkon(filnavn) {
  const endelse = filnavn.split('.').pop().toLowerCase();
  if (endelse === 'pdf') return '📄';
  if (endelse === 'doc' || endelse === 'docx') return '📝';
  if (endelse === 'xls' || endelse === 'xlsx') return '📊';
  if (endelse === 'jpg' || endelse === 'jpeg' || endelse === 'png') return '🖼️';
  if (endelse === 'txt') return '📃';
  return '📁';
}

function populerDokumenter(data) {
  if (!data) return;
  const introEl = document.getElementById('dokumenter-intro');
  const liste = document.getElementById('dokumentListe');

  if (data.intro) introEl.textContent = data.intro;

  const dokumenter = data.dokumenter || [];
  liste.innerHTML = '';

  if (dokumenter.length === 0) {
    liste.innerHTML = '<li>Ingen dokumenter publisert ennå.</li>';
    return;
  }

  dokumenter.forEach(function (dok) {
    const li = document.createElement('li');
    li.innerHTML =
      '<div class="dok-ikon">' + (dok.ikon || velgIkon(dok.filnavn)) + '</div>' +
      '<div class="dok-info">' +
        '<div class="tittel">' + dok.tittel + '</div>' +
        '<div class="dato">' + (dok.dato || '') + '</div>' +
      '</div>' +
      '<a class="dok-link" href="docs/' + dok.filnavn + '" target="_blank">Åpne</a>';
    liste.appendChild(li);
  });
}

// ---------- Last inn alt innhold parallelt ----------
async function lastInnAltInnhold() {
  const [hjem, om, styret, prosjekter, praktisk, dokumenter, personvern, kontakt, nyheter, footer] = await Promise.all([
    hentJson('content/hjem.json'),
    hentJson('content/om.json'),
    hentJson('content/styret.json'),
    hentJson('content/prosjekter.json'),
    hentJson('content/praktisk.json'),
    hentJson('content/dokumenter.json'),
    hentJson('content/personvern.json'),
    hentJson('content/kontakt.json'),
    hentJson('content/nyheter.json'),
    hentJson('content/footer.json')
  ]);

  populerHjem(hjem);
  populerOm(om);
  populerStyret(styret);
  populerProsjekter(prosjekter);
  populerPraktisk(praktisk);
  populerDokumenter(dokumenter);
  populerPersonvern(personvern);
  populerKontakt(kontakt);
  populerNyheter(nyheter);
  populerFooter(footer);
}

lastInnAltInnhold();

// ============================================================
// INTERAKTIVITET (uavhengig av innholdslasting)
// ============================================================

// ---------- Hamburger-meny (mobil) ----------
const menyKnapp = document.getElementById('menyKnapp');
const hovedmeny = document.getElementById('hovedmeny');

menyKnapp.addEventListener('click', function () {
  const erAapen = hovedmeny.classList.toggle('aapen');
  menyKnapp.classList.toggle('aapen', erAapen);
  menyKnapp.setAttribute('aria-expanded', erAapen);
  menyKnapp.setAttribute('aria-label', erAapen ? 'Lukk meny' : 'Åpne meny');
});

// Lukk menyen automatisk når man klikker på en lenke
hovedmeny.querySelectorAll('a').forEach(function (lenke) {
  lenke.addEventListener('click', function () {
    hovedmeny.classList.remove('aapen');
    menyKnapp.classList.remove('aapen');
    menyKnapp.setAttribute('aria-expanded', 'false');
    menyKnapp.setAttribute('aria-label', 'Åpne meny');
  });
});

// ---------- One-page-navigasjon ----------
function visAktivSeksjon() {
  const hash = window.location.hash.replace('#', '') || 'hjem';

  document.querySelectorAll('.side-seksjon').forEach(function (seksjon) {
    seksjon.classList.remove('aktiv');
  });

  const aktivSeksjon = document.getElementById(hash);
  if (aktivSeksjon) {
    aktivSeksjon.classList.add('aktiv');
  } else {
    document.getElementById('hjem').classList.add('aktiv');
  }

  document.querySelectorAll('nav a').forEach(function (lenke) {
    if (lenke.getAttribute('href') === '#' + hash) {
      lenke.classList.add('aktiv-meny');
    } else {
      lenke.classList.remove('aktiv-meny');
    }
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', visAktivSeksjon);
visAktivSeksjon();

// ---------- Kontaktskjema (Web3Forms) ----------
document.getElementById('kontaktSkjema').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = this;
  const bekreftelse = document.getElementById('bekreftelse');
  const sendKnapp = form.querySelector('button[type="submit"]');

  // Honeypot-sjekk: hvis bot-feltet er fylt ut, drop stille
  if (form.querySelector('[name="botcheck"]').checked) {
    bekreftelse.style.display = 'block';
    return;
  }

  sendKnapp.disabled = true;
  sendKnapp.textContent = 'Sender...';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const svar = await fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const resultat = await svar.json();

    if (svar.ok && resultat.success) {
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
