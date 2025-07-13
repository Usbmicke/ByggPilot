# ByggPilot Development Domain Setup Script
# Kor detta script som administrator for att satta upp utvecklingsdomain

# Kontrollera om vi kor som administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "Denna script behover koras som administrator!" -ForegroundColor Red
    Write-Host "Hogerklicka pa PowerShell och valj 'Kor som administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

$hostsFile = "C:\Windows\System32\drivers\etc\hosts"
$domainEntry = "127.0.0.1 byggpilot.dev"

# Kontrollera om domain redan finns
$hostsContent = Get-Content $hostsFile
if ($hostsContent -contains $domainEntry) {
    Write-Host "byggpilot.dev ar redan konfigurerad i hosts-filen!" -ForegroundColor Green
} else {
    # Lagg till domain
    Add-Content -Path $hostsFile -Value $domainEntry
    Write-Host "Tillagt byggpilot.dev till hosts-filen!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== NASTA STEG ===" -ForegroundColor Cyan
Write-Host "1. Ga till Firebase Console: https://console.firebase.google.com" -ForegroundColor White
Write-Host "2. Valj ditt ByggPilot-projekt" -ForegroundColor White
Write-Host "3. Ga till Authentication > Settings > Authorized domains" -ForegroundColor White
Write-Host "4. Klicka 'Add domain' och lagg till: byggpilot.dev" -ForegroundColor White
Write-Host "5. Spara andringarna" -ForegroundColor White
Write-Host ""
Write-Host "Sedan kan du starta ByggPilot med: npm run dev" -ForegroundColor Green
Write-Host "Och oppna: http://byggpilot.dev:5173" -ForegroundColor Green

pause
