<!DOCTYPE html>
<html>
<head>
    <title>Netlify Cache Purge Tool</title>
</head>
<body>
    <h1>🧹 ByggPilot Cache Purge</h1>
    <button id="purgeBtn">Rensa Netlify CDN Cache</button>
    <div id="result"></div>

    <script>
    document.getElementById('purgeBtn').onclick = async function() {
        const result = document.getElementById('result');
        result.innerHTML = '⏳ Rensar cache...';
        
        try {
            // Detta är en enkel cache-rensning genom att tvinga om deploy
            const response = await fetch('/.netlify/functions/purge-cache', {
                method: 'POST'
            });
            
            if (response.ok) {
                result.innerHTML = '✅ Cache rensad! Uppdatera sidan om 30 sekunder.';
                setTimeout(() => {
                    window.location.reload();
                }, 30000);
            } else {
                throw new Error('Funktionen finns inte än');
            }
        } catch (error) {
            result.innerHTML = `❌ Funktionen inte tillgänglig än. <br>
            <strong>Manuell lösning:</strong><br>
            1. Gå till Netlify Dashboard<br>
            2. Klicka "Deploys"<br>  
            3. Klicka "Trigger deploy" → "Deploy site"<br>
            4. Vänta på deploy att slutföra<br>
            5. Testa sidan igen`;
        }
    };
    </script>
</body>
</html>
