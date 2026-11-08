// Teste do app NBR 8160: (1) números das tabelas existem, na ordem, na página certa do texto do PDF;
// (2) calculadoras em casos-limite; (3) fichas apontam páginas que contêm o item citado.
// Uso: node testar_app.js [caminho_dados.js]   -> exit 0 = aprovado, 1 = reprovado
const fs = require("fs"), path = require("path"), vm = require("vm");
const dadosPath = process.argv[2] || path.join(__dirname, "dados.js");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(dadosPath, "utf8"), ctx);
ctx.globalThis = ctx; vm.runInContext(fs.readFileSync(path.join(__dirname, "app.js"), "utf8"), ctx);
const N = ctx.window.NBR, C = ctx.window.CALC;
const texto = fs.readFileSync(path.join(__dirname, "..", "NBR_8160_texto.txt"), "utf8");
const paginas = {}; texto.split(/=== PAGINA (\d+) ===/).forEach((b, i, a) => { if (i % 2) paginas[+b] = a[i + 1]; });
let falhas = 0; const ok = (c, m) => { if (!c) { falhas++; console.log("FALHA:", m); } };

// (1) subsequência numérica por página
// nota de rodapé grudada no número da tabela: "1001)" = 100 + nota 1, "503)" = 50 + nota 3
const nums = s => (s.replace(/^(\d+)([1-9])\)$/gm, "$1").match(/\d[\d ]*(?:,\d+)?/g) || []).map(x => parseFloat(x.replace(/ /g, "").replace(",", ".")));
function subseq(pag, seq, nome) {
  const h = nums(paginas[pag]); let j = 0;
  for (const v of h) if (j < seq.length && v === seq[j]) j++;
  ok(j === seq.length, `${nome}: valor ${seq[j]} (posição ${j}) não encontrado em ordem na pág. ${pag}`);
}
subseq(16, N.tab3.linhas.flatMap(l => [l[1], l[2]]), "Tabela 3");
subseq(17, N.tab4.linhas.flat(), "Tabela 4");
subseq(17, N.tab5.linhas.flat(), "Tabela 5");
subseq(18, N.tab6.linhas.flat(), "Tabela 6");
subseq(18, N.tab7.linhas.flat().filter(v => v !== null), "Tabela 7");
subseq(11, N.tab1.linhas.flat(), "Tabela 1");
subseq(12, N.tab2.linhas.flatMap(l => [l[0], l[1], ...l[2].filter(v => v !== null)]), "Tabela 2");
subseq(21, [12, 40, 17, 50, 13, 18, 50, 18, 60, 75, 19, 36, 75], "Tabela 8");
ok(JSON.stringify(N.tab8.semBacia.map(r => [r[1], r[2]])) === "[[12,40],[18,50],[36,75]]" && JSON.stringify(N.tab8.comBacia.map(r => [r[1], r[2]])) === "[[17,50],[60,75]]", "Tabela 8 estrutura");
subseq(62, N.tabD1.linhas.flat(), "Tabela D.1");
// caixas de gordura: números LIDOS de N.caixasGordura (não constantes do teste)
const numsCG = i => (N.caixasGordura.linhas[i].slice(1, 5).join(" ").match(/\d+(?:,\d+)?/g) || []).map(x => parseFloat(x.replace(",", ".")));
subseq(18, numsCG(0), "Caixa de gordura CGP");
subseq(19, [...numsCG(1), ...numsCG(2)], "Caixas de gordura CGS/CGD");
subseq(19, numsCG(3).filter(x => ![2, 20].includes(x)), "Caixa de gordura CGE");
ok(numsCG(0).length >= 4 && numsCG(1).length >= 4 && numsCG(2).length >= 4, "caixas de gordura: números extraídos");
// total de linhas
ok(N.tab3.linhas.length === 18 && N.tab2.linhas.length === 28 && N.tab7.linhas.length === 6 && N.tab6.linhas.length === 8, "contagem de linhas");

// (2) calculadoras — casos-limite
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);
eq(C.tuboQueda(500, 10), 100, "TQ 500 UHC >3 pav"); eq(C.tuboQueda(501, 10), 150, "TQ 501 UHC >3 pav");
eq(C.tuboQueda(240, 3), 100, "TQ 240 UHC 3 pav"); eq(C.tuboQueda(241, 3), 150, "TQ 241 UHC 3 pav");
eq(C.tuboQueda(30, 10), 75, "TQ 30 UHC"); eq(C.tuboQueda(30, 10, 100), 100, "TQ c/ bacia DN mín 100");
eq(C.coletor(180, 1), 100, "coletor 180@1%"); eq(C.coletor(181, 1), 150, "coletor 181@1%");
eq(C.coletor(100, 0.5), 200, "DN100/150 não existem a 0,5%"); eq(C.coletor(1080, 1), 200, "coletor 1080@1%");
eq(C.coletor(1080, 4), 200, "coletor 1080@4% (DN150 só 1000)");
eq([6, 7, 10, 11, 15, 16].map(C.caixaSifonada), [100, 125, 125, 150, 150, null], "caixa sifonada");
eq(C.ramalEsgoto(3), 40, "ramal 3"); eq(C.ramalEsgoto(4), 50, "ramal 4"); eq(C.ramalEsgoto(9, 100), 100, "ramal banheiro c/ bacia");
eq(C.ramalEsgoto(161), null, "ramal >160");
eq(C.ramalVentilacao(17, true), 50, "vent c/ bacia 17"); eq(C.ramalVentilacao(18, true), 75, "vent c/ bacia 18");
eq(C.ramalVentilacao(12, false), 40, "vent s/ bacia 12"); eq(C.ramalVentilacao(37, false), null, "vent s/ bacia 37");
eq(C.colunaVentilacao(100, 270, 30.3).dn, 75, "coluna TQ100 270UHC 30,3m (linha 320: DN75 até 52 m)");
eq(C.colunaVentilacao(100, 320, 52).dn, 75, "coluna limite 52 m"); eq(C.colunaVentilacao(100, 320, 52.1).dn, 100, "coluna 52,1 m");
eq(C.colunaVentilacao(100, 531, 10).dn, null, "coluna UHC acima da linha 530");
eq(C.caixaGordura(1).tipo.startsWith("CGP"), true, "CG 1 cozinha"); eq(C.caixaGordura(12).tipo.startsWith("CGD"), true, "CG 12");
eq(C.caixaGordura(13, 100), { tipo: "CGE — especial", volume: 220 }, "CGE 100 pessoas");
eq(C.volumeUtil(0.3, 10), 0.75, "Vu"); eq(C.detencao(1, 0.1), 10, "detenção");
// contrato F4: entradas impossíveis -> null
eq(C.ramalEsgoto(-1), null, "ramal(-1)"); eq(C.tuboQueda(270, 0), null, "TQ pav 0"); eq(C.tuboQueda(270, 3.5), null, "TQ pav 3,5");
eq(C.caixaSifonada(-1), null, "CS(-1)"); eq(C.colunaVentilacao(100, 270, -1).dn, null, "CV L<0");
eq(C.volumeUtil(-0.3, 10), null, "Vu Q<0"); eq(C.detencao(1, 0), null, "detenção q=0"); eq(C.detencao(1, -0.1), null, "detenção q<0");
eq(C.coletor(NaN, 1), null, "coletor NaN"); eq(C.ramalVentilacao(0, true), null, "vent 0"); eq(C.caixaGordura(0), null, "CG 0 cozinhas");
eq(C.caixaGordura(2.5), null, "CG 2,5 cozinhas");
const P = C.predio();
// valores de referência = PLANILHA_ESGOTO_NBR8160.xlsx (Missão 32): 43 UHC/apto; TQ 290/80/60; coletor 32/apto
eq(P.uhcApto, 43, "UHC por apto (planilha M32: 43)"); eq(P.uhcColetorApto, 32, "UHC coletor/apto (planilha M32: 32)");
eq(P.uhcColetor, 32 * 40 + 8, "UHC coletor + guarita");
eq(P.tq.map(t => [t.uhc, t.dn]), [[290, 100], [80, 100], [60, 75]], "TQs do prédio (planilha M32: 100/100/75)");
eq(P.tq.map(t => t.cv.dn), [75, 75, 75], "colunas de ventilação L≈30,3 m (planilha: DN75 até 52/61/189 m)");
eq(P.tq.map(t => t.cv.limite), [52, 61, 189], "limites Tab. 2 iguais aos da planilha M32");
eq(P.ambientes.map(a => a.ramal), [100, 100, 100, 75, 50], "ramais (planilha M32: 100/100/100/75/50)");
// F10: cenário alternativo 1 chuveiro + 1 pia (relatório M32: coletor 1168, TQ gordura 50)
const A = C.predioAlternativo();
eq([A.uhcApto, A.uhcColetor, A.tq[0].uhc, A.tq[1].uhc, A.tq[1].dn], [38, 1168, 270, 50, 75], "cenário alternativo");

// (3) fichas: página citada contém o número do item (quando é item numérico)
for (const f of N.fichas) {
  const m = f.item.match(/^(\d+(?:\.\d+)+)/); if (!m) continue;
  const alvo = m[1] + " ";
  const achou = [f.pag, f.pag - 1, f.pag + 1].some(p => (paginas[p] || "").includes(alvo) || (paginas[p] || "").includes(m[1] + "\n"));
  ok(achou, `ficha "${f.t}": item ${m[1]} não está perto da pág. ${f.pag}`);
}
console.log(falhas ? `REPROVADO: ${falhas} falha(s)` : `APROVADO: tabelas conferidas com o PDF, ${N.fichas.length} fichas, calculadoras OK`);
process.exit(falhas ? 1 : 0);
