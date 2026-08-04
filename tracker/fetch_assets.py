#!/usr/bin/env python3
"""Fetch + embed fonts and bank favicons for the ECX Tracker artifact edition."""
import base64, json, os, re, urllib.request

SP = os.path.dirname(os.path.abspath(__file__))

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

# --- fonts: embed woff2 as data URIs ---
css = open(os.path.join(SP, "fonts/fonts.css")).read()
urls = sorted(set(re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", css)))
print(f"{len(urls)} unique font files")
total = 0
for u in urls:
    data = fetch(u)
    total += len(data)
    css = css.replace(u, "data:font/woff2;base64," + base64.b64encode(data).decode())
open(os.path.join(SP, "fonts/fonts_embedded.css"), "w").write(css)
print(f"fonts embedded: {total} raw bytes, css now {len(css)} bytes")

# --- favicons ---
BANK_DOMAINS = {
  "Apollo": "apollo.com", "Ares": "aresmgmt.com", "BBVA": "bbva.com", "Blackstone": "blackstone.com", "BMO": "bmo.com",
  "BNP": "bnpparibas.com", "Brookfield": "brookfield.com", "CACIB": "ca-cib.com", "CIBC": "cibc.com", "CitiBank": "citi.com",
  "Cobank": "cobank.com", "CPPIB": "cppinvestments.com", "Clifford Capital": "cliffordcap.sg", "Deutsche Bank": "db.com",
  "First Citizens": "firstcitizens.com", "Goldman Sachs": "goldmansachs.com", "HSBC": "hsbc.com", "ICBC": "icbc.com.cn",
  "Intesa": "intesasanpaolo.com", "ING Bank": "ing.com", "JP Morgan": "jpmorgan.com", "KDB": "kdb.co.kr", "KfW": "kfw.de",
  "Maybank": "maybank.com", "Mizuho": "mizuhogroup.com", "Morgan Stanley": "morganstanley.com", "MUFG": "mufg.jp",
  "Natixis": "natixis.com", "NatWest": "natwest.com", "Nomura": "nomura.com", "Oaktree": "oaktreecapital.com",
  "OHA": "oakhilladvisors.com", "OCBC": "ocbc.com", "PIMCO": "pimco.com", "Rabobank": "rabobank.com", "Santander": "santander.com",
  "SCB": "sc.com", "SMBC": "smbcgroup.com", "Siemens Bank": "siemens.com", "SocGen": "societegenerale.com",
  "US Bank": "usbank.com", "Sinopac": "sinopac.com", "Taishin": "taishinbank.com.tw", "KGI": "kgibank.com.tw",
  "CTBC": "ctbcbank.com", "TCB": "tcb-bank.com.tw", "Entie": "entiebank.com.tw", "CathayUnited": "cathaybk.com.tw",
  "FEIB": "feib.com.tw", "Fubon": "fubon.com"
}
icons, failed = {}, []
for name, dom in BANK_DOMAINS.items():
    if dom in icons:
        continue
    try:
        data = fetch(f"https://www.google.com/s2/favicons?domain={dom}&sz=64")
        if len(data) < 100:
            raise ValueError("tiny response")
        mime = "image/png" if data[:8] == b"\x89PNG\r\n\x1a\n" else ("image/x-icon" if data[:4] in (b"\x00\x00\x01\x00",) else "image/png")
        icons[dom] = f"data:{mime};base64," + base64.b64encode(data).decode()
    except Exception as e:
        failed.append((dom, str(e)))
print(f"icons: {len(icons)} fetched, failed: {failed}")
js = "var BANK_ICONS = " + json.dumps(icons, indent=0) + ";"
open(os.path.join(SP, "icons/bank_icons.js"), "w").write(js)
print(f"icon map: {len(js)} bytes")
