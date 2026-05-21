# ============================================================
#  update-docs.ps1
#  Scanner docs/-mappen og lager docs/docs-data.js automatisk.
#  Kjør dette etter at du har lagt til eller fjernet filer.
# ============================================================

$ErrorActionPreference = "Stop"

# Finn mappen dette skriptet ligger i
$rotMappe = $PSScriptRoot
$docsMappe = Join-Path $rotMappe "docs"
$outFil = Join-Path $docsMappe "docs-data.js"

if (-not (Test-Path $docsMappe)) {
    Write-Host "Mappen 'docs' finnes ikke. Oppretter den..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $docsMappe | Out-Null
}

# Hent alle filer i docs/, men hopp over selve datafilen og README
$filer = Get-ChildItem -Path $docsMappe -File | Where-Object {
    $_.Name -ne "docs-data.js" -and $_.Name -ne "README.txt"
} | Sort-Object LastWriteTime -Descending

# Bygg JavaScript-objektene
$linjer = @()
$linjer += "// Auto-generert av update-docs.ps1 - ikke rediger manuelt!"
$linjer += "// Sist oppdatert: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$linjer += "window.veilagetDocs = ["

for ($i = 0; $i -lt $filer.Count; $i++) {
    $fil = $filer[$i]
    $endelse = $fil.Extension.ToLower()

    # Velg ikon basert på filtype
    $ikon = switch ($endelse) {
        ".pdf"  { "[PDF]" }
        ".doc"  { "[DOC]" }
        ".docx" { "[DOC]" }
        ".xls"  { "[XLS]" }
        ".xlsx" { "[XLS]" }
        ".jpg"  { "[IMG]" }
        ".jpeg" { "[IMG]" }
        ".png"  { "[IMG]" }
        ".txt"  { "[TXT]" }
        default { "[FIL]" }
    }

    # Lag en lesbar tittel fra filnavnet
    $tittel = $fil.BaseName -replace "[-_]", " "
    # Stor forbokstav
    if ($tittel.Length -gt 0) {
        $tittel = $tittel.Substring(0,1).ToUpper() + $tittel.Substring(1)
    }

    $dato = $fil.LastWriteTime.ToString("yyyy-MM-dd")
    $filnavn = $fil.Name

    # Escape doble fnutter i tittelen
    $tittelEscaped = $tittel -replace '"', '\"'
    $filnavnEscaped = $filnavn -replace '"', '\"'

    $komma = if ($i -lt $filer.Count - 1) { "," } else { "" }

    $linjer += "  {"
    $linjer += "    `"tittel`": `"$tittelEscaped`","
    $linjer += "    `"filnavn`": `"$filnavnEscaped`","
    $linjer += "    `"dato`": `"$dato`""
    $linjer += "  }$komma"
}

$linjer += "];"

# Skriv til fil (UTF-8 uten BOM for nettleser-kompatibilitet)
$innhold = $linjer -join "`r`n"
[System.IO.File]::WriteAllText($outFil, $innhold, (New-Object System.Text.UTF8Encoding $false))

Write-Host ""
Write-Host "Ferdig! Fant $($filer.Count) dokument(er) i docs/" -ForegroundColor Green
Write-Host "Skrev til: $outFil" -ForegroundColor Gray
Write-Host ""
if ($filer.Count -gt 0) {
    Write-Host "Dokumenter:" -ForegroundColor Cyan
    foreach ($f in $filer) {
        Write-Host "  - $($f.Name)"
    }
}
Write-Host ""
