/* v2 — desenhos interativos (SVG) do app NBR 8160. Usa window.NBR e window.CALC (app.js). */
(function () {
  const N = window.NBR, C = window.CALC;
  const NS = "http://www.w3.org/2000/svg";
  const $ = s => document.querySelector(s);
  const fmt = (n, d = 2) => Number(n).toLocaleString("pt-BR", { maximumFractionDigits: d });
  function S(tag, at = {}, kids = []) {
    const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]);
    (Array.isArray(kids) ? kids : [kids]).forEach(k => k != null && e.append(typeof k === "string" ? document.createTextNode(k) : k));
    return e;
  }
  function H(tag, at = {}, html = "") { const e = document.createElement(tag); Object.assign(e, at); if (html) e.innerHTML = html; return e; }
  const T = (x, y, txt, cls = "lb", extra = {}) => S("text", { x, y, class: cls, ...extra }, txt);
  const pgBtn = p => `<button class="pg" data-pag="${p}">📄 ver pág. ${p}</button>`;
  function slider(lbl, min, max, step, val, unit, on) {
    const w = H("label", { className: "sl" });
    w.innerHTML = `<span>${lbl}: <b></b>${unit}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}">`;
    const b = w.querySelector("b"), i = w.querySelector("input");
    const up = () => { b.textContent = fmt(+i.value); on(+i.value); };
    i.oninput = up; setTimeout(up); return w;
  }
  function chips(opts, val, on) {
    const w = H("div", { className: "chips" });
    opts.forEach(([v, l]) => { const b = H("button", { className: "chip" + (v === val ? " on" : ""), textContent: l }); b.onclick = () => { w.querySelectorAll(".chip").forEach(x => x.classList.remove("on")); b.classList.add("on"); on(v); }; w.append(b); });
    setTimeout(() => on(val)); return w;
  }

  /* ================= PRÉDIO ANIMADO ================= */
  function predio(box) {
    const st = { prumada: 0, cen: "lit", sel: null };
    const svgW = 360, F = 34, top = 70, nP = N.predio.pavimentos, yTer = top + nP * F, ySolo = yTer + F, yBase = ySolo + 22;
    const xTQ = 175, xCV = 197, xCI = xTQ + 24 * 2 + 40;
    const svg = S("svg", { viewBox: `0 0 ${svgW} ${yBase + 50}`, class: "draw predio" });
    const info = H("div", { className: "kpis" }), card = H("div", { className: "out" });
    const ctl = H("div");
    ctl.append(chips([[0, "🚽 Banheiros"], [1, "🍳 Gordura"], [2, "🧺 Lavanderia"]], 0, v => { st.prumada = v; draw(); }));
    ctl.append(chips([["lit", "Cenário v7 (2 chuv./2 pias)"], ["alt", "Alternativo (1/1)"]], "lit", v => { st.cen = v; draw(); }));
    box.append(ctl, svg, card, info);
    const icones = ["🚽🚿", "🍳", "🧺"], base = ["CI", "CG", "CS esp."];
    function draw() {
      const R = st.cen === "lit" ? C.predio() : C.predioAlternativo(), tq = R.tq[st.prumada], dn = tq.dn, uPav = tq.uhcPav;
      const sw = dn >= 150 ? 10 : dn >= 100 ? 8 : 6;
      svg.replaceChildren();
      // céu, prédio, laje
      svg.append(S("rect", { x: 30, y: top, width: 220, height: nP * F + F, class: "bld" }));
      svg.append(S("rect", { x: 22, y: top - 6, width: 236, height: 6, class: "laje" }));
      svg.append(S("rect", { x: 0, y: ySolo, width: svgW, height: 60, class: "solo" }));
      T && svg.append(T(8, ySolo + 14, "terreno", "lb mu"));
      for (let k = 0; k <= nP; k++) {
        const y = top + k * F, pav = nP - k; // k=0 -> 10º
        svg.append(S("line", { x1: 30, x2: 250, y1: y + F, y2: y + F, class: "piso" }));
        const g = S("g", { class: "andar" + (st.sel === pav ? " sel" : ""), "data-p": pav });
        g.append(S("rect", { x: 30, y: y + 1, width: 220, height: F - 2, class: "hit" }));
        if (pav >= 1) {
          g.append(T(36, y + 21, pav + "º", "lb b"));
          g.append(T(70, y + 22, icones[st.prumada], "ico"));
          g.append(S("line", { x1: 108, x2: xTQ, y1: y + F - 8, y2: y + F - 4, class: "ramal" }));
          const acc = uPav * (nP - pav + 1);
          g.append(T(262, y + 21, acc + " UHC", "lb" + (st.sel === pav ? " b" : "")));
        } else g.append(T(36, y + 21, "térreo", "lb mu"));
        g.onclick = () => { st.sel = pav; draw(); };
        svg.append(g);
      }
      // zona de sobrepressão: 40 DN acima do desvio da base, 10 DN depois (escala 3 m = F px)
      const px = m => m * F / N.predio.peDireito, z40 = px(40 * dn / 1000), z10 = px(10 * dn / 1000);
      svg.append(S("rect", { x: xTQ - 14, y: yBase - z40, width: 28, height: z40, class: "zona" }));
      svg.append(S("rect", { x: xTQ, y: yBase - 10, width: z10, height: 20, class: "zona" }));
      svg.append(T(36, ySolo + 30, "▮ zona de sobrepressão", "lb red b"));
      svg.append(T(36, ySolo + 43, `40 DN = ${fmt(40 * dn / 1000)} m · não ligar ramal`, "lb red"));
      // coluna de ventilação + ventilação primária acima da cobertura
      svg.append(S("path", { d: `M${xTQ} ${yBase - z40 - 6} L${xCV} ${yBase - z40 - 24} L${xCV} ${top - 18} L${xTQ} ${top - 30}`, class: "cv" }));
      svg.append(S("line", { x1: xTQ, x2: xTQ, y1: top - 40, y2: yBase, class: "tq", "stroke-width": sw }));
      svg.append(S("path", { d: `M${xTQ - 9} ${top - 40} h18 M${xTQ - 6} ${top - 46} h12`, class: "chapeu" }));
      svg.append(T(xTQ + 14, top - 44, "ventilação primária", "lb b"));
      svg.append(T(xTQ + 14, top - 32, "≥ 0,30 m acima da laje", "lb"));
      svg.append(T(xCV + 6, top + 60, `CV DN ${tq.cv.dn ?? "?"}`, "lb blue", { transform: `rotate(90 ${xCV + 6} ${top + 60})` }));
      // desvio na base -> subcoletor -> caixa
      svg.append(S("path", { d: `M${xTQ} ${yBase} L${xCI} ${yBase}`, class: "tq", "stroke-width": sw }));
      svg.append(S("rect", { x: xCI, y: yBase - 14, width: 30, height: 28, rx: 3, class: "caixa" }));
      svg.append(T(xCI + 15, yBase + 4, base[st.prumada], "lb b", { "text-anchor": "middle" }));
      if (st.prumada === 0) { // 4.2.6.2: distância vale para CAIXA DE INSPEÇÃO
        svg.append(S("line", { x1: xTQ, x2: xCI, y1: yBase + 22, y2: yBase + 22, class: "cota" }));
        svg.append(T((xTQ + xCI) / 2, yBase + 34, "CI ≥ 2,00 m do TQ", "lb", { "text-anchor": "middle" }));
      } else svg.append(T(xCI + 15, yBase + 30, st.prumada === 1 ? "caixa de gordura coletiva" : "caixa sifonada especial", "lb mu", { "text-anchor": "middle" }));
      svg.append(T(xTQ - 4, yBase + 46, `TQ DN ${dn}`, "lb b", { "text-anchor": "end" }));
      // gotas descendo
      const path = `M${xTQ} ${top + 10} L${xTQ} ${yBase} L${xCI} ${yBase}`;
      for (let i = 0; i < 6; i++) {
        const d = S("circle", { r: 3.2, class: "gota" });
        d.append(S("animateMotion", { dur: "2.6s", repeatCount: "indefinite", begin: (i * 0.43) + "s", path }));
        svg.append(d);
      }
      // cartão e KPIs
      const sel = st.sel;
      if (sel && sel >= 1) {
        const acc = uPav * (nP - sel + 1), dnK = C.tuboQueda(acc, nP, st.prumada === 0 ? 100 : 0); // banheiros: bacia exige DN 100 (Tab. 3)
        card.innerHTML = `<b>${sel}º pavimento</b>: o tubo de queda já leva <b>${acc} UHC</b> (${nP - sel + 1} andares × ${uPav}). Pela Tab. 6 esse trecho precisaria de <b>DN ${dnK}</b>; o TQ é dimensionado pelo total (${tq.uhc} UHC → <b>DN ${dn}</b>).`;
      } else card.innerHTML = "👆 Toque num andar para ver quanto esgoto (UHC) o tubo de queda já carrega ali.";
      info.innerHTML = [["UHC por andar", uPav], ["UHC no TQ", tq.uhc], ["DN do TQ", dn], ["Coluna de vent.", "DN " + (tq.cv.dn ?? "?")], ["Coletor (todo o prédio)", R.uhcColetor + " UHC → DN " + R.coletor.d1 + " a 1%"]]
        .map(([k, v]) => `<div class="kpi"><small>${k}</small><b>${v}</b></div>`).join("");
    }
  }

  /* ================= TEMAS (diagramas) ================= */
  const temas = [];
  const tema = (id, ico, tit, item, pag, fn, tags) => temas.push({ id, ico, tit, item, pag, fn, tags });

  tema("fecho", "💧", "Fecho hídrico: por que o sifão seca", "5.1.1.1 · Anexo C", 54, box => {
    const svg = S("svg", { viewBox: "0 0 300 190", class: "draw" }), out = H("div", { className: "out" });
    let sem = 4.5, y = 0.7, tipo = 0;
    const tipos = [{ n: "Desconector tipo 1 (exemplo do Anexo C)", Ho: 55, Ce: 8e-3 }, { n: "Desconector tipo 2 (exemplo do Anexo C)", Ho: 50, Ce: 5e-3 }];
    function draw() {
      const t = tipos[tipo], he = t.Ce * 2340 * (1 - y) * sem, rest = t.Ho - he, f = Math.max(0, rest) / t.Ho;
      svg.replaceChildren();
      // sifão em U
      svg.append(S("path", { d: "M60 20 V120 a40 40 0 0 0 80 0 V60 h90", class: "tubo" }));
      const nivel = 120 - 60 * f; // água sobe até 60 quando cheio
      svg.append(S("path", { d: `M60 ${nivel} V120 a40 40 0 0 0 80 0 V${nivel}`, class: "agua", "stroke-width": 22 }));
      svg.append(S("path", { d: "M60 20 V120 a40 40 0 0 0 80 0 V60 h90", class: "tubo2" }));
      svg.append(T(150, 40, rest > 0 ? "🦨 gás do esgoto bloqueado" : "⚠️ fecho rompido: gás passa!", rest > 0 ? "lb green" : "lb red"));
      svg.append(T(10, 14, "aparelho ↓", "lb mu")); svg.append(T(232, 54, "→ ramal", "lb mu"));
      svg.append(T(150, 150, `Ho ${t.Ho} mm − evaporação ${fmt(he, 1)} mm`, "lb")); svg.append(T(150, 168, `= sobra ${fmt(rest, 1)} mm`, "lb b"));
      out.innerHTML = `he = Ce·π·(1−y)·Δt = ${t.Ce}·2340·(1−${fmt(y)})·${fmt(sem, 1)} = <b>${fmt(he, 2)} mm</b> (π = 2 340 Pa, valor do exemplo da norma).<br>
        Fecho mínimo de todo desconector: <b>50 mm</b> (5.1.1.1). A norma usa Δt = 4,5 semanas sem uso como padrão. ${sem >= 4.5 && sem <= 4.5 && y === 0.7 && tipo === 0 ? "✔ confere com o exemplo do Anexo C (25,27 mm)." : ""}`;
    }
    box.append(chips(tipos.map((t, i) => [i, t.n.replace(" (exemplo do Anexo C)", "")]), 0, v => { tipo = v; draw(); }),
      slider("Semanas sem uso", 0, 12, 0.5, 4.5, " sem.", v => { sem = v; draw(); }),
      slider("Umidade do ar", 0.3, 0.95, 0.05, 0.7, "", v => { y = v; draw(); }), svg, out);
  }, "fecho hidrico sifao evaporacao desconector gas cheiro");

  tema("decl", "📐", "Declividade: o cano tem de descer", "4.2.3.2 · 4.2.5.2", 4, box => {
    const svg = S("svg", { viewBox: "0 0 320 150", class: "draw" }), out = H("div", { className: "out" });
    let i = 2, dn = 100, L = 5;
    function draw() {
      const ang = Math.atan(i / 100) * 180 / Math.PI * 4, min = dn <= 75 ? 2 : 1, ok = i >= min && i <= 5;
      svg.replaceChildren();
      const g = S("g", { transform: `rotate(${ang} 30 60)` });
      g.append(S("rect", { x: 30, y: 50, width: 260, height: dn / 7, rx: 4, class: "cano" }));
      g.append(S("rect", { x: 30, y: 50 + dn / 7 * 0.55, width: 260, height: dn / 7 * 0.45, class: "fluxo" }));
      if (i > 0) for (let k = 0; k < 7; k++) { // pedacinhos sendo levados: mais rápido com mais declividade
        const c = S("circle", { r: 2.5, cy: 50 + dn / 7 * 0.78, class: "gota" });
        c.append(S("animate", { attributeName: "cx", values: "32;288", dur: Math.max(0.5, 4 / i) + "s", begin: (k * Math.max(0.5, 4 / i) / 7) + "s", repeatCount: "indefinite" }));
        g.append(c);
      } else svg.append(T(150, 100, "parado: sem declividade não escoa", "lb red"));
      svg.append(g);
      svg.append(T(30, 140, `Desce ${fmt(i / 100 * L * 100, 1)} cm em ${fmt(L, 1)} m (${fmt(i, 1)} cm por metro)`, "lb b"));
      svg.append(T(30, 22, ok ? "✔ dentro da norma" : i < min ? `✖ abaixo do mínimo recomendado (${min}%)` : "✖ acima do máximo de 5% (coletor/subcoletor)", ok ? "lb green" : "lb red"));
      out.innerHTML = `Mínimos <b>recomendados</b>: <b>2%</b> para DN ≤ 75 e <b>1%</b> para DN ≥ 100 (4.2.3.2). Máximo considerado: <b>5%</b> (4.2.5.2). Declividade sempre <b>constante</b>.<br><small>Desenho com inclinação exagerada ×4 para enxergar.</small>`;
    }
    box.append(chips([[40, "DN 40"], [50, "DN 50"], [75, "DN 75"], [100, "DN 100"], [150, "DN 150"]], 100, v => { dn = v; draw(); }),
      slider("Declividade", 0, 8, 0.5, 2, " %", v => { i = v; draw(); }), slider("Comprimento", 1, 25, 0.5, 5, " m", v => { L = v; draw(); }), svg, out);
  }, "declividade inclinacao caimento cano 1% 2% 5%");

  tema("banheiro", "🚽", "Monte um banheiro e veja o diâmetro", "Tab. 3 · Tab. 5 · 5.1.1.2", 16, box => {
    const lista = [["🚽", "Bacia sanitária"], ["🚿", "Chuveiro de residência"], ["🪥", "Lavatório de residência"], ["🛁", "Banheira de residência"], ["🍽️", "Pia de cozinha residencial"], ["🧺", "Tanque de lavar roupas"], ["🌀", "Máquina de lavar roupas"], ["🫧", "Máquina de lavar louças"]];
    const sel = [], pal = H("div", { className: "chips" }), out = H("div", { className: "out" }), bar = H("div", { className: "barra" }), itens = H("div", { className: "itens" });
    lista.forEach(([e, n]) => { const b = H("button", { className: "chip big", innerHTML: `${e}<small>${n.split(" ")[0]} · ${fmt(C.uhcAparelho(n))}</small>` }); b.onclick = () => { sel.push([e, n]); draw(); }; pal.append(b); });
    const lim = H("button", { className: "chip", textContent: "↺ limpar" }); lim.onclick = () => { sel.length = 0; draw(); }; pal.append(lim);
    function draw() {
      const u = sel.reduce((s, [, n]) => s + C.uhcAparelho(n), 0), dnMin = Math.max(0, ...sel.map(([, n]) => C.dnMinAparelho(n)));
      const dn = u ? C.ramalEsgoto(u, dnMin) : null;
      itens.innerHTML = sel.length ? sel.map(([e], k) => `<span class="pop" style="animation-delay:${k * 30}ms">${e}</span>`).join("") : "<span class='mu'>toque nos aparelhos acima ⬆️</span>";
      const max = 20, faixas = [[3, 40], [6, 50], [20, 75]];
      bar.innerHTML = faixas.map(([l, d], k) => `<i style="left:${(l / max) * 100}%">${d}</i>`).join("") + `<b style="width:${Math.min(100, u / max * 100)}%"></b><em>${fmt(u)} UHC</em>`;
      const bacia = sel.some(([, n]) => n === "Bacia sanitária");
      const csU = sel.filter(([, n]) => /^(Lavatório|Chuveiro|Banheira)/.test(n)).reduce((s, [, n]) => s + C.uhcAparelho(n), 0);
      out.innerHTML = !u ? "Cada aparelho tem um “peso” de contribuição (UHC). Somando, a Tabela 5 dá o diâmetro do ramal de esgoto." :
        `Ramal de esgoto: <b class="dn">DN ${dn ?? ">100"}</b>${dnMin > (dn ?? 0) - 1 && dnMin ? ` <small>(o maior aparelho já exige DN ${dnMin} — Tab. 3)</small>` : ""}<br>
         ${csU ? `Caixa sifonada (chuveiro/lavatório/banheira, ${fmt(csU)} UHC): <b>DN ${C.caixaSifonada(csU) ?? "acima de 150"}</b><br>` : ""}
         Ramal de ventilação (Tab. 8, ${bacia ? "com" : "sem"} bacia): <b>DN ${C.ramalVentilacao(u, bacia) ?? "acima da tabela"}</b>`;
    }
    box.append(pal, itens, bar, out); draw();
  }, "uhc banheiro aparelho ramal diametro caixa sifonada bacia chuveiro");

  tema("sobre", "💥", "Zonas de sobrepressão (espuma volta!)", "4.2.4.3 · Fig. 1", 6, box => {
    const svg = S("svg", { viewBox: "0 0 320 230", class: "draw" }), out = H("div", { className: "out" });
    let dn = 100;
    function draw() {
      const pxm = 20, z40 = 40 * dn / 1000 * pxm, z10 = 10 * dn / 1000 * pxm; // escala: 20 px por metro (DN 150 → 120 px)
      svg.replaceChildren();
      svg.append(S("rect", { x: 46, y: 170 - z40, width: 28, height: z40, class: "zona" }));
      svg.append(S("rect", { x: 60, y: 160, width: z10, height: 20, class: "zona" }));
      svg.append(S("rect", { x: 60 + z10 + 60, y: 160, width: z40 * 0.6, height: 20, class: "zona" }));
      svg.append(S("path", { d: "M60 5 V170 H300", class: "tq", "stroke-width": 9 }));
      // ramais "ok" sempre acima da zona (a zona máxima, DN 150, começa em y = 50)
      [18, 38].forEach(y => { svg.append(S("line", { x1: 10, x2: 58, y1: y, y2: y + 6, class: "ramal" })); svg.append(T(4, y - 4, "✔ ok", "lb green")); });
      svg.append(S("line", { x1: 10, x2: 58, y1: 150, y2: 156, class: "ramal bad" })); svg.append(T(2, 146, "✖ espuma", "lb red"));
      svg.append(T(82, 175 - z40 / 2, `40 DN = ${fmt(40 * dn / 1000)} m`, "lb red b")); svg.append(T(62, 200, `10 DN = ${fmt(10 * dn / 1000)} m`, "lb red"));
      svg.append(T(60 + z10 + 60, 200, "40 DN antes do próximo desvio", "lb red"));
      for (let i = 0; i < 8; i++) { const b = S("circle", { r: 4, class: "espuma" }); b.append(S("animate", { attributeName: "cy", values: "165;120;165", dur: (1.4 + i * 0.13) + "s", repeatCount: "indefinite" })); b.setAttribute("cx", 52 + (i % 4) * 5); svg.append(b); }
      out.innerHTML = `Na base do tubo de queda e nos desvios a água “freia” e o ar é comprimido: a espuma de sabão volta pelos ralos. <b>Não ligue ramais</b> nessas zonas (4.2.4.2 a). Para DN ${dn}: 40 DN = <b>${fmt(40 * dn / 1000)} m</b>, 10 DN = <b>${fmt(10 * dn / 1000)} m</b>. Ver a Figura 1 original: ${pgBtn(6)}`;
    }
    box.append(chips([[75, "DN 75"], [100, "DN 100"], [150, "DN 150"]], 100, v => { dn = v; draw(); }), svg, out);
  }, "sobrepressao espuma 40 diametros base tubo de queda desvio zona");

  tema("terminal", "🌬️", "Ventilação: onde termina no telhado", "4.3.5 · 4.3.6 · Fig. 3", 10, box => {
    const svg = S("svg", { viewBox: "0 0 320 200", class: "draw" }), out = H("div", { className: "out" });
    let uso = false, dist = 5;
    function draw() {
      const hMin = uso ? 2 : 0.3, perto = dist < 4, k = 30, laje = 160, xJ = 60, xV = xJ + dist * 40;
      svg.replaceChildren();
      svg.append(S("rect", { x: 0, y: laje, width: 320, height: 40, class: "bld" }));
      svg.append(S("rect", { x: xJ - 18, y: laje - 70, width: 36, height: 60, class: "janela" })); svg.append(T(xJ - 22, laje - 76, "janela", "lb mu"));
      if (uso) svg.append(T(4, laje - 4, "🙂 laje com uso", "lb"));
      const verga = laje - 70; // topo da janela desenhada
      const topo = perto ? Math.min(laje - hMin * k, verga - 1 * k) : laje - hMin * k; // 1,00 m acima da verga (4.3.6 a)
      if (perto) { svg.append(S("line", { x1: xJ - 18, x2: 300, y1: verga, y2: verga, class: "cota" })); svg.append(T(xJ + 22, verga + 10, "verga", "lb mu")); }
      svg.append(S("line", { x1: Math.min(xV, 300), x2: Math.min(xV, 300), y1: 200, y2: topo, class: "tq", "stroke-width": 8 }));
      svg.append(S("path", { d: `M${Math.min(xV, 300) - 10} ${topo} h20 M${Math.min(xV, 300) - 7} ${topo - 6} h14`, class: "chapeu" }));
      svg.append(S("line", { x1: xJ, x2: Math.min(xV, 300), y1: laje + 20, y2: laje + 20, class: "cota" }));
      svg.append(T((xJ + Math.min(xV, 300)) / 2 - 10, laje + 34, `${fmt(dist, 1)} m`, "lb b"));
      svg.append(T(Math.min(xV, 300) - 70, topo - 12, perto ? "1,00 m acima da verga" : `≥ ${fmt(hMin)} m acima da laje`, perto ? "lb red b" : "lb green b"));
      out.innerHTML = `Altura mínima acima da cobertura: <b>0,30 m</b>, ou <b>2,00 m</b> se a laje tiver outro uso (4.3.6 b). A menos de <b>4,00 m</b> de janela/porta/vão, o terminal tem de ficar <b>1,00 m acima da verga</b> (4.3.6 a). Terminal com chapéu/tê contra chuva (4.3.6 d).`;
    }
    box.append(chips([[false, "Laje só cobertura"], [true, "Laje com uso (terraço)"]], false, v => { uso = v; draw(); }),
      slider("Distância até a janela", 0.5, 6, 0.1, 5, " m", v => { dist = v; draw(); }), svg, out);
  }, "ventilacao terminal telhado cobertura janela 4 m 0,30 2,00");

  tema("gordura", "🍳", "Caixa de gordura certa para cada caso", "5.1.5.1", 18, box => {
    const svg = S("svg", { viewBox: "0 0 320 170", class: "draw" }), out = H("div", { className: "out" });
    let n = 10, pes = 160;
    function draw() {
      const r = C.caixaGordura(n, pes, false), tipo = r.tipo.slice(0, 3);
      const d = { CGP: 0.30, CGS: 0.40, CGD: 0.60 }[tipo], k = 200, rr = d ? d * k / 2 : 0, cy = 98;
      svg.replaceChildren();
      if (d) {
        svg.append(S("circle", { cx: 160, cy, r: rr, class: "caixa" }));
        svg.append(S("line", { x1: 160, x2: 160, y1: cy - rr, y2: cy + rr * 0.6, class: "septo" }));
        svg.append(S("path", { d: `M${160 - rr - 30} ${cy - 10} h30`, class: "ramal" })); svg.append(S("path", { d: `M${160 + rr} ${cy + 10} h30`, class: "ramal" }));
        svg.append(T(160, cy + rr - 4, `Ø ${fmt(d)} m`, "lb b", { "text-anchor": "middle" }));
        svg.append(T(160 - rr / 2, cy + 4, "recebe", "lb mu", { "text-anchor": "middle" })); svg.append(T(160 + rr / 2, cy + 4, "verte", "lb mu", { "text-anchor": "middle" }));
      } else {
        const V = 2 * pes + 20, w = Math.min(280, 80 + V / 6);
        svg.append(S("rect", { x: 160 - w / 2, y: 40, width: w, height: 90, class: "caixa" }));
        svg.append(S("line", { x1: 160 + w / 4, x2: 160 + w / 4, y1: 40, y2: 130, class: "septo" }));
        svg.append(T(160, 90, `CGE  V = 2×${pes}+20 = ${V} L`, "lb b", { "text-anchor": "middle" }));
      }
      svg.append(T(10, 18, r.tipo, "lb b"));
      out.innerHTML = `1 cozinha: CGP (18 L) ou CGS (31 L) · 2: CGS ou CGD · 3 a 12: <b>CGD</b> (120 L) · mais de 12: <b>CGE</b> V = 2N + 20 (5.1.5.1). Duas câmaras com septo fixo. <br>🏢 Nosso prédio: 10 cozinhas por shaft → CGD; as 40 juntas → CGE (decisão pendente).`;
    }
    box.append(slider("Cozinhas ligadas", 1, 40, 1, 10, "", v => { n = v; draw(); }), slider("Pessoas (só CGE)", 10, 400, 10, 160, "", v => { pes = v; draw(); }), svg, out);
  }, "caixa de gordura cgp cgs cgd cge cozinha pia");

  tema("inspecao", "🕳️", "Caixa de inspeção ou poço de visita?", "4.2.6.2 · 5.1.5.3", 19, box => {
    const svg = S("svg", { viewBox: "0 0 320 220", class: "draw" }), out = H("div", { className: "out" });
    let h = 0.8;
    function draw() {
      const k = 80, pv = h > 1, x = 160;
      svg.replaceChildren();
      svg.append(S("rect", { x: 0, y: 20, width: 320, height: 200, class: "solo" }));
      if (!pv) { svg.append(S("rect", { x: x - 0.3 * k, y: 20, width: 0.6 * k, height: h * k, class: "furo" })); svg.append(T(x, 20 + h * k + 16, "CI lado ≥ 0,60 m", "lb b", { "text-anchor": "middle" })); }
      else {
        const duas = h <= 1.8, cabe = h >= 1.5, bal = duas && cabe ? 1.5 : h;
        if (duas && cabe && h > 1.5) svg.append(S("rect", { x: x - 0.3 * k, y: 20, width: 0.6 * k, height: (h - bal) * k, class: "furo" }));
        svg.append(S("rect", { x: x - 0.55 * k, y: 20 + (h - bal) * k, width: 1.1 * k, height: bal * k, class: "furo", ...(duas && !cabe ? { stroke: "var(--no)", "stroke-dasharray": "5 3" } : {}) }));
        if (duas && !cabe) svg.append(T(x, 20 + h * k + 30, "⚠️ balão ≥ 1,50 m não cabe em " + fmt(h) + " m — ver a norma", "lb red b", { "text-anchor": "middle" }));
        for (let y = 30; y < 20 + h * k - 8; y += 14) svg.append(S("line", { x1: x + 0.55 * k - 10, x2: x + 0.55 * k - 2, y1: y, y2: y, class: "degrau" }));
        svg.append(T(x, Math.min(215, 20 + h * k + 14), "PV Ø ≥ 1,10 m, com degraus", "lb b", { "text-anchor": "middle" }));
      }
      svg.append(T(8, 14, `profundidade ${fmt(h)} m → ${pv ? "POÇO DE VISITA" : "CAIXA DE INSPEÇÃO"}`, pv ? "lb red b" : "lb green b"));
      out.innerHTML = `CI até <b>1,00 m</b> de profundidade, lado ≥ 0,60 m. Acima disso, <b>PV</b> com Ø ≥ 1,10 m e degraus; com profundidade total ≤ 1,80 m, em duas partes (balão ≥ 1,50 m + chaminé Ø ≥ 0,60 m) — 5.1.5.3.<br>Distâncias: ≤ <b>25 m</b> entre inspeções, ≤ <b>15 m</b> da ligação pública, ≤ <b>10 m</b> de bacia/CS/CG até a inspeção, ≥ <b>2,00 m</b> do tubo de queda em prédio de mais de 2 pavimentos (4.2.6.2).`;
    }
    box.append(slider("Profundidade", 0.3, 2.4, 0.05, 0.8, " m", v => { h = v; draw(); }), svg, out);
  }, "caixa de inspecao poco de visita profundidade 1 m 25 m 15 m");

  tema("ensaio", "🧪", "Ensaios antes de entregar", "Anexo G", 66, box => {
    const out = H("div", { className: "cards3" });
    const E = [["💧", "Água", "até o transbordamento da abertura mais alta", "≤ 60 kPa (≈ 6 mca)", "antes dos aparelhos"], ["🎈", "Ar", "pressão uniforme sem repor ar", "35 kPa", "antes dos aparelhos"], ["💨", "Fumaça", "fechos hídricos cheios, ventiladores tampados ao sair fumaça", "0,25 kPa", "depois dos aparelhos"]];
    E.forEach(([e, n, c, p, q]) => { const d = H("div", { className: "ens" }); d.innerHTML = `<div class="big">${e}</div><b>${n}</b><small>${c}</small><div class="gauge"><span></span></div><b>${p}</b><small>15 min · ${q}</small>`; d.onclick = () => d.classList.toggle("run"); out.append(d); });
    box.append(H("p", { className: "nota", textContent: "Toque num ensaio para “rodar” o manômetro." }), out);
  }, "ensaio estanqueidade agua ar fumaca 60 kpa 35 kpa 0,25 kpa recebimento");

  function aprender(box) {
    const grade = H("div", { className: "temas" }), area = H("div");
    temas.forEach(t => {
      const b = H("button", { className: "tema", innerHTML: `<span>${t.ico}</span>${t.tit}` });
      b.onclick = () => abrir(t); grade.append(b);
    });
    function abrir(t) {
      area.replaceChildren();
      const c = H("div", { className: "box diag" });
      c.innerHTML = `<h3>${t.ico} ${t.tit}</h3><div class="meta">item ${t.item} ${pgBtn(t.pag)}</div>`;
      t.fn(c); area.append(c); c.scrollIntoView({ behavior: "smooth", block: "start" });
      try { localStorage.setItem("tema", t.id); } catch (e) {}
    }
    box.append(grade, area);
    let ini = "banheiro"; try { ini = localStorage.getItem("tema") || ini; } catch (e) {}
    const t0 = temas.find(t => t.id === ini) || temas[0]; area.replaceChildren(); setTimeout(() => { const c = H("div", { className: "box diag" }); c.innerHTML = `<h3>${t0.ico} ${t0.tit}</h3><div class="meta">item ${t0.item} ${pgBtn(t0.pag)}</div>`; t0.fn(c); area.append(c); });
  }

  /* ================= TREINAR ================= */
  function treinar(box) {
    const Q = window.QUIZ || [];
    if (!Q.length) { box.innerHTML = "<p class='nota'>Banco de perguntas ainda não carregado.</p>"; return; }
    const ler = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
    const grava = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
    const nomes = { desconector: "💧 Desconector", ramais: "🚽 Ramais", tubo_queda: "⬇️ Tubo de queda", ventilacao: "🌬️ Ventilação", coletor: "➡️ Coletor", caixas: "🕳️ Caixas", recalque: "⤴️ Recalque", execucao_ensaios: "🧪 Execução", projeto_predio: "🏢 Nosso prédio" };
    const topo = H("div"), area = H("div");
    let fila = [], pos = 0, acertos = 0, modo = "tudo";
    function menu() {
      const err = ler("erros");
      topo.innerHTML = `<div class="kpis"><div class="kpi"><small>Perguntas</small><b>${Q.length}</b></div><div class="kpi"><small>Para revisar</small><b>${err.length}</b></div><div class="kpi"><small>Melhor placar</small><b>${ler("melhor")[0] ?? "—"}</b></div></div>`;
      const ch = [["tudo", "🎲 Misturado (10)"], ["erros", "🔁 Revisar meus erros"], ...Object.entries(nomes).filter(([k]) => Q.some(q => q.tema === k))];
      topo.append(chips(ch, modo, v => { modo = v; }));
      const go = H("button", { className: "btn", textContent: "▶ Começar" }); go.onclick = comeca; topo.append(go);
    }
    function comeca() {
      const err = ler("erros");
      let base = modo === "tudo" ? Q : modo === "erros" ? Q.filter(q => err.includes(q.id)) : Q.filter(q => q.tema === modo);
      if (!base.length) { area.innerHTML = "<p class='nota'>Nada aqui ainda 🎉</p>"; return; }
      fila = [...base].sort(() => Math.random() - 0.5).slice(0, 10); pos = 0; acertos = 0; pergunta();
    }
    function pergunta() {
      const q = fila[pos];
      area.innerHTML = `<div class="prog"><b style="width:${pos / fila.length * 100}%"></b></div><div class="box quiz"><small class="mu">${nomes[q.tema] || q.tema} · nível ${q.nivel} · ${pos + 1}/${fila.length}</small><h3>${q.p}</h3><div class="ops"></div><div class="fb"></div></div>`;
      const ops = area.querySelector(".ops"), fb = area.querySelector(".fb");
      q.op.forEach((o, i) => {
        const b = H("button", { className: "op", textContent: o });
        b.onclick = () => {
          ops.querySelectorAll("button").forEach((x, j) => { x.disabled = true; if (j === q.c) x.classList.add("ok"); });
          const certo = i === q.c; if (!certo) b.classList.add("no"); else acertos++;
          const err = ler("erros").filter(x => x !== q.id); if (!certo) err.push(q.id); grava("erros", err);
          fb.innerHTML = `<p>${certo ? "✅ Isso!" : "❌ Não."} ${q.exp}</p><div class="meta">item ${q.item} ${pgBtn(q.pag)}</div>`;
          const nx = H("button", { className: "btn", textContent: pos + 1 < fila.length ? "Próxima ▶" : "Ver resultado" });
          nx.onclick = () => { pos++; pos < fila.length ? pergunta() : fim(); }; fb.append(nx);
        };
        ops.append(b);
      });
    }
    function fim() {
      const pct = Math.round(acertos / fila.length * 100), m = ler("melhor")[0] || 0; if (pct > m) grava("melhor", [pct]);
      area.innerHTML = `<div class="box res"><div class="big">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div><h3>${acertos} de ${fila.length} (${pct}%)</h3><p>${pct >= 80 ? "Mandou bem!" : "Os erros entram em “Revisar meus erros”."}</p></div>`;
      menu();
    }
    box.append(topo, area); menu();
  }

  window.VISUAL = { predio, aprender, treinar };
})();
