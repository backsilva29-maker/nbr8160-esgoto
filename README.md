# NBR 8160 · Esgoto sanitário — consulta de bolso

App (PWA, funciona offline) para estudo da ABNT NBR 8160:1999: busca de dúvidas, tabelas de dimensionamento,
calculadoras (UHC, tubo de queda, coluna de ventilação, coletor, caixa de gordura, caixa coletora) e
pré-dimensionamento de um prédio residencial de 10 pavimentos (trabalho acadêmico).

**O texto da norma não está neste repositório.** As fichas são resumo próprio com item e página;
o PDF é escolhido pelo usuário no próprio celular e fica só no aparelho (IndexedDB).
Adquira a norma oficial na ABNT.

Teste: `node testar_app.js` (confere tabelas contra o texto local da norma e casos-limite das calculadoras).
Leitor de PDF: [pdf.js](https://github.com/mozilla/pdf.js) (Mozilla). Tabelas cruzadas com
[juniortfa-prog/dimensionamento_esgoto_predial](https://github.com/juniortfa-prog/dimensionamento_esgoto_predial).
