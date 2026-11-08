/* App NBR 8160 — consulta offline. Lógica pura no objeto CALC (testável no Node). */
(function (root) {
  const N = root.NBR;

  // Contrato: toda entrada numérica deve ser finita e > 0 (pavimentos e cozinhas: inteiros >= 1); senão a função devolve null.
  const pos = (...xs) => xs.every(x => typeof x === "number" && isFinite(x) && x > 0);
  const inteiro = x => pos(x) && Number.isInteger(x);
  const CALC = {
    pos, inteiro,
    uhcAparelho(nome) { const l = N.tab3.linhas.find(r => r[0] === nome); return l ? l[1] : null; },
    dnMinAparelho(nome) { const l = N.tab3.linhas.find(r => r[0] === nome); return l ? l[2] : null; },
    // Tabela 5 — ramal de esgoto
    ramalEsgoto(uhc, dnMin = 0) {
      if (!pos(uhc)) return null;
      const l = N.tab5.linhas.find(r => uhc <= r[1] && r[0] >= dnMin);
      return l ? l[0] : null;
    },
    // 5.1.1.2 — caixa sifonada
    caixaSifonada(uhc) { if (!pos(uhc)) return null; return uhc <= 6 ? 100 : uhc <= 10 ? 125 : uhc <= 15 ? 150 : null; },
    // Tabela 6 — tubo de queda
    tuboQueda(uhc, pavimentos, dnMin = 0) {
      if (!pos(uhc) || !inteiro(pavimentos)) return null;
      const col = pavimentos > 3 ? 2 : 1;
      const l = N.tab6.linhas.find(r => uhc <= r[col] && r[0] >= dnMin);
      return l ? l[0] : null;
    },
    // Tabela 7 — subcoletor/coletor (coletor predial >= DN 100)
    coletor(uhc, declPct) {
      const i = N.tab7.decl.indexOf(Number(declPct));
      if (i < 0 || !pos(uhc)) return null;
      const l = N.tab7.linhas.find(r => r[i + 1] !== null && uhc <= r[i + 1]);
      return l ? l[0] : null;
    },
    // Tabela 8 — ramal de ventilação
    ramalVentilacao(uhc, comBacia) {
      if (!pos(uhc)) return null;
      const t = comBacia ? N.tab8.comBacia : N.tab8.semBacia;
      const l = t.find(r => uhc <= r[1]);
      return l ? l[2] : null;
    },
    // Tabela 2 — coluna de ventilação: linha do DN do TQ com UHC >= a do trecho; menor DN com comprimento >= L
    colunaVentilacao(dnTQ, uhc, comprimento) {
      if (!pos(dnTQ, uhc, comprimento)) return { dn: null, motivo: "entrada inválida (use números > 0)" };
      const linha = N.tab2.linhas.find(r => r[0] === dnTQ && uhc <= r[1]);
      if (!linha) return { dn: null, motivo: "UHC acima da Tabela 2 para esse DN de tubo de queda" };
      for (let k = 0; k < N.tab2.dnsVent.length; k++) {
        const c = linha[2][k];
        if (c !== null && comprimento <= c) return { dn: N.tab2.dnsVent[k], linha, limite: c };
      }
      return { dn: null, linha, motivo: "comprimento maior que o permitido na linha" };
    },
    // 5.1.5.1 — caixa de gordura
    caixaGordura(cozinhas, pessoas, especial) {
      if (!inteiro(cozinhas)) return null;
      if (pessoas !== null && pessoas !== undefined && !inteiro(pessoas)) pessoas = null;
      if (especial || cozinhas > 12) return { tipo: "CGE — especial", volume: pessoas ? 2 * pessoas + 20 : null };
      if (cozinhas <= 1) return { tipo: "CGP (18 L) ou CGS (31 L)" };
      if (cozinhas === 2) return { tipo: "CGS (31 L) ou CGD (120 L)" };
      return { tipo: "CGD — dupla (120 L, Ø 0,60 m, saída DN 100)" };
    },
    // 5.1.6.7 / 5.1.6.11
    volumeUtil(qBomba_m3min, t_min) { return pos(qBomba_m3min, t_min) ? qBomba_m3min * t_min / 4 : null; },
    detencao(vt_m3, q_m3min) { return pos(vt_m3, q_m3min) ? vt_m3 / q_m3min : null; },
    predioAlternativo(p = N.predio) {
      const q = JSON.parse(JSON.stringify(p));
      for (const [amb, ap, n] of p.alternativa.trocar) q.ambientes.find(a => a.nome === amb).ap.find(x => x[0] === ap)[1] = n;
      return CALC.predio(q);
    },
    tab1(dn) { const l = N.tab1.linhas.find(r => r[0] === dn); return l ? l[1] : null; },

    // Pré-dimensionamento do nosso prédio (premissas de traçado A CONFIRMAR)
    predio(p = N.predio) {
      const r = { ambientes: [], tq: [], aviso: [] };
      let uhcApto = 0, uhcColetorApto = 0;
      for (const amb of p.ambientes) {
        let u = 0, maior = 0, temBacia = false, dnMin = 0;
        for (const [nome, q] of amb.ap) {
          const v = CALC.uhcAparelho(nome) * q; u += v;
          maior = Math.max(maior, CALC.uhcAparelho(nome));
          if (nome === "Bacia sanitária") temBacia = true;
          dnMin = Math.max(dnMin, CALC.dnMinAparelho(nome));
        }
        const semBacia = amb.ap.filter(a => a[0] !== "Bacia sanitária").reduce((s, [n, q]) => s + CALC.uhcAparelho(n) * q, 0);
        const linha = { nome: amb.nome, uhc: u, ramal: CALC.ramalEsgoto(u, dnMin), ventil: CALC.ramalVentilacao(u, temBacia) };
        if (amb.banheiro) linha.cs = CALC.caixaSifonada(semBacia), linha.csUhc = semBacia;
        r.ambientes.push(linha);
        uhcApto += u;
        uhcColetorApto += amb.banheiro ? maior : u; // 5.1.4.2
      }
      const nAptos = p.pavimentos * p.aptosPorPav;
      const ban = r.ambientes.filter((a, i) => p.ambientes[i].banheiro).reduce((s, a) => s + a.uhc, 0);
      const coz = r.ambientes.find(a => a.nome === "Cozinha").uhc;
      const as = r.ambientes.find(a => a.nome === "Área de serviço").uhc;
      const L = p.pavimentos * p.peDireito + 0.30; // altura até o terminal (aprox.)
      for (const [nome, uPav, dnMin] of [["TQ banheiros (3 banheiros do apto)", ban, 100], ["TQ gordura (pias + lava-louças, exclusivo → caixa de gordura coletiva)", coz, 0], ["TQ lavanderia (tanque + máquina, exclusivo → CS especial)", as, 0]]) {
        const tot = uPav * p.pavimentos;
        const dn = CALC.tuboQueda(tot, p.pavimentos, dnMin);
        r.tq.push({ nome, uhcPav: uPav, uhc: tot, dn, cv: CALC.colunaVentilacao(dn, tot, L), L });
      }
      r.nAptos = nAptos; r.uhcApto = uhcApto; r.uhcColetorApto = uhcColetorApto;
      r.uhcTerreo = p.terreo ? p.terreo.ap.reduce((s, [n, q]) => s + CALC.uhcAparelho(n) * q, 0) : 0;
      r.uhcColetor = uhcColetorApto * nAptos + r.uhcTerreo; r.uhcTodos = uhcApto * nAptos + r.uhcTerreo;
      r.coletor = { d1: CALC.coletor(r.uhcColetor, 1), d2: CALC.coletor(r.uhcColetor, 2), d4: CALC.coletor(r.uhcColetor, 4) };
      r.gorduraPorTQ = CALC.caixaGordura(p.pavimentos, null, false); // 1 TQ de cozinha por coluna de aptos
      r.gorduraUnica = CALC.caixaGordura(nAptos, null, false);
      return r;
    }
  };
  root.CALC = CALC;
  if (typeof module !== "undefined") module.exports = CALC;
})(typeof window !== "undefined" ? window : globalThis);

/* ---------------- Interface ---------------- */
if (typeof document !== "undefined") (function () {
  const N = window.NBR, C = window.CALC;
  const $ = s => document.querySelector(s);
  const fmt = n => String(n).replace(".", ",");
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const pg = p => `<button class="pg" data-pag="${p}">📄 pág. ${p}</button>`;

  // ---- abas
  document.querySelectorAll("nav button").forEach(b => b.onclick = () => abrirAba(b.dataset.aba));
  function abrirAba(id) {
    document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.aba === id));
    document.querySelectorAll("section.aba").forEach(s => s.hidden = s.id !== id);
    try { localStorage.setItem("aba", id); } catch (e) {}
    window.scrollTo(0, 0);
  }

  // ---- busca
  const busca = $("#q");
  function pontua(f, termos) {
    const alvo = norm(f.t + " " + f.tags + " " + f.x + " " + f.item);
    let s = 0;
    for (const t of termos) { if (!t) continue; if (norm(f.t).includes(t)) s += 3; if (norm(f.tags).includes(t)) s += 2; if (alvo.includes(t)) s += 1; else return 0; }
    return s;
  }
  function render() {
    const termos = norm(busca.value).split(/\s+/).filter(t => t.length > 1);
    let lista = N.fichas.map(f => [f, termos.length ? pontua(f, termos) : 1]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
    $("#res").innerHTML = lista.length ? lista.map(([f]) => `<article class="card"><h3>${f.t}</h3><p>${f.x}</p><div class="meta">item ${f.item} ${pg(f.pag)}</div></article>`).join("")
      : `<p class="vazio">Nada no resumo. Toque em “Perguntar ao Claude” ou abra a norma no PDF.</p>`;
  }
  busca.oninput = render;
  $("#claude").onclick = () => {
    const q = busca.value.trim() || "Me explique a NBR 8160";
    window.open("https://claude.ai/new?q=" + encodeURIComponent("Pela ABNT NBR 8160:1999 (esgoto sanitário predial), com o item da norma: " + q), "_blank");
  };

  // ---- tabelas
  const T = (tit, pag, cab, linhas) => `<div class="tab"><h3>${tit} ${pg(pag)}</h3><div class="rol"><table><tr>${cab.map(c => `<th>${c}</th>`).join("")}</tr>${linhas.map(l => `<tr>${l.map(c => `<td>${c === null ? "—" : fmt(c)}</td>`).join("")}</tr>`).join("")}</table></div></div>`;
  $("#tabelas").innerHTML =
    T(N.tab3.titulo, 16, ["Aparelho", "UHC", "DN mín.", "Obs."], N.tab3.linhas) +
    T(N.tab5.titulo, 17, ["DN", "UHC máx."], N.tab5.linhas) +
    T(N.tab6.titulo, 18, ["DN", "Até 3 pav.", "Mais de 3 pav."], N.tab6.linhas) +
    T(N.tab7.titulo, 18, ["DN", "0,5%", "1%", "2%", "4%"], N.tab7.linhas) +
    T(N.tab4.titulo, 17, ["DN ramal", "UHC"], N.tab4.linhas) +
    T(N.tab1.titulo, 11, ["DN ramal", "Dist. máx. (m)"], N.tab1.linhas) +
    T(N.tab8.titulo + " — sem bacia", 21, ["UHC", "", "DN vent."], N.tab8.semBacia) +
    T(N.tab8.titulo + " — com bacia", 21, ["UHC", "", "DN vent."], N.tab8.comBacia) +
    T(N.tab2.titulo, 12, ["DN TQ", "UHC", ...N.tab2.dnsVent.map(d => "Vent " + d)], N.tab2.linhas.map(l => [l[0], l[1], ...l[2]])) +
    T("Caixas de gordura (5.1.5.1)", 18, ["Tipo", "Forma", "Septo", "Retenção", "Saída", "Uso"], N.caixasGordura.linhas) +
    T(N.tabD1.titulo, 62, ["DN ramal", "DN vent."], N.tabD1.linhas);

  // ---- calculadora UHC
  const sel = $("#ap");
  N.tab3.linhas.forEach(l => sel.insertAdjacentHTML("beforeend", `<option>${l[0]}</option>`));
  const grupo = [];
  $("#add").onclick = () => {
    const q = +$("#qt").value;
    if (!Number.isInteger(q) || q < 1) { $("#outGrupo").innerHTML = "⚠️ Quantidade deve ser um número inteiro de 1 para cima."; return; }
    grupo.push([sel.value, q]); calcGrupo();
  };
  // 4.2.2.3: caixa sifonada pode reunir lavatório, bidê, banheira e chuveiro (+ lavagem de piso)
  const NA_CS = ["Lavatório", "Bidê", "Banheira", "Chuveiro"];
  $("#limpa").onclick = () => { grupo.length = 0; calcGrupo(); };
  function calcGrupo() {
    let u = 0, dnMin = 0, bacia = false, semB = 0, fora = [], mict = false;
    grupo.forEach(([n, q]) => {
      u += C.uhcAparelho(n) * q; dnMin = Math.max(dnMin, C.dnMinAparelho(n));
      if (n === "Bacia sanitária") bacia = true;
      else if (NA_CS.some(k => n.startsWith(k))) semB += C.uhcAparelho(n) * q;
      else { fora.push(n); if (n.startsWith("Mictório")) mict = true; }
    });
    const csTxt = mict && grupo.length > 1 ? "⚠️ caixa sifonada de mictório tem tampa cega e não recebe outros aparelhos (4.2.2.4) — separe o mictório"
      : semB ? (C.caixaSifonada(semB) ? "DN " + C.caixaSifonada(semB) : "acima de 15 UHC") + ` (só ${fmt(semB)} UHC de lavatório/bidê/banheira/chuveiro — 4.2.2.3)` : "—";
    $("#grupo").innerHTML = grupo.map(([n, q]) => `<li>${q} × ${n} (${fmt(C.uhcAparelho(n))} UHC)</li>`).join("");
    $("#outGrupo").innerHTML = grupo.length ? `<b>Total: ${fmt(u)} UHC</b><br>
      Ramal de esgoto (Tab. 5${dnMin ? `, mín. DN ${dnMin} pela Tab. 3` : ""}): <b>DN ${C.ramalEsgoto(u, dnMin) ?? "acima de 160 UHC → subcoletor/Tab. 7"}</b><br>
      Caixa sifonada (5.1.1.2): <b>${csTxt}</b>${fora.length && !mict ? `<br><small>Não somados na caixa sifonada: ${[...new Set(fora)].join(", ")} (desconector próprio).</small>` : ""}<br>
      Ramal de ventilação (Tab. 8, ${bacia ? "com" : "sem"} bacia): <b>DN ${C.ramalVentilacao(u, bacia) ?? "acima da tabela"}</b>` : "";
  }

  // ---- calculadoras de prumada / coletor / gordura / recalque
  const v = id => { const s = $(id).value.trim().replace(",", "."); return s === "" ? NaN : +s; };
  const ruim = (...xs) => xs.some(x => !isFinite(x) || x <= 0);
  const AVISO = "⚠️ Preencha com números maiores que zero (use vírgula ou ponto).";
  function calcTQ() {
    const u = v("#tqU"), p = v("#tqP"), L = v("#tqL");
    if (ruim(u, p, L) || !Number.isInteger(p)) { $("#outTQ").innerHTML = AVISO + " Pavimentos: número inteiro."; return; }
    const dn = C.tuboQueda(u, p, $("#tqB").checked ? 100 : 0);
    let s = `Tubo de queda (Tab. 6, ${p > 3 ? "mais de 3" : "até 3"} pav.): <b>DN ${dn ?? "acima de 300"}</b>`;
    if (dn) { const cv = C.colunaVentilacao(dn, u, L); s += `<br>Coluna de ventilação (Tab. 2, L = ${fmt(L)} m): <b>${cv.dn ? "DN " + cv.dn + ` (permite ${fmt(cv.limite)} m)` : cv.motivo}</b>`;
      s += `<br>Zona de sobrepressão na base: 40 × DN = <b>${fmt((40 * dn / 1000).toFixed(2))} m</b> acima do pé do TQ (4.2.4.3)`; }
    $("#outTQ").innerHTML = s;
  }
  function calcCol() {
    const u = v("#coU");
    if (ruim(u)) { $("#outCol").innerHTML = AVISO; return; }
    $("#outCol").innerHTML = [0.5, 1, 2, 4].map(d => `${fmt(d)}% → <b>${C.coletor(u, d) ? "DN " + Math.max(100, C.coletor(u, d)) : "não cabe"}</b>`).join(" · ") + "<br><small>Coletor predial mínimo DN 100 (5.1.4.1). Declividade máx. 5%.</small>";
  }
  function calcCG() {
    const c = v("#cgC"), n = v("#cgN");
    if (ruim(c) || !Number.isInteger(c)) { $("#outCG").innerHTML = AVISO + " Cozinhas: número inteiro."; return; }
    const r = C.caixaGordura(c, n > 0 ? n : null, $("#cgE").checked);
    if ((c > 12 || $("#cgE").checked) && !(n > 0)) { $("#outCG").innerHTML = `<b>${r.tipo}</b><br>Informe as pessoas (N) para calcular V = 2N + 20.`; return; }
    $("#outCG").innerHTML = `<b>${r.tipo}</b>${r.volume ? `<br>V = 2 × ${n} + 20 = <b>${r.volume} L</b>` : ""}`;
  }
  function calcRec() {
    const q = v("#reQ"), t = v("#reT"), vt = v("#reV"), qa = v("#reA");
    const opc = x => isNaN(x) ? false : ruim(x); // opcional: vazio ok; preenchido tem de ser > 0
    if (ruim(q, t) || opc(vt) || opc(qa)) { $("#outRec").innerHTML = AVISO + " (Vt e q podem ficar vazios.)"; return; }
    const vu = C.volumeUtil(q, t), d = isNaN(vt) || isNaN(qa) ? null : C.detencao(vt, qa);
    $("#outRec").innerHTML = `Volume útil Vu = Q·t/4 = <b>${fmt(vu.toFixed(3))} m³</b>${t < 10 ? " ⚠️ norma recomenda t ≥ 10 min (5.1.6.8)" : ""}` +
      (d !== null ? `<br>Detenção d = Vt/q = <b>${fmt(d.toFixed(1))} min</b> ${d > 30 ? "⚠️ acima de 30 min (5.1.6.12)" : "✔ ≤ 30 min"}` : "") +
      (!isNaN(qa) && q < 2 * qa ? "<br>⚠️ norma recomenda bomba ≥ 2× a vazão afluente (5.1.6.9)" : "");
  }
  ["#tqU", "#tqP", "#tqL", "#tqB"].forEach(i => $(i).oninput = calcTQ);
  ["#coU"].forEach(i => $(i).oninput = calcCol);
  ["#cgC", "#cgN", "#cgE"].forEach(i => $(i).oninput = calcCG);
  ["#reQ", "#reT", "#reV", "#reA"].forEach(i => $(i).oninput = calcRec);

  // ---- nosso prédio
  function renderPredio() {
    const r = C.predio(), A = C.predioAlternativo();
    const p = N.predio;
    $("#predio").innerHTML = `
      <p class="nota">Base: ${p.fonte}. ${p.pavimentos} pavimentos-tipo × ${p.aptosPorPav} aptos = ${r.nAptos} aptos; pé-direito ${fmt(p.peDireito.toFixed(2))} m.
      <b>PRÉ-DIMENSIONAMENTO de estudo</b> — o traçado (quantos tubos de queda por apto e em qual shaft) ainda <b>A CONFIRMAR</b> quando voltarmos ao esgoto.</p>
      <p class="nota">⚠️ <b>Cenário literal da v7 (não adotado):</b> os “2 chuveiros” da suíte e as “2 pias” da cozinha são pontos de água fria, não aparelhos de esgoto confirmados — <b>A CONFIRMAR</b>.
      Alternativa (${p.alternativa.nome}): <b>${A.uhcApto} UHC/apto</b>, TQ banheiros ${A.tq[0].uhc} UHC (DN ${A.tq[0].dn}), TQ gordura ${A.tq[1].uhc} UHC (DN ${A.tq[1].dn}), coletor <b>${A.uhcColetor} UHC</b> (1% → DN ${A.coletor.d1}).</p>
      <h3>Por ambiente (1 apto)</h3>
      <div class="rol"><table><tr><th>Ambiente</th><th>UHC</th><th>Ramal</th><th>Cx sifonada</th><th>Ramal vent.</th></tr>
      ${r.ambientes.map(a => `<tr><td>${a.nome}</td><td>${fmt(a.uhc)}</td><td>DN ${a.ramal}</td><td>${a.cs ? "DN " + a.cs + " (" + a.csUhc + " UHC)" : "—"}</td><td>DN ${a.ventil}</td></tr>`).join("")}
      </table></div>
      <p>Total do apto: <b>${r.uhcApto} UHC</b>.</p>
      <h3>Tubos de queda (por coluna de aptos, ${p.pavimentos} pav.)</h3>
      <div class="rol"><table><tr><th>Prumada</th><th>UHC/pav</th><th>UHC total</th><th>DN TQ</th><th>Coluna vent. (L≈${fmt(r.tq[0].L.toFixed(1))} m)</th></tr>
      ${r.tq.map(t => `<tr><td>${t.nome}</td><td>${t.uhcPav}</td><td>${t.uhc}</td><td>DN ${t.dn}</td><td>${t.cv.dn ? "DN " + t.cv.dn : t.cv.motivo}</td></tr>`).join("")}
      </table></div>
      <h3>Coletor predial</h3>
      <p>Regra 5.1.4.2 (residencial): só o maior aparelho de cada banheiro → ${r.uhcColetorApto} UHC/apto × ${r.nAptos} + ${r.uhcTerreo} da guarita = <b>${r.uhcColetor} UHC</b>
      (somando tudo seriam ${r.uhcTodos}). A planilha da Missão 32 divide em subcoletores por shaft (SC-B 180, SC-L 60, SC-G 80).<br>Tab. 7: 1% → <b>DN ${r.coletor.d1}</b> · 2% → <b>DN ${r.coletor.d2}</b> · 4% → <b>DN ${r.coletor.d4}</b></p>
      <h3>Caixa de gordura</h3>
      <p>1 caixa por TQ de cozinha (${p.pavimentos} cozinhas): <b>${r.gorduraPorTQ.tipo}</b>. Uma só para as ${r.nAptos} cozinhas: <b>${r.gorduraUnica.tipo}</b> → V = 2N + 20 (N = pessoas — A CONFIRMAR).</p>
      <h3>Lembretes para o projeto de esgoto</h3>
      <ul>
        <li>Pia: TQ exclusivo com ventilação primária → caixa de gordura <b>coletiva</b> (4.2.4.4); nada de caixa de gordura nos andares.</li>
        <li>Tanque/máquina: TQ exclusivo com caixa sifonada especial no pé é permitido (4.2.2.6); cuidado com espuma nas zonas de sobrepressão (4.2.4.2/4.2.4.3).</li>
        <li>Nada ligado nos 40 DN acima do pé dos TQs (DN 100 → 4,0 m, pega o 1º pavimento-tipo inteiro se o desvio for no teto do térreo).</li>
        <li>Caixas de inspeção a ≥ 2,00 m dos TQs (prédio com mais de 2 pav.) e ≤ 25 m entre si.</li>
        <li>Só ventilação primária exige verificar pelo Anexo C; senão, prever colunas de ventilação (Tab. 2/Tab. 8).</li>
        <li>Terminal de ventilação ≥ 0,30 m acima da cobertura (≥ 2,00 m se a laje tiver uso) e ≥ 4,00 m de janelas.</li>
        <li>Esgoto separado do pluvial (4.1.3.1). Documentação: plantas, esquema vertical, ampliados, memorial, orçamento (4.5).</li>
      </ul>`;
  }

  // ---- PDF do Silva (fica só no aparelho)
  const DB = "nbr8160", ST = "pdf";
  const idb = () => new Promise((ok, err) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => ok(r.result); r.onerror = () => err(r.error); });
  const guarda = async blob => { const d = await idb(); return new Promise((ok, err) => { const t = d.transaction(ST, "readwrite"); t.objectStore(ST).put(blob, "norma"); t.oncomplete = ok; t.onerror = () => err(t.error); }); };
  const pega = async () => { const d = await idb(); return new Promise(ok => { const r = d.transaction(ST).objectStore(ST).get("norma"); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); }); };
  let pdfDoc = null, pagAtual = 1;
  async function carregaPdf() {
    const blob = await pega().catch(() => null);
    $("#pdfStatus").textContent = blob ? "Norma salva neste aparelho ✔ (funciona sem internet)" : "Ainda não carregada: toque em “Escolher PDF” e selecione o arquivo da NBR 8160 no celular (uma vez só).";
    if (!blob || !window.pdfjsLib) return;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    pdfDoc = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
    $("#pdfTot").textContent = pdfDoc.numPages; mostra(pagAtual);
  }
  async function mostra(n) {
    if (!pdfDoc) { abrirAba("aPdf"); return; }
    pagAtual = Math.min(Math.max(1, n), pdfDoc.numPages); $("#pdfPag").value = pagAtual;
    const page = await pdfDoc.getPage(pagAtual), cv = $("#cv");
    const w = Math.min(document.body.clientWidth - 16, 900), vp0 = page.getViewport({ scale: 1 });
    const esc = (w / vp0.width) * (window.devicePixelRatio || 1), vp = page.getViewport({ scale: esc });
    cv.width = vp.width; cv.height = vp.height; cv.style.width = w + "px";
    await page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
  }
  $("#arq").onchange = async e => { const f = e.target.files[0]; if (!f) return; await guarda(f); await carregaPdf(); };
  $("#ant").onclick = () => mostra(pagAtual - 1);
  $("#prox").onclick = () => mostra(pagAtual + 1);
  $("#pdfPag").onchange = e => mostra(+e.target.value);
  document.addEventListener("click", e => { const b = e.target.closest(".pg"); if (b) { abrirAba("aPdf"); pagAtual = +b.dataset.pag; mostra(pagAtual); } });

  render(); calcGrupo(); calcTQ(); calcCol(); calcCG(); calcRec(); renderPredio(); carregaPdf();
  let ini = "aBusca"; try { ini = localStorage.getItem("aba") || ini; } catch (e) {}
  abrirAba(ini);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
