/* MODO LEITURA da norma (aba 📄 Norma): páginas roláveis, texto ampliável, busca, sumário e
   quadros interativos por seção. O PDF fica SÓ no aparelho (IndexedDB "nbr8160"/"pdf"/"norma"). */
(function () {
  const $ = s => document.querySelector(s);
  const H = (tag, at = {}, html = "") => { const e = document.createElement(tag); Object.assign(e, at); if (html) e.innerHTML = html; return e; };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

  // sumário básico (substituído pelo mapa do Codex, window.LEITURA, quando existir)
  const BASE = [["1–2", "Objetivo e referências", 1, null, 1], ["3", "Definições", 2, null, 1], ["4.1", "Generalidades", 3, null, 1],
    ["4.2.2", "Desconectores (sifões, caixas sifonadas)", 4, "fecho", 2], ["4.2.3", "Ramais de descarga e de esgoto", 4, "decl", 2],
    ["4.2.4", "Tubos de queda", 5, "sobre", 2], ["Fig. 1", "Zonas de sobrepressão", 6, "sobre", 3], ["4.2.6", "Caixas de gordura e de inspeção", 6, "gordura", 2],
    ["4.2.7", "Instalação de recalque", 7, null, 2], ["4.3", "Subsistema de ventilação", 7, "terminal", 1], ["Tab. 1", "Distância do desconector ao ventilador", 11, null, 3],
    ["Tab. 2", "Colunas e barriletes de ventilação", 12, "predio", 3], ["4.5", "Documentação do projeto", 15, null, 2], ["5.1", "Dimensionamento — coleta e transporte", 15, "banheiro", 1],
    ["Tab. 3", "UHC dos aparelhos", 16, "banheiro", 3], ["Tab. 4–5", "Aparelhos não listados · ramais de esgoto", 17, "banheiro", 3],
    ["Tab. 6–7", "Tubos de queda · coletor e subcoletores", 18, "predio", 3], ["5.1.5", "Caixas de gordura, passagem e inspeção", 18, "gordura", 2],
    ["5.1.5.3", "Caixa de inspeção × poço de visita", 19, "inspecao", 3], ["5.1.6", "Recalque (caixa coletora)", 19, null, 2],
    ["5.2", "Dimensionamento — ventilação", 20, "terminal", 1], ["Tab. 8", "Ramais de ventilação", 21, null, 3], ["6–8", "Execução, manutenção, qualidade", 21, null, 1],
    ["A", "Anexo A — Simbologia", 23, null, 1], ["B", "Anexo B — Método hidráulico", 24, null, 1], ["C", "Anexo C — Ventilação primária (fecho hídrico)", 54, "fecho", 1],
    ["D", "Anexo D — Ventilação secundária (hidráulico)", 62, null, 1], ["E", "Anexo E — Execução", 63, null, 1], ["F", "Anexo F — Manutenção", 64, null, 1],
    ["G", "Anexo G — Ensaios", 66, "ensaio", 1], ["H", "Anexo H — Bibliografia", 67, null, 1]]
    .map(([id, tit, pag, quadro, nivel]) => ({ id, tit, pag, quadro, nivel }));
  const mapa = () => (Array.isArray(window.LEITURA) && window.LEITURA.length ? window.LEITURA : BASE);

  // ---------- IndexedDB (mesma base do app.js) ----------
  const idb = () => new Promise((ok, err) => { const r = indexedDB.open("nbr8160", 1); r.onupgradeneeded = () => r.result.createObjectStore("pdf"); r.onsuccess = () => ok(r.result); r.onerror = () => err(r.error); });
  const guarda = async b => { const d = await idb(); return new Promise((ok, err) => { const t = d.transaction("pdf", "readwrite"); t.objectStore("pdf").put(b, "norma"); t.oncomplete = ok; t.onerror = () => err(t.error); }); };
  const pega = async () => { const d = await idb(); return new Promise(ok => { const r = d.transaction("pdf").objectStore("pdf").get("norma"); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); }); };

  let doc = null, textos = [], modo = ls("leit_modo") || "pag", zoom = +(ls("leit_zoom") || 1), fonte = +(ls("leit_fonte") || 17);
  const raiz = H("div", { className: "leit" });

  function montar() {
    const box = $("#vLeitura"); if (!box) return;
    box.append(raiz);
    raiz.innerHTML = `
      <div class="leit-vazio" hidden>
        <div class="big">📄</div><h3>Coloque a norma no celular</h3>
        <p>Toque no botão e escolha o arquivo <b>NBR8160.pdf</b> (fica em <b>Downloads</b>). É uma vez só; depois abre sem internet.</p>
        <label class="btn">📂 Escolher o PDF da norma<input type="file" accept="application/pdf,.pdf" hidden></label>
        <p class="nota">O PDF fica guardado só neste aparelho.</p></div>
      <div class="leit-ok" hidden>
        <div class="leit-bar">
          <div class="chips"><button class="chip" data-m="pag">📖 Páginas</button><button class="chip" data-m="txt">🔤 Texto grande</button><button class="chip" data-m="sum">🗂️ Sumário</button></div>
          <div class="linha"><input type="search" class="leit-q" placeholder="🔎 Procurar na norma (ex.: 2,40 m, caixa sifonada)"></div>
          <div class="leit-res"></div>
          <div class="linha leit-ctl"><button class="btn sec" data-z="-1">A−</button><button class="btn sec" data-z="1">A+</button><span class="mu leit-pos"></span>
            <label class="btn sec" style="margin-left:auto">📂<input type="file" accept="application/pdf,.pdf" hidden></label></div>
        </div>
        <div class="leit-corpo"></div></div>
      <div class="folha" hidden><div class="folha-in"><button class="btn sec folha-x">✕ fechar</button><div class="folha-c"></div></div></div>`;
    raiz.querySelectorAll('input[type=file]').forEach(i => i.onchange = async e => { const f = e.target.files[0]; if (!f) return; try { await guarda(f); } catch (x) {} await abrirPdf(f); });
    raiz.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { modo = b.dataset.m; ls("leit_modo", modo); render(); });
    raiz.querySelectorAll("[data-z]").forEach(b => b.onclick = () => {
      if (modo === "txt") { fonte = Math.max(13, Math.min(28, fonte + 2 * b.dataset.z)); ls("leit_fonte", fonte); raiz.querySelector(".leit-corpo").style.setProperty("--fs", fonte + "px"); }
      else { zoom = Math.max(1, Math.min(2.5, zoom + 0.5 * b.dataset.z)); ls("leit_zoom", zoom); render(); }
    });
    raiz.querySelector(".leit-q").oninput = e => busca(e.target.value);
    raiz.querySelector(".folha-x").onclick = () => raiz.querySelector(".folha").hidden = true;
    pega().then(b => b ? abrirPdf(b) : estado(false)).catch(() => estado(false));
  }
  function estado(temPdf) { raiz.querySelector(".leit-vazio").hidden = temPdf; raiz.querySelector(".leit-ok").hidden = !temPdf; }

  async function abrirPdf(blob) {
    if (!window.pdfjsLib) { estado(false); raiz.querySelector(".leit-vazio p").textContent = "Leitor de PDF indisponível agora (sem internet na primeira abertura). Tente de novo com internet."; return; }
    try {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        const w = document.getElementById("pdfw"); // versão embutida do APK traz o worker inline
        pdfjsLib.GlobalWorkerOptions.workerSrc = w ? URL.createObjectURL(new Blob([w.textContent], { type: "text/javascript" })) : "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
      doc = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
      const v1 = (await doc.getPage(1)).getViewport({ scale: 1 }); proporcao = v1.height / v1.width;
      estado(true); textos = []; render(); extrairTextos();
      const alvo = window.__leitPag; if (alvo) { window.__leitPag = 0; irPara(alvo); }
    } catch (e) { estado(false); raiz.querySelector(".leit-vazio p").textContent = "Não consegui abrir esse arquivo. Escolha o PDF da NBR 8160."; }
  }

  // texto por página, respeitando as DUAS colunas da norma
  async function textoPagina(n) {
    if (textos[n]) return textos[n];
    const p = await doc.getPage(n), w = p.getViewport({ scale: 1 }).width, c = await p.getTextContent();
    const col = [[], []];
    for (const it of c.items) { if (!it.str.trim()) continue; const x = it.transform[4], y = it.transform[5]; col[x > w * 0.49 && x < w * 0.95 ? 1 : 0].push({ x, y, s: it.str }); }
    const linhas = arr => { const m = new Map(); arr.forEach(i => { const k = Math.round(i.y / 3); (m.get(k) || m.set(k, []).get(k)).push(i); });
      return [...m.entries()].sort((a, b) => b[0] - a[0]).map(([, l]) => l.sort((a, b) => a.x - b.x).map(i => i.s).join(" ").replace(/\s+/g, " ").trim()); };
    let ls2 = [...linhas(col[0]), ...linhas(col[1])].filter(l => !/^Cópia não autorizada$/i.test(l));
    // junta hifenização de fim de linha
    const t = ls2.join("\n").replace(/-\n(?=[a-zà-ú])/g, "").replace(/\n(?=[a-zà-ú(])/g, " ");
    return (textos[n] = t);
  }
  async function extrairTextos() { for (let i = 1; i <= doc.numPages; i++) { await textoPagina(i); if (i % 8 === 0) await new Promise(r => setTimeout(r)); } }

  const esc = s => String(s || "").replace(/[<&"]/g, c => ({ "<": "&lt;", "&": "&amp;", '"': "&quot;" })[c]);
  const item = x => `<div class="it n${x.nivel || 2}"><b>${esc(x.id)}</b> ${esc(x.tit)}${x.resumo ? `<small>${esc(x.resumo)}</small>` : ""}
      <span class="chips">${x.quadro ? `<button class="chip quadro" data-q="${esc(x.quadro)}">🎛️ quadro</button>` : ""}${x.pergunta ? `<button class="chip perg" data-p="${encodeURIComponent(x.pergunta)}" data-r="${encodeURIComponent(x.resposta || "")}">❓ pergunta de prova</button>` : ""}</span></div>`;
  function chipsSecao(n) {
    const s = mapa().filter(x => x.pag === n); if (!s.length) return "";
    const fortes = s.filter(x => (x.nivel || 2) <= 2), miudos = s.filter(x => (x.nivel || 2) > 2);
    return `<div class="leit-sec">${fortes.map(item).join("")}${miudos.length ? `<details><summary>＋ ${miudos.length} ${miudos.length > 1 ? "itens" : "item"} nesta página (${esc(miudos.slice(0, 3).map(x => x.id).join(", "))}${miudos.length > 3 ? "…" : ""})</summary>${miudos.map(item).join("")}</details>` : ""}</div>`;
  }

  let obs = null, proporcao = 842 / 595; // A4 em pé; atualizado com a página 1 real
  const largura = () => (raiz.querySelector(".leit-corpo").clientWidth || 340) * zoom;
  const alturaPag = () => largura() * proporcao;
  function render() {
    if (!doc) return;
    raiz.querySelectorAll("[data-m]").forEach(b => b.classList.toggle("on", b.dataset.m === modo));
    const corpo = raiz.querySelector(".leit-corpo"); corpo.innerHTML = ""; corpo.className = "leit-corpo m-" + modo; corpo.style.setProperty("--fs", fonte + "px");
    if (obs) obs.disconnect();
    if (modo === "sum") {
      const tudo = ls("leit_sum_tudo") === "1", lista = mapa().filter(x => tudo || (x.nivel || 2) <= 2 || /^(Tab|Fig)/i.test(x.id));
      corpo.innerHTML = `<button class="btn sec sum-tudo">${tudo ? "➖ só capítulos, seções, tabelas e figuras" : `➕ mostrar todos os ${mapa().length} itens`}</button>` +
        lista.map(x => `<button class="sum n${x.nivel || 2}" data-ir="${x.pag}"><span><b>${esc(x.id)}</b> ${esc(x.tit)}</span><em>${x.quadro ? "🎛️ " : ""}p. ${x.pag}</em></button>`).join("");
      corpo.querySelector(".sum-tudo").onclick = () => { ls("leit_sum_tudo", tudo ? "0" : "1"); render(); };
      return;
    }
    obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) desenha(e.target); }), { rootMargin: "600px 0px" });
    for (let n = 1; n <= doc.numPages; n++) {
      const d = H("div", { className: "pagina" }); d.dataset.n = n; d.id = "lp" + n;
      d.innerHTML = chipsSecao(n) + `<div class="pg-num">— página ${n} —</div><div class="pg-cont" style="min-height:${modo === "pag" ? Math.round(alturaPag()) : 120}px"></div>`;
      corpo.append(d); obs.observe(d);
    }
  }
  async function desenha(div) {
    if (div.dataset.ok) return; div.dataset.ok = 1;
    const n = +div.dataset.n, cont = div.querySelector(".pg-cont");
    if (modo === "txt") { const t = await textoPagina(n); cont.style.minHeight = ""; cont.innerHTML = t.split("\n").map(l => `<p>${l.replace(/[<&]/g, c => ({ "<": "&lt;", "&": "&amp;" })[c])}</p>`).join(""); marcar(cont); return; }
    const p = await doc.getPage(n), larg = largura(), v0 = p.getViewport({ scale: 1 });
    const esc = larg / v0.width * Math.min(2, window.devicePixelRatio || 1), vp = p.getViewport({ scale: esc });
    const cv = H("canvas"); cv.width = vp.width; cv.height = vp.height; cv.style.width = larg + "px";
    await p.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise; cont.style.minHeight = ""; cont.replaceChildren(cv);
  }
  // página atual = a que está no topo da tela (abaixo da barra fixa)
  let tPos = 0;
  window.addEventListener("scroll", () => {
    if (!doc || tPos) return; tPos = setTimeout(() => {
      tPos = 0; const topo = (raiz.querySelector(".leit-bar")?.getBoundingClientRect().bottom || 120) + 10; let atual = null;
      raiz.querySelectorAll(".pagina").forEach(d => { if (d.getBoundingClientRect().top <= topo) atual = d; });
      if (atual) { raiz.querySelector(".leit-pos").textContent = `pág. ${atual.dataset.n} de ${doc.numPages}`; ls("leit_ult", atual.dataset.n); }
    }, 120);
  }, { passive: true });
  function irPara(n) {
    n = Math.max(1, Math.min(doc ? doc.numPages : 74, +n));
    if (modo === "sum") { modo = "pag"; render(); }
    const vai = () => {
      const el = document.getElementById("lp" + n); if (!el) return;
      const barra = raiz.querySelector(".leit-bar").getBoundingClientRect().bottom;
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - barra - 4 });
    };
    setTimeout(vai, 60); setTimeout(vai, 700); setTimeout(vai, 1500); // reajusta se algo acima mudou de altura
  }

  // busca no texto da norma
  let termo = "";
  async function busca(q) {
    termo = norm(q.trim()); const out = raiz.querySelector(".leit-res");
    if (termo.length < 2) { out.innerHTML = ""; return; }
    out.innerHTML = "<p class='mu'>procurando…</p>";
    const res = [];
    for (let i = 1; i <= doc.numPages && res.length < 40; i++) {
      const t = await textoPagina(i), nt = norm(t); let k = nt.indexOf(termo);
      while (k >= 0 && res.length < 40) { res.push([i, t.slice(Math.max(0, k - 50), k + termo.length + 60).replace(/\n/g, " ")]); k = nt.indexOf(termo, k + termo.length + 40); }
    }
    if (norm(q.trim()) !== termo) return;
    out.innerHTML = res.length ? `<p class="mu">${res.length}${res.length === 40 ? "+" : ""} trecho(s):</p>` + res.map(([p, s]) => `<button class="achado" data-ir="${p}"><em>p. ${p}</em> …${s.replace(/[<&]/g, c => ({ "<": "&lt;", "&": "&amp;" })[c])}…</button>`).join("") : "<p class='mu'>Nada encontrado no texto da norma.</p>";
  }
  function marcar(el) { if (termo.length < 2) return; el.querySelectorAll("p").forEach(p => { if (norm(p.textContent).includes(termo)) p.classList.add("hl"); }); }

  // cliques: ir para página, quadro interativo, pergunta de prova
  document.addEventListener("click", e => {
    const ir = e.target.closest("[data-ir]"); if (ir && raiz.contains(ir)) { if (ir.classList.contains("achado")) { raiz.querySelector(".leit-res").innerHTML = ""; } irPara(ir.dataset.ir); return; }
    const q = e.target.closest(".quadro"); if (q) { const f = raiz.querySelector(".folha"); const t = window.VISUAL && VISUAL.tema(q.dataset.q, f.querySelector(".folha-c")); if (!t && q.dataset.q === "predio") { document.querySelector('nav button[data-aba="aPredio"]').click(); return; } f.hidden = false; return; }
    const pr = e.target.closest(".perg"); if (pr) { const f = raiz.querySelector(".folha"); f.querySelector(".folha-c").innerHTML = `<div class="box quiz"><h3>❓ ${decodeURIComponent(pr.dataset.p)}</h3><button class="btn" onclick="this.nextElementSibling.hidden=false;this.remove()">Ver resposta</button><div class="out" hidden>${decodeURIComponent(pr.dataset.r)}</div></div>`; f.hidden = false; }
  });
  // botões "📄 ver pág. N" de todo o app abrem o MODO LEITURA na página certa
  document.addEventListener("click", e => {
    const b = e.target.closest(".pg"); if (!b) return;
    e.stopImmediatePropagation(); e.preventDefault();
    raiz.querySelector(".folha") && (raiz.querySelector(".folha").hidden = true);
    document.querySelector('nav button[data-aba="aPdf"]').click();
    if (doc) irPara(b.dataset.pag); else window.__leitPag = +b.dataset.pag;
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar); else montar();
})();
