/* Guia didático NBR 8160:1999. Depende somente de NBR, CALC e DOM nativo. */
(function (root) {
  "use strict";
  const C = () => root.CALC, N = () => root.NBR;
  const NUM = (id, label, expected) => ({ id, label, type: "number", expected });
  const CHOICE = (id, label, expected, options) => ({ id, label, type: "choice", expected, options });
  const fmt = n => typeof n === "number" ? n.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : String(n);
  function numero(value) {
    if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
    if (typeof value !== "string" || !/^\d+(?:[.,]\d+)?$/.test(value.trim())) return null;
    const n = Number(value.trim().replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  function etapas(cenario) {
    if (!["literal", "alternativo"].includes(cenario)) throw new Error("Escolha um cenário válido.");
    const c = C(), p = N().predio;
    const r = cenario === "literal" ? c.predio() : c.predioAlternativo();
    const suite = r.ambientes.find(a => a.nome === "Banheiro da suíte");
    const [ban, gordura, lavanderia] = r.tq;
    const cozinhas = p.pavimentos, cg = c.caixaGordura(cozinhas, null, false).tipo.split(/\s/)[0];
    const grupos = r.ambientes.filter((a, i) => p.ambientes[i].banheiro);
    const aptos = r.nAptos, L = ban.L;
    const scenarioLabel = cenario === "literal" ? "Literal v7: 2 chuveiros / 2 pias" : "Alternativo: 1 chuveiro / 1 pia";
    return [
      { title: "1 · Escolha as premissas", text: "Vamos dimensionar um shaft que atende um apartamento por andar, em dez pavimentos. Os quatro apartamentos de cada andar não entram juntos no mesmo tubo de queda.\nDois pontos de água fria não confirmam dois aparelhos de esgoto: ambos os cenários estão A CONFIRMAR.", fields: [CHOICE("cenario", "Cenário do exercício", cenario, [["literal", "Literal v7: 2 chuveiros na suíte e 2 pias"], ["alternativo", "Alternativo: 1 chuveiro na suíte e 1 pia"]])], exp: scenarioLabel + ". Mantemos os demais aparelhos, incluindo a lava-louças e o WC da guarita. A escolha é uma premissa de estudo, não adoção do inventário.", refs: [["4.5 · premissas do projeto; inventário M32", 15]] },
      { title: "2 · Some a suíte", text: "Use a Tabela 3: bacia, lavatório e o número de chuveiros do cenário escolhido.\nSome as UHC de todos esses aparelhos; a redução residencial ainda não se aplica aqui.", fields: [NUM("uhc", "UHC do banheiro da suíte", suite.uhc)], exp: `Bacia ${fmt(c.uhcAparelho("Bacia sanitária"))} + lavatório ${fmt(c.uhcAparelho("Lavatório de residência"))} + chuveiros ${fmt(suite.csUhc - c.uhcAparelho("Lavatório de residência"))} = ${fmt(suite.uhc)} UHC.`, refs: [["5.1.2.1 · Tabela 3", 16]] },
      { title: "3 · Escolha o ramal da suíte", text: "Agora dimensione o ramal de esgoto do banheiro completo.\nAlém da capacidade da Tabela 5, preserve o DN mínimo dos aparelhos: a bacia deste exercício usa descarga DN 100.", fields: [NUM("dn", "DN do ramal de esgoto", suite.ramal)], exp: `${fmt(suite.uhc)} UHC, preservando o mínimo da bacia: DN ${fmt(suite.ramal)}. Não foi adotada a exceção hidráulica condicionada da nota da Tabela 3.`, refs: [["5.1 e mínimos dos aparelhos", 15], ["Tabela 3", 16], ["5.1.2.3 · Tabela 5", 17]] },
      { title: "4 · Separe a caixa sifonada", text: "A bacia não entra na caixa sifonada. Neste banheiro, ela recebe só os chuveiros e o lavatório.\nDigite a carga desses aparelhos e o DN da caixa; o ramal de saída é outra verificação.", fields: [NUM("uhc", "UHC destinadas à caixa sifonada", suite.csUhc), NUM("dn", "DN da caixa sifonada", suite.cs)], exp: `Sem a bacia: ${fmt(suite.csUhc)} UHC → caixa DN ${fmt(suite.cs)}. O DN é da caixa, não uma indicação automática do DN de sua tubulação de saída.`, refs: [["4.2.2.3", 4], ["5.1.1.2", 16]] },
      { title: "5 · Dimensione o TQ de banheiros", text: "Some os três banheiros do apartamento. Um shaft recebe essa carga em cada um dos dez pavimentos.\nUse a coluna da Tabela 6 para mais de três pavimentos e mantenha o mínimo das bacias.", fields: [NUM("andar", "UHC de banheiros por andar do shaft", ban.uhcPav), NUM("total", "UHC totais no TQ de banheiros", ban.uhc), NUM("dn", "DN do TQ de banheiros", ban.dn)], exp: `${grupos.map(a => fmt(a.uhc)).join(" + ")} = ${fmt(ban.uhcPav)} UHC/andar; × ${p.pavimentos} = ${fmt(ban.uhc)} UHC → DN ${fmt(ban.dn)}. A redução para o coletor não vale no TQ.`, refs: [["5.1.3.1 · Tabela 6", 18], ["5.1 · mínimos", 15]] },
      { title: "6 · Leve a cozinha à gordura", text: "Some as pias e a lava-louças do cenário e multiplique pelos dez pavimentos do shaft.\nDetermine o DN do TQ e o tipo de caixa coletiva para dez cozinhas residenciais.", fields: [NUM("total", "UHC totais no TQ de gordura", gordura.uhc), NUM("dn", "DN do TQ de gordura", gordura.dn), CHOICE("caixa", "Tipo de caixa coletiva por shaft", cg, [["CGP", "CGP — pequena"], ["CGS", "CGS — simples"], ["CGD", "CGD — dupla"], ["CGE", "CGE — especial"]])], exp: `${fmt(gordura.uhcPav)} × ${p.pavimentos} = ${fmt(gordura.uhc)} UHC → DN ${fmt(gordura.dn)}. ${cozinhas} cozinhas por shaft → ${cg}; pias/lava-louças em pavimentos sobrepostos seguem por TQ exclusivo com ventilação primária até a caixa coletiva.`, refs: [["4.2.4.4", 5], ["5.1.3.1 · Tabela 6", 18], ["5.1.5.1 · seleção da caixa", 18]] },
      { title: "7 · Dimensione a lavanderia", text: "Cada apartamento tem um tanque e uma máquina de lavar roupas. Some as contribuições dos dez pavimentos.\nVamos estudar a solução permitida de TQ exclusivo com caixa sifonada especial no final.", fields: [NUM("total", "UHC totais no TQ de lavanderia", lavanderia.uhc), NUM("dn", "DN do TQ de lavanderia", lavanderia.dn)], exp: `${fmt(lavanderia.uhcPav)} × ${p.pavimentos} = ${fmt(lavanderia.uhc)} UHC → DN ${fmt(lavanderia.dn)}. A CS especial é diferente da caixa comum: fecho 0,20 m, diâmetro interno ou círculo inscrito 0,30 m, tampa hermética removível e saída DN 75; implantação a confirmar.`, refs: [["4.2.2.6", 4], ["5.1.1.3 e Tabela 3", 16], ["Tabela 6", 18]] },
      { title: "8 · Confira as colunas de ventilação", text: `Para o exercício, use L ≈ ${fmt(L)} m em cada coluna, incluindo o trecho até o terminal.\nConsulte a Tabela 2 com o DN e a carga do respectivo TQ. O comprimento desenvolvido real será medido no BIM.`, fields: [NUM("ban", "DN da coluna dos banheiros", ban.cv.dn), NUM("gor", "DN da coluna da gordura", gordura.cv.dn), NUM("lav", "DN da coluna da lavanderia", lavanderia.cv.dn)], exp: [ban, gordura, lavanderia].map((t, i) => `${["Banheiros", "Gordura", "Lavanderia"][i]}: TQ ${t.dn}/${t.uhc} UHC → linha ${t.cv.linha[0]}/${t.cv.linha[1]}, CV DN ${t.cv.dn} permite ${fmt(t.cv.limite)} m`).join("; ") + ". As colunas são separadas neste cenário de estudo; o arranjo definitivo ainda será confirmado.", refs: [["Tabela 2", 12], ["5.2.2 d)", 20]] },
      { title: "9 · Reúna o coletor predial", text: "Agora aplique a regra residencial: só o aparelho de maior descarga de cada banheiro, mais cozinha e lavanderia integrais.\nSão quarenta apartamentos; acrescente as 8 UHC do WC da guarita. Escolha o DN do coletor a 1%.", fields: [NUM("apto", "UHC por apartamento para o coletor", r.uhcColetorApto), NUM("total", "UHC totais no coletor", r.uhcColetor), NUM("dn", "DN do coletor a 1%", r.coletor.d1)], exp: `${fmt(r.uhcColetorApto)} × ${aptos} + ${fmt(r.uhcTerreo)} da guarita = ${fmt(r.uhcColetor)} UHC → DN ${fmt(r.coletor.d1)} a 1%. A soma integral do apartamento é ${fmt(r.uhcApto)} UHC, mas aqui os banheiros residenciais usam a redução de 5.1.4.2.`, refs: [["5.1.4.1/.2", 17], ["Tabela 7", 18]] },
      { title: "10 · Revise o traçado", text: "Marque os critérios que você revisou para estudar o futuro traçado.\nEsta lista não confirma medições, execução ou compatibilização do prédio: essas verificações permanecem pendentes no projeto.", fields: [
        { id: "espuma", label: `Revisar as zonas de sobrepressão e as soluções contra espuma: 40 DN antes da base do TQ (${fmt(40 * ban.dn / 1000)} m para o TQ de banheiros), além das demais zonas da Figura 1.`, type: "check", expected: true },
        { id: "ci", label: "Prever CI a pelo menos 2 m dos TQs que contribuem para ela, neste prédio com mais de dois pavimentos; não aplicar a mesma exigência automaticamente à CG/CS.", type: "check", expected: true },
        { id: "inspecao", label: "Verificar no traçado o máximo de 25 m entre dispositivos de inspeção, sem esquecer os limites particulares de 15 m e 10 m.", type: "check", expected: true },
        { id: "terminal", label: "Conferir terminal a 0,30 m ou mais acima de cobertura sem outro uso; 2 m se houver uso. A menos de 4 m de um vão, ficar pelo menos 1 m acima da verga.", type: "check", expected: true },
        { id: "separacao", label: "Manter esgoto sanitário e águas pluviais sem ligação entre si.", type: "check", expected: true }
      ], exp: "Critérios revisados para estudo. Falta confirmar o inventário, medir comprimentos e cotas no BIM, verificar as zonas de pressão e fechar a implantação; concluir o guia não aprova o projeto executivo.", refs: [["4.2.4.2/.3 · espuma e zonas", 5], ["Figura 1 e 4.2.6.2 · inspeções", 6], ["4.3.6 · terminal", 7], ["4.1.3.1 · separação", 4]] }
    ];
  }
  function conferir(cenario, index, values) {
    const e = etapas(cenario)[index];
    if (!e) return { ok: false, errors: ["Etapa inválida."] };
    const errors = [];
    for (const f of e.fields) {
      const actual = values && values[f.id];
      const ok = f.type === "number" ? numero(actual) !== null && Math.abs(numero(actual) - f.expected) < 1e-8 : actual === f.expected;
      if (!ok) errors.push(f.type === "check" ? "Revise: " + f.label : f.label + ": esperado " + fmt(f.expected) + (f.type === "number" ? ". Use um número positivo, com vírgula ou ponto." : "."));
    }
    return { ok: errors.length === 0, errors, exp: e.exp };
  }
  function render(el) {
    if (!el || !root.document) throw new Error("O guia precisa de um elemento da página.");
    const doc = root.document;
    const h = (tag, cls, text) => { const e = doc.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
    const fresh = () => ({ version: 1, cenario: null, step: 0, answers: {}, passed: {}, done: false });
    let state = fresh();
    try {
      const s = JSON.parse(root.localStorage.getItem("guia"));
      if (s && s.version === 1 && [null, "literal", "alternativo"].includes(s.cenario) && Number.isInteger(s.step) && s.step >= 0 && s.step < 10 && s.answers && typeof s.answers === "object" && s.passed && typeof s.passed === "object" && (s.step === 0 || s.cenario)) state = s;
    } catch (_) {}
    const save = () => { try { root.localStorage.setItem("guia", JSON.stringify(state)); } catch (_) {} };
    function draw() {
      el.replaceChildren();
      const reset = h("button", "btn sec", "↺ Recomeçar"); reset.type = "button";
      reset.onclick = () => { state = fresh(); save(); draw(); };
      el.append(h("h2", "", "Seu prédio, uma conta por vez"), h("p", "nota", "10 etapas · Dois cenários · Respostas em UHC e DN"), reset);
      const prog = h("div", "prog"), fill = h("b"); fill.style.width = (state.done ? 100 : state.step * 10) + "%"; prog.append(fill); el.append(prog);
      if (state.done) {
        const end = h("div", "box"); end.append(h("h3", "", "✓ Guia concluído"), h("p", "", "Você conferiu as contas do cenário " + (state.cenario === "literal" ? "literal v7, não adotado" : "alternativo, a confirmar") + "."), h("p", "nota", etapas(state.cenario)[9].exp));
        const back = h("button", "btn sec", "Rever etapas"); back.type = "button"; back.onclick = () => { state.done = false; state.step = 0; save(); draw(); }; end.append(back); el.append(end); return;
      }
      const index = state.step, model = etapas(state.cenario || "literal"), e = model[index], box = h("div", "box"), values = state.answers[index] || {};
      box.append(h("small", "mu", `Etapa ${index + 1} de 10 · ${state.cenario === "alternativo" ? "alternativo (1/1)" : state.cenario ? "literal v7 (2/2), não adotado" : "escolha seu cenário"}`), h("h3", "", e.title));
      e.text.split("\n").forEach(t => box.append(h("p", "", t)));
      if (index >= 4 && index <= 8) {
        const ns = "http://www.w3.org/2000/svg", svg = doc.createElementNS(ns, "svg"); svg.setAttribute("class", "draw"); svg.setAttribute("viewBox", "0 0 320 120"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Um shaft com os circuitos de banheiros, gordura e lavanderia; desenho esquemático sem escala.");
        ["Banheiros", "Gordura", "Lavanderia"].forEach((label, i) => { const x = 50 + i * 105, line = doc.createElementNS(ns, "line"); for (const [k,v] of Object.entries({ x1:x,y1:15,x2:x,y2:92,class:"tq" })) line.setAttribute(k,v); svg.append(line); const t = doc.createElementNS(ns, "text"); t.setAttribute("x",x); t.setAttribute("y",112); t.setAttribute("class","lb"); t.setAttribute("text-anchor","middle"); t.textContent=label; svg.append(t); }); box.append(svg);
      }
      const inputs = {}, fb = h("div", "out"); fb.hidden = true;
      const invalidate = () => { delete state.passed[index]; state.done = false; fb.hidden = true; next.hidden = true; state.answers[index] = read(); save(); };
      for (const f of e.fields) {
        const label = h("label", f.type === "check" ? "op" : ""), input = h(f.type === "choice" ? "select" : "input");
        label.style.display = "block"; label.style.margin = "10px 0";
        input.id = "guia-" + index + "-" + f.id; input.setAttribute("data-field", f.id); label.htmlFor = input.id;
        if (f.type === "check") { input.type = "checkbox"; input.checked = values[f.id] === true; label.append(input, doc.createTextNode(" " + f.label)); }
        else {
          label.append(h("span", "", f.label));
          if (f.type === "choice") { const blank = h("option", "", "Escolha uma opção"); blank.value = ""; input.append(blank); for (const [v,t] of f.options) { const opt = h("option", "", t); opt.value = v; input.append(opt); } }
          else { input.type = "text"; input.inputMode = "decimal"; input.autocomplete = "off"; input.placeholder = "Digite sua resposta"; }
          input.value = values[f.id] == null ? "" : String(values[f.id]); label.append(input);
        }
        input.oninput = () => {
          if (index === 0 && ["literal", "alternativo"].includes(input.value) && state.cenario !== input.value) { state.cenario = input.value; state.answers = { 0: { cenario: input.value } }; state.passed = {}; state.done = false; save(); draw(); return; }
          invalidate();
        };
        input.onchange = input.oninput;
        inputs[f.id] = input; box.append(label);
      }
      function read() { return Object.fromEntries(e.fields.map(f => [f.id, f.type === "check" ? inputs[f.id].checked : inputs[f.id].value])); }
      const check = h("button", "btn", "Conferir"), next = h("button", "btn", index === 9 ? "Concluir guia" : "Próxima etapa ▶"); check.type = next.type = "button"; next.hidden = true;
      const refs = h("div", "meta");
      e.refs.forEach(([item,pag]) => { const b = h("button", "pg", `📄 ${item} · pág. ${pag}`); b.type = "button"; b.dataset.pag = pag; refs.append(b); });
      check.onclick = () => {
        const result = conferir(state.cenario || "literal", index, read()); state.answers[index] = read(); state.passed[index] = result.ok;
        fb.replaceChildren(h("b", "", result.ok ? "✓ Conferido para este exercício" : "Vamos revisar a conta"));
        result.errors.forEach(t => fb.append(h("p", "", t))); fb.append(h("p", "", result.exp)); fb.hidden = false; next.hidden = !result.ok; save();
      };
      next.onclick = () => { if (!state.passed[index]) return; if (index === 9) state.done = true; else state.step++; save(); draw(); };
      box.append(check, fb, refs, next);
      if (index > 0) { const prev = h("button", "btn sec", "◀ Voltar"); prev.type = "button"; prev.onclick = () => { state.step--; save(); draw(); }; box.append(prev); }
      box.style.scrollMarginTop = "110px"; el.append(box);
      if (!el.closest("[hidden]")) box.scrollIntoView({ block: "start" });
    }
    draw();
  }
  root.GUIA = { render, etapas, conferir, numero };
})(typeof window !== "undefined" ? window : globalThis);
