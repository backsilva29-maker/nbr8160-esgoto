// Banco do modo TREINAR — Missão 80 (Codex), validado: validar_quiz.py exit 0
window.QUIZ = [
{
"id": "q01",
"tema": "desconector",
"nivel": 1,
"p": "Uma caixa sifonada recebe 6 UHC. Qual é seu menor DN pelo item 5.1.1.2?",
"op": [
"DN 75",
"DN 100",
"DN 125",
"DN 150"
],
"c": 1,
"exp": "Até 6 UHC, a caixa sifonada pode ser DN 100. Esse DN é o da caixa; a saída precisa de dimensionamento próprio.",
"item": "5.1.1.2",
"pag": 16
},
{
"id": "q02",
"tema": "desconector",
"nivel": 1,
"p": "Qual é a altura mínima do fecho hídrico de um desconector?",
"op": [
"20 mm",
"30 mm",
"50 mm",
"100 mm"
],
"c": 2,
"exp": "O mínimo é 0,05 m, equivalente a 50 mm. O fecho hídrico impede a passagem de gases para o ambiente.",
"item": "5.1.1.1 a)",
"pag": 15
},
{
"id": "q03",
"tema": "ramais",
"nivel": 1,
"p": "Pela Tabela 3, qual é o DN mínimo do ramal de descarga de uma pia de cozinha residencial?",
"op": [
"DN 50",
"DN 40",
"DN 75",
"DN 100"
],
"c": 0,
"exp": "A pia residencial corresponde a 3 UHC e exige ramal de descarga mínimo DN 50. Não se deve usar o DN 40 do tanque como referência para a pia.",
"item": "5.1.2.1",
"pag": 16
},
{
"id": "q04",
"tema": "ramais",
"nivel": 1,
"p": "Na Tabela 5, qual é o menor ramal de esgoto que atende 6 UHC?",
"op": [
"DN 40",
"DN 75",
"DN 100",
"DN 50"
],
"c": 3,
"exp": "O DN 50 atende até 6 UHC, enquanto o DN 40 atende até 3. Ainda é preciso preservar os mínimos dos aparelhos e das conexões atendidas.",
"item": "5.1.2.3",
"pag": 16
},
{
"id": "q05",
"tema": "tubo_queda",
"nivel": 1,
"p": "Em prédio com mais de três pavimentos, qual é a capacidade tabelada de um TQ DN 100?",
"op": [
"240 UHC",
"320 UHC",
"500 UHC",
"530 UHC"
],
"c": 2,
"exp": "A Tabela 6, p. 18, permite até 500 UHC para DN 100 nessa categoria de prédio. O valor 240 pertence à coluna de até três pavimentos.",
"item": "5.1.3.1",
"pag": 17
},
{
"id": "q06",
"tema": "coletor",
"nivel": 1,
"p": "Na Tabela 7, quantas UHC um coletor DN 100 comporta a 2%?",
"op": [
"216 UHC",
"180 UHC",
"250 UHC",
"500 UHC"
],
"c": 0,
"exp": "Na coluna de 2%, a capacidade é 216 UHC. Os valores 180 e 250 correspondem a 1% e 4%, respectivamente.",
"item": "5.1.4.1",
"pag": 17
},
{
"id": "q07",
"tema": "ventilacao",
"nivel": 1,
"p": "Qual é a distância máxima da Tabela 1 entre um desconector com ramal DN 50 e o tubo ventilador?",
"op": [
"1,00 m",
"1,80 m",
"2,40 m",
"1,20 m"
],
"c": 3,
"exp": "O par DN 50 e 1,20 m está na Tabela 1, p. 11. A distância varia com o DN do ramal de descarga.",
"item": "4.3.11",
"pag": 10
},
{
"id": "q08",
"tema": "ventilacao",
"nivel": 1,
"p": "Se a laje serve apenas como cobertura, qual é a altura mínima do terminal de ventilação acima dela?",
"op": [
"0,15 m",
"0,30 m",
"1,00 m",
"2,00 m"
],
"c": 1,
"exp": "Para cobertura sem outro uso, o mínimo é 0,30 m. Se a laje tiver outros usos, o mínimo passa a 2,00 m, além das demais condições do terminal.",
"item": "4.3.6 b)",
"pag": 7
},
{
"id": "q09",
"tema": "caixas",
"nivel": 1,
"p": "Qual é a capacidade mínima de retenção de uma caixa de gordura dupla, CGD?",
"op": [
"18 L",
"31 L",
"120 L",
"220 L"
],
"c": 2,
"exp": "A CGD tem retenção mínima de 120 L e saída DN 100. As capacidades 18 L e 31 L pertencem à pequena e à simples.",
"item": "5.1.5.1.3 c)",
"pag": 19
},
{
"id": "q10",
"tema": "caixas",
"nivel": 1,
"p": "Qual é a capacidade mínima de retenção de uma caixa de gordura simples, CGS?",
"op": [
"31 L",
"18 L",
"75 L",
"120 L"
],
"c": 0,
"exp": "A CGS retém no mínimo 31 L. Seu diâmetro interno mínimo é 0,40 m, com saída DN 75.",
"item": "5.1.5.1.3 b)",
"pag": 19
},
{
"id": "q11",
"tema": "caixas",
"nivel": 1,
"p": "Qual é a maior distância admitida entre dois dispositivos de inspeção?",
"op": [
"10 m",
"15 m",
"20 m",
"25 m"
],
"c": 3,
"exp": "Entre dois dispositivos de inspeção, o limite é 25 m. Os limites de 15 m e 10 m tratam de outras situações descritas no mesmo item.",
"item": "4.2.6.2 a)",
"pag": 6
},
{
"id": "q12",
"tema": "recalque",
"nivel": 1,
"p": "Quando a caixa coletora recebe bacias sanitárias, qual é o DN mínimo da tubulação de recalque?",
"op": [
"DN 40",
"DN 75",
"DN 50",
"DN 100"
],
"c": 1,
"exp": "Com efluentes de bacias, o mínimo é DN 75 e a bomba deve permitir passagem de esfera de 60 mm. DN 40 aparece no caso sem bacias.",
"item": "5.1.6.3",
"pag": 20
},
{
"id": "q13",
"tema": "execucao_ensaios",
"nivel": 1,
"p": "No ensaio com ar, qual pressão deve ser mantida por 15 minutos sem adicionar mais ar?",
"op": [
"0,25 kPa",
"60 kPa",
"35 kPa",
"100 kPa"
],
"c": 2,
"exp": "O ensaio com ar utiliza 35 kPa por 15 minutos. O ensaio final de fumaça utiliza outra pressão: 0,25 kPa.",
"item": "G.2.2",
"pag": 66
},
{
"id": "q14",
"tema": "projeto_predio",
"nivel": 1,
"p": "Como a NBR 8160 trata a ligação entre esgoto sanitário e águas pluviais?",
"op": [
"Exige separação absoluta, sem ligação entre os sistemas",
"Permite ligação depois da caixa de inspeção",
"Permite ligação apenas no térreo",
"Recomenda separação, mas permite união em prédio pequeno"
],
"c": 0,
"exp": "A separação entre os sistemas é um requisito, não uma recomendação facultativa. A regra não cria exceção por pavimento ou porte do prédio.",
"item": "4.1.3.1",
"pag": 4
},
{
"id": "q15",
"tema": "coletor",
"nivel": 1,
"p": "Qual é o DN mínimo do coletor predial?",
"op": [
"DN 40",
"DN 50",
"DN 75",
"DN 100"
],
"c": 3,
"exp": "O coletor predial deve ter no mínimo DN 100. A carga e a declividade podem exigir um diâmetro maior.",
"item": "5.1.4.1",
"pag": 17
},
{
"id": "q16",
"tema": "desconector",
"nivel": 2,
"p": "Uma caixa sifonada recebe 7 UHC de aparelhos compatíveis. Qual é seu menor DN?",
"op": [
"DN 100",
"DN 125",
"DN 150",
"DN 200"
],
"c": 1,
"exp": "Sete UHC ultrapassam o limite de 6 para DN 100. O próximo patamar é DN 125, que atende até 10 UHC.",
"item": "5.1.1.2",
"pag": 16
},
{
"id": "q17",
"tema": "ramais",
"nivel": 2,
"p": "Um ramal de esgoto soma 4 UHC e nenhum aparelho exige DN maior. Qual é o menor DN pela Tabela 5?",
"op": [
"DN 50",
"DN 40",
"DN 75",
"DN 100"
],
"c": 0,
"exp": "Quatro UHC excedem a capacidade de 3 UHC do DN 40. O DN 50 atende até 6 UHC.",
"item": "5.1.2.3",
"pag": 16
},
{
"id": "q18",
"tema": "tubo_queda",
"nivel": 2,
"p": "Um TQ de prédio com dez pavimentos recebe 501 UHC. Qual é o menor DN da Tabela 6?",
"op": [
"DN 75",
"DN 100",
"DN 200",
"DN 150"
],
"c": 3,
"exp": "O DN 100 para essa categoria atende somente até 500 UHC. Com 501 UHC, o primeiro patamar suficiente é DN 150.",
"item": "5.1.3.1",
"pag": 17
},
{
"id": "q19",
"tema": "coletor",
"nivel": 2,
"p": "Um coletor recebe 181 UHC e tem declividade de 1%. Qual é o menor DN da Tabela 7?",
"op": [
"DN 100",
"DN 200",
"DN 150",
"DN 250"
],
"c": 2,
"exp": "A 1%, DN 100 atende até 180 UHC. O próximo DN tabelado que atende 181 UHC é 150.",
"item": "5.1.4.1",
"pag": 17
},
{
"id": "q20",
"tema": "tubo_queda",
"nivel": 2,
"p": "Um TQ de dez pavimentos recebe 30 UHC, incluindo bacias com ramais DN 100. Pode-se adotar DN 75 só porque a Tabela 6 comporta a carga?",
"op": [
"Sim, toda carga abaixo de 70 UHC dispensa os outros mínimos",
"Sim, se houver coluna de ventilação",
"Sim, se o prédio tiver dez pavimentos",
"Não; deve-se preservar o mínimo DN 100 das bacias neste caso"
],
"c": 3,
"exp": "A capacidade da Tabela 6 não elimina os mínimos dos ramais de descarga. O enunciado fixa bacias com DN 100, sem adotar a alternativa hidráulica condicionada da nota da Tabela 3.",
"item": "5.1",
"pag": 15
},
{
"id": "q21",
"tema": "ventilacao",
"nivel": 2,
"p": "Um grupo com bacia sanitária soma 18 UHC. Qual é o menor ramal de ventilação da Tabela 8?",
"op": [
"DN 40",
"DN 75",
"DN 50",
"DN 100"
],
"c": 1,
"exp": "Com bacia, DN 50 atende até 17 UHC. A faixa seguinte, de 18 a 60 UHC, exige DN 75.",
"item": "5.2.2 a)",
"pag": 20
},
{
"id": "q22",
"tema": "ventilacao",
"nivel": 2,
"p": "Para TQ DN 100 com 320 UHC, uma coluna de ventilação mede 52,1 m. Qual é o menor DN da Tabela 2?",
"op": [
"DN 100",
"DN 50",
"DN 75",
"DN 150"
],
"c": 0,
"exp": "Na linha 100/320, DN 75 permite até 52 m; 52,1 m ultrapassa esse limite. DN 100 permite até 195 m nessa linha da Tabela 2, p. 12.",
"item": "5.2.2 d)",
"pag": 20
},
{
"id": "q23",
"tema": "caixas",
"nivel": 2,
"p": "Uma caixa recebe exatamente duas cozinhas residenciais. Quais tipos a norma permite selecionar?",
"op": [
"Somente CGP",
"Somente CGE",
"CGP ou CGS",
"CGS ou CGD"
],
"c": 3,
"exp": "Para duas cozinhas, podem ser usadas a simples ou a dupla. A pequena é opção para apenas uma cozinha.",
"item": "5.1.5.1.1 b)",
"pag": 18
},
{
"id": "q24",
"tema": "caixas",
"nivel": 2,
"p": "Uma CGE atende 100 pessoas no turno de maior afluxo. Qual volume de retenção resulta de V = 2N + 20?",
"op": [
"120 L",
"200 L",
"220 L",
"240 L"
],
"c": 2,
"exp": "Substituindo N por 100: V = 2 × 100 + 20 = 220 L. N é o número de pessoas, não o número de cozinhas.",
"item": "5.1.5.1.3 d)",
"pag": 19
},
{
"id": "q25",
"tema": "desconector",
"nivel": 2,
"p": "Pode-se ligar um lavatório à caixa sifonada que recebe um mictório, mesmo que o lavatório tenha sifão próprio?",
"op": [
"Não; a caixa do mictório não pode receber outro aparelho",
"Sim, se a soma não passar de 6 UHC",
"Sim, se a caixa tiver DN 150",
"Sim, desde que a tampa seja grelhada"
],
"c": 0,
"exp": "A caixa que recebe mictório deve ter tampa cega e não pode receber contribuição de outro aparelho. Um sifão próprio no lavatório não cria exceção.",
"item": "4.2.2.4",
"pag": 4
},
{
"id": "q26",
"tema": "recalque",
"nivel": 2,
"p": "Um projeto usa intervalo de 8 minutos entre partidas da bomba. Como interpretar o valor de 10 minutos do item 5.1.6.8?",
"op": [
"É a duração obrigatória do ensaio da bomba",
"É recomendação de intervalo mínimo; 8 minutos fica abaixo dela",
"É limite máximo obrigatório de operação",
"É o tempo máximo de detenção do esgoto"
],
"c": 1,
"exp": "O item recomenda intervalo não inferior a 10 minutos para reduzir esforços de partida. Não se deve trocar o verbo recomenda por uma proibição absoluta que esse item não estabelece.",
"item": "5.1.6.8",
"pag": 20
},
{
"id": "q27",
"tema": "recalque",
"nivel": 2,
"p": "Com Q da bomba de 0,30 m³/min e intervalo t de 10 min, qual é o volume útil Vu = Q·t/4?",
"op": [
"0,075 m³",
"0,30 m³",
"3,00 m³",
"0,75 m³"
],
"c": 3,
"exp": "Vu = 0,30 × 10 ÷ 4 = 0,75 m³. Trata-se do volume útil entre os níveis de operação, não do volume total da caixa.",
"item": "5.1.6.7",
"pag": 20
},
{
"id": "q28",
"tema": "recalque",
"nivel": 2,
"p": "Uma caixa tem Vt = 2 m³ e vazão média afluente q = 0,05 m³/min. A detenção atende ao limite de 30 min?",
"op": [
"Sim: resulta em 10 min",
"Sim: resulta em 20 min",
"Não: resulta em 40 min",
"Não: resulta em 100 min"
],
"c": 2,
"exp": "d = Vt/q = 2 ÷ 0,05 = 40 min. Isso excede o limite de 30 min estabelecido para preservar as condições de aerobiose.",
"item": "5.1.6.12",
"pag": 20
},
{
"id": "q29",
"tema": "ramais",
"nivel": 2,
"p": "Em uma mudança de direção horizontal de ramal, qual solução respeita o limite angular das peças?",
"op": [
"Usar duas peças de 45° para completar a mudança de 90°",
"Usar uma peça de 90°, porque o total é o mesmo",
"Usar uma peça de 87°, porque é menor que 90°",
"Dispensar peças e aquecer o tubo para curvá-lo"
],
"c": 0,
"exp": "Nos trechos horizontais, cada peça de mudança de direção deve ter ângulo central de até 45°. A permissão de até 90° pertence às mudanças horizontal–vertical e não substitui essa regra.",
"item": "4.2.3.3",
"pag": 5
},
{
"id": "q30",
"tema": "execucao_ensaios",
"nivel": 2,
"p": "Depois da instalação dos aparelhos, qual ensaio final a norma prevê?",
"op": [
"Somente inspeção visual, sem ensaio",
"Fumaça a 0,25 kPa por 15 min, com fechos hídricos preenchidos",
"Ar a 60 kPa por 10 min",
"Água a 35 kPa por 30 min"
],
"c": 1,
"exp": "Após colocar os aparelhos, o ensaio final é com fumaça. Os fechos são preenchidos, e a pressão de 0,25 kPa deve permanecer por 15 minutos sem adicionar fumaça.",
"item": "G.2.3",
"pag": 66
},
{
"id": "q31",
"tema": "projeto_predio",
"nivel": 3,
"p": "No cenário literal ainda não adotado do nosso apto, suíte = 11, social = 9, serviço = 9, cozinha = 8 e lavanderia = 6 UHC. Qual é a soma integral?",
"op": [
"32 UHC",
"38 UHC",
"40 UHC",
"43 UHC"
],
"c": 3,
"exp": "11 + 9 + 9 + 8 + 6 = 43 UHC. É o cenário literal da M32, com dois chuveiros na suíte e duas pias na cozinha ainda a confirmar; não é inventário adotado.",
"item": "5.1.2.1",
"pag": 16
},
{
"id": "q32",
"tema": "projeto_predio",
"nivel": 3,
"p": "No cenário literal, um shaft recebe 29 UHC de banheiros por pavimento em dez pavimentos. Qual é o menor TQ, com bacias DN 100?",
"op": [
"290 UHC → DN 75",
"290 UHC → DN 100",
"1160 UHC → DN 150",
"29 UHC → DN 40"
],
"c": 1,
"exp": "O shaft atende um apartamento por pavimento: 29 × 10 = 290 UHC. Para mais de três pavimentos, DN 100 atende até 500 UHC e preserva o mínimo das bacias.",
"item": "5.1.3.1",
"pag": 17
},
{
"id": "q33",
"tema": "projeto_predio",
"nivel": 3,
"p": "No cenário literal, cada cozinha tem duas pias de 3 UHC e uma lava-louças de 2 UHC. Um TQ recebe dez dessas cozinhas. Qual é a carga e o menor DN tabelado?",
"op": [
"50 UHC → DN 75",
"60 UHC → DN 75",
"80 UHC → DN 100",
"320 UHC → DN 150"
],
"c": 2,
"exp": "Cada cozinha soma 3 + 3 + 2 = 8 UHC, totalizando 80 UHC no TQ. DN 75 atende até 70 UHC em mais de três pavimentos, por isso é necessário DN 100.",
"item": "5.1.3.1",
"pag": 17
},
{
"id": "q34",
"tema": "projeto_predio",
"nivel": 3,
"p": "Uma coluna de aptos tem tanque de 3 UHC e lavadora de roupas de 3 UHC em cada um dos dez pavimentos. Qual é o menor TQ da Tabela 6?",
"op": [
"DN 75 para 60 UHC",
"DN 50 para 60 UHC",
"DN 100 para 240 UHC",
"DN 40 para 6 UHC"
],
"c": 0,
"exp": "São 6 UHC por pavimento, totalizando 60 UHC. Na coluna de mais de três pavimentos, DN 75 atende até 70 UHC; o traçado exclusivo com CS especial no final é uma solução permitida, a confirmar no projeto.",
"item": "5.1.3.1",
"pag": 17
},
{
"id": "q35",
"tema": "projeto_predio",
"nivel": 3,
"p": "No cenário literal, o coletor residencial recebe por apto três banheiros com bacia de 6 UHC, cozinha de 8 UHC e lavanderia de 6 UHC. Para 40 aptos mais 8 UHC da guarita, qual é a carga reduzida?",
"op": [
"1080 UHC",
"1168 UHC",
"1728 UHC",
"1288 UHC"
],
"c": 3,
"exp": "Nos banheiros residenciais, conta-se o aparelho de maior descarga: 3 × 6 = 18 UHC por apto. Somando os demais ambientes, (18 + 8 + 6) × 40 + 8 = 1288 UHC; essa redução não vale para TQs e ramais.",
"item": "5.1.4.2",
"pag": 17
},
{
"id": "q36",
"tema": "projeto_predio",
"nivel": 3,
"p": "O coletor do nosso cenário literal recebe 1288 UHC e tem declividade de 1%. Qual é o menor DN pela Tabela 7?",
"op": [
"DN 150",
"DN 200",
"DN 250",
"DN 300"
],
"c": 1,
"exp": "A 1%, DN 150 atende até 700 UHC e DN 200 até 1600 UHC. Portanto, 1288 UHC cabem em DN 200, sem dispensar a verificação do traçado e das cotas reais.",
"item": "5.1.4.1",
"pag": 17
},
{
"id": "q37",
"tema": "projeto_predio",
"nivel": 3,
"p": "Se cada TQ de cozinha do prédio descarregar em uma caixa para suas dez cozinhas residenciais, qual tipo a norma exige nessa faixa?",
"op": [
"CGP de 18 L",
"CGS de 31 L",
"CGD de 120 L",
"CGE calculada pelo número de pavimentos"
],
"c": 2,
"exp": "De três a doze cozinhas residenciais, a norma estabelece a caixa de gordura dupla. A CGD tem retenção mínima de 120 L; quatro caixas ou uma solução central ainda depende da implantação.",
"item": "5.1.5.1.1 c)",
"pag": 18
},
{
"id": "q38",
"tema": "projeto_predio",
"nivel": 3,
"p": "Para uma única caixa atender as 40 cozinhas do prédio, já é possível fechar o volume somente com esse número?",
"op": [
"Não; exige CGE e o N da fórmula é o número de pessoas no maior afluxo",
"Sim: V = 2 × 40 + 20 = 100 L",
"Sim: basta uma CGD de 120 L",
"Sim: V é sempre 31 L por prédio"
],
"c": 0,
"exp": "Mais de doze cozinhas exigem CGE, cujo volume é V = 2N + 20. N corresponde às pessoas servidas no turno de maior afluxo, dado ainda a confirmar, e não às 40 cozinhas.",
"item": "5.1.5.1.3 d)",
"pag": 19
},
{
"id": "q39",
"tema": "projeto_predio",
"nivel": 3,
"p": "Para localizar a zona de sobrepressão imediatamente a montante da base de um TQ DN 100 do prédio, quanto valem 40 diâmetros?",
"op": [
"0,40 m",
"1,00 m",
"3,00 m",
"4,00 m"
],
"c": 3,
"exp": "40 × 0,10 m = 4,00 m acima da base. A aplicação das soluções contra retorno de espuma deve considerar o contexto do item 4.2.4.2, e o térreo precisa de traçado verificado.",
"item": "4.2.4.3 d)",
"pag": 5
},
{
"id": "q40",
"tema": "projeto_predio",
"nivel": 3,
"p": "Na alternativa ainda a confirmar de uma pia e um chuveiro na suíte, mantêm-se a lava-louças e os demais aparelhos. Cozinha = 5, lavanderia = 6 e banheiros para o coletor = 18 UHC/apto. Para 40 aptos mais guarita de 8 UHC, qual é a carga do coletor?",
"op": [
"1080 UHC",
"1168 UHC",
"1288 UHC",
"1528 UHC"
],
"c": 1,
"exp": "(18 + 5 + 6) × 40 + 8 = 1168 UHC. Essa alternativa mantém a lava-louças e distingue aparelhos efetivos dos pontos de água fria ainda não confirmados.",
"item": "5.1.4.2",
"pag": 17
}
];
