// Gera www/index.html AUTOSSUFICIENTE (todos os scripts inline, pdf.js + worker inline) para o
// fallback offline do APK: com server.url, o Capacitor só serve o errorPath local — arquivos
// relativos (app.js etc.) iriam para a rede. Uso: node embutir.js <pasta_origem> <saida.html>
const fs = require("fs"), path = require("path");
const [src = ".", out = "www/index.html"] = process.argv.slice(2);
const ler = f => fs.readFileSync(path.join(src, f), "utf8");
const seguro = s => s.replace(/<\/script/gi, "<\\/script");
let html = ler("index.html");
let app = ler("app.js")
  .replace('"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"',
    'URL.createObjectURL(new Blob([document.getElementById("pdfw").textContent], { type: "text/javascript" }))')
  .replace('navigator.serviceWorker.register("sw.js")', "Promise.resolve()");
if (!app.includes('getElementById("pdfw")')) throw new Error("workerSrc do pdf.js não encontrado em app.js");
const arquivos = { "versao.js": ler("versao.js"), "dados.js": ler("dados.js"), "quiz.js": ler("quiz.js"), "app.js": app,
  "visual.js": ler("visual.js"), "guia.js": ler("guia.js"), "pdf.min.js": ler("pdf.min.js") };
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>', '<script src="pdf.min.js"></script>');
let n = 0;
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => {
  if (!(f in arquivos)) throw new Error("script sem conteúdo para embutir: " + f);
  n++; return `<script>/* ${f} */\n${seguro(arquivos[f])}\n</script>`;
});
html = html.replace("</body>", `<script type="text/plain" id="pdfw">${seguro(ler("pdf.worker.min.js"))}</script>\n</body>`);
html = html.replace('<html lang="pt-BR">', '<html lang="pt-BR" data-apk="1" data-embutido="1">');
if (/<script src=/.test(html)) throw new Error("sobrou <script src> externo");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`embutido: ${n} scripts inline + worker, ${(html.length / 1e6).toFixed(2)} MB -> ${out}`);
