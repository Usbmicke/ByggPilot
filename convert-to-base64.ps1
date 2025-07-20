# PowerShell script för att konvertera Service Account till Base64
# Detta script läser service-account.json och konverterar till Base64

Write-Host "=== ByggPilot Service Account Base64 Converter ===" -ForegroundColor Green

# Kontrollera om service-account.json finns
if (-not (Test-Path "service-account.json")) {
    Write-Host "FEL: service-account.json finns inte!" -ForegroundColor Red
    Write-Host "Skapa filen med din Service Account data först." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Template finns i NETLIFY_SETUP_GUIDE.md" -ForegroundColor Cyan
    exit 1
}

try {
    # Läs JSON-filen
    $json = Get-Content -Path "service-account.json" -Raw -Encoding UTF8
    
    # Validera att det är giltig JSON
    $parsed = $json | ConvertFrom-Json
    
    # Kontrollera viktiga fält
    if (-not $parsed.private_key) {
        Write-Host "VARNING: private_key saknas i JSON!" -ForegroundColor Yellow
    }
    if (-not $parsed.project_id) {
        Write-Host "VARNING: project_id saknas i JSON!" -ForegroundColor Yellow
    }
    
    # Konvertera till Base64
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $base64 = [System.Convert]::ToBase64String($bytes)
    
    # Spara till fil
    $base64 | Out-File -FilePath "service-account-base64.txt" -Encoding ASCII
    
    Write-Host "✅ Lyckades!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Base64-strängen har sparats i: service-account-base64.txt" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Nästa steg:" -ForegroundColor Yellow
    Write-Host "1. Kopiera innehållet från service-account-base64.txt" -ForegroundColor White
    Write-Host "2. Gå till Netlify Dashboard → Site Settings → Environment variables" -ForegroundColor White
    Write-Host "3. Lägg till: GOOGLE_CREDENTIALS_BASE64 = [kopierad Base64]" -ForegroundColor White
    Write-Host ""
    Write-Host "Base64-längd: $($base64.Length) tecken" -ForegroundColor Gray
    
} catch {
    Write-Host "FEL: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Kontrollera att service-account.json är giltig JSON." -ForegroundColor Yellow
}
