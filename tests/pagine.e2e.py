"""Prova delle pagine in un browser vero (Chromium, telefono simulato) contro `wrangler dev` in locale.
Apre le pagine principali come socio e come referente e fallisce se compare un errore JavaScript
o se manca il contenuto atteso. Uso: python3 tests/pagine.e2e.py (serve `pip install playwright` + `playwright install chromium`)."""
import hashlib, os, secrets, signal, subprocess, sys, time, urllib.request
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.environ.get('E2E_STATE', '/tmp/cca-e2e-state')
PORT = 8797
BASE = f'http://localhost:{PORT}'

def wrangler(*args, **kw):
    return subprocess.run(['npx', 'wrangler', *args], cwd=ROOT, capture_output=True, text=True, **kw)

subprocess.run(['rm', '-rf', STATE])
r = wrangler('d1', 'migrations', 'apply', 'DB', '--local', '--persist-to', STATE)
assert r.returncode == 0, r.stdout + r.stderr
tokens = {m: secrets.token_hex(32) for m in ('socio', 'referente')}
sql = "INSERT INTO members (id,email,pseudonym,role,status) VALUES ('socio','socio@example.test','Socio Prova','participant','approved'),('referente','ref@example.test','Referente Prova','organizer','approved');"
for m, t in tokens.items():
    sql += f"INSERT INTO sessions (token_hash,member_id,expires_at) VALUES ('{hashlib.sha256(t.encode()).hexdigest()}','{m}',unixepoch()+3600);"
sql += "INSERT INTO activities (id,name,starts_at,capacity,status,verification_rule) VALUES ('att1','Serata giochi',unixepoch()+86400,10,'published','Presenza');"
r = wrangler('d1', 'execute', 'DB', '--local', '--persist-to', STATE, '--command', sql)
assert r.returncode == 0, r.stdout + r.stderr

server = subprocess.Popen(['npx', 'wrangler', 'dev', '--local', '--port', str(PORT), '--persist-to', STATE], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
try:
    for _ in range(60):
        try:
            urllib.request.urlopen(BASE + '/api/status', timeout=2); break
        except Exception:
            time.sleep(1)
    else:
        sys.exit('wrangler dev non risponde')

    # pagina → testo che deve comparire
    member_pages = {'home': 'Prossime attività', 'calendario': 'Serata giochi', 'missioni': 'Missioni', 'comunita': 'Proposte e consultazioni',
                    'profilo': 'Il mio personaggio', 'impostazioni': 'Elimina il mio account', 'notifiche': 'Notifiche', 'privacy': 'privacy'}
    organizer_pages = {'referenti': 'In sede adesso', 'referenti/soci': 'Soci', 'referenti/attivita': 'Prossima assemblea',
                       'referenti/gioco': 'Da verificare', 'referenti/sede': 'Prima visita', 'impostazioni': 'Tag NFC all’ingresso'}
    failures = []
    shots = os.environ.get('E2E_SCREENSHOTS')
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for who, pages in (('socio', member_pages), ('referente', organizer_pages), (None, {'home': 'CCA SIEMMU', 'calendario': 'Serata giochi'})):
            ctx = browser.new_context(viewport={'width': 390, 'height': 844}, bypass_csp=True)
            if who:
                ctx.add_cookies([{'name': '__Host-cca_session', 'value': tokens[who], 'domain': 'localhost', 'path': '/', 'secure': True}])
            page = ctx.new_page()
            errors = []
            page.on('pageerror', lambda e, errors=errors: errors.append(str(e)))
            for path, expected in pages.items():
                page.goto(f'{BASE}/#{path}')
                page.wait_for_function("document.querySelector('main')?.getAttribute('aria-busy')!=='true'", timeout=15000)
                page.wait_for_timeout(400)
                if shots: page.screenshot(path=f"{shots}/{who or 'ospite'}-{path.replace('/', '-')}.png", full_page=True)
                text = page.inner_text('main')
                if expected.lower() not in text.lower():
                    failures.append(f'{who or "ospite"} #{path}: manca «{expected}»')
                if 'Errore interno' in text or 'Qualcosa è andato storto' in text:
                    failures.append(f'{who or "ospite"} #{path}: messaggio di errore nella pagina')
                for d in page.query_selector_all('dialog[open]'):
                    page.keyboard.press('Escape')
            failures += [f'{who or "ospite"}: errore JavaScript: {e}' for e in errors]
            ctx.close()
        browser.close()
finally:
    os.killpg(server.pid, signal.SIGTERM)

if failures:
    print('\n'.join(failures)); sys.exit(1)
print('OK: pagine principali senza errori (socio, referente, ospite).')
