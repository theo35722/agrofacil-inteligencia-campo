
import { PracticeArticle } from "@/types/bestPractices";

export const practiceArticles: PracticeArticle[] = [
  {
    id: "1",
    title: "Como aplicar calcário corretamente",
    summary: "Guia completo para aplicação eficiente de calcário no solo",
    content: `
      <p class="mb-4">A calagem é uma prática fundamental para o manejo da acidez do solo e o fornecimento de cálcio e magnésio às plantas. Uma aplicação adequada de calcário proporciona inúmeros benefícios, como:</p>
      
      <ul class="list-disc pl-5 mb-4">
        <li>Correção da acidez do solo</li>
        <li>Fornecimento de cálcio e magnésio</li>
        <li>Melhoria na disponibilidade de nutrientes</li>
        <li>Aumento da atividade microbiana benéfica</li>
        <li>Neutralização do alumínio tóxico</li>
      </ul>
      
      <p class="mb-4"><strong>Quando aplicar:</strong></p>
      <p class="mb-4">O calcário deve ser aplicado preferencialmente de 2 a 3 meses antes do plantio, permitindo tempo suficiente para a reação no solo.</p>
      
      <p class="mb-4"><strong>Como calcular a quantidade:</strong></p>
      <p class="mb-4">A quantidade de calcário a ser aplicada deve ser baseada na análise de solo. A fórmula básica é:</p>
      <p class="mb-4">NC (t/ha) = [V2 - V1] × CTC / PRNT × 10</p>
      <p class="mb-4">Onde:</p>
      <ul class="list-disc pl-5 mb-4">
        <li>NC = Necessidade de calcário em toneladas por hectare</li>
        <li>V2 = Saturação por bases desejada (em %)</li>
        <li>V1 = Saturação por bases atual do solo (em %)</li>
        <li>CTC = Capacidade de troca catiônica do solo</li>
        <li>PRNT = Poder relativo de neutralização total do calcário (em %)</li>
      </ul>
      
      <p class="mb-4"><strong>Métodos de aplicação:</strong></p>
      <p class="mb-4">1. <strong>Aplicação a lanço:</strong> É o método mais comum, onde o calcário é espalhado uniformemente sobre a superfície do solo.</p>
      <p class="mb-4">2. <strong>Aplicação em linha:</strong> Indicada para culturas perenes, onde o calcário é aplicado nas linhas de plantio.</p>
      <p class="mb-4">3. <strong>Aplicação incorporada:</strong> O calcário é incorporado ao solo através de gradagem ou aração, permitindo reação mais rápida.</p>
      
      <p class="mb-4"><strong>Cuidados importantes:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Utilize calcário de boa qualidade e PRNT conhecido</li>
        <li>Faça a aplicação em solo com umidade adequada</li>
        <li>Calibre adequadamente o equipamento de distribuição</li>
        <li>Evite aplicar em dias muito ventosos</li>
        <li>Monitore o pH do solo regularmente após a aplicação</li>
      </ul>
      
      <p class="mb-4">Com essas práticas, você garantirá uma correção eficiente do solo e melhores condições para o desenvolvimento das suas culturas.</p>
    `,
    category: "Manejo de Solo",
    tags: ["calcário", "solo", "acidez", "correção"]
  },
  {
    id: "2",
    title: "Melhor época para plantar milho no Sul",
    summary: "Conheça os períodos ideais para o plantio do milho na região Sul do Brasil",
    content: `
      <p class="mb-4">O milho é uma cultura de grande importância econômica para a região Sul do Brasil. O sucesso da produção está diretamente relacionado à época de plantio, que varia de acordo com as condições climáticas específicas desta região.</p>
      
      <p class="mb-4"><strong>Fatores que influenciam a época de plantio:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Temperatura</li>
        <li>Disponibilidade hídrica</li>
        <li>Fotoperíodo</li>
        <li>Ciclo da cultivar</li>
        <li>Zoneamento agrícola de risco climático</li>
      </ul>
      
      <p class="mb-4"><strong>Safra de verão (1ª safra):</strong></p>
      <p class="mb-4">Para o plantio da safra de verão no Sul do Brasil, o período ideal geralmente compreende:</p>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Paraná:</strong> 1º de setembro a 31 de outubro</li>
        <li><strong>Santa Catarina:</strong> 15 de agosto a 15 de novembro</li>
        <li><strong>Rio Grande do Sul:</strong> 15 de agosto a 31 de outubro</li>
      </ul>
      
      <p class="mb-4"><strong>Safrinha (2ª safra):</strong></p>
      <p class="mb-4">A safrinha de milho no Sul tem janela de plantio mais restrita:</p>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Paraná:</strong> 10 de janeiro a 28 de fevereiro</li>
        <li><strong>Santa Catarina:</strong> Janeiro (regiões mais quentes apenas)</li>
        <li><strong>Rio Grande do Sul:</strong> Pouco recomendado devido ao risco de geadas</li>
      </ul>
      
      <p class="mb-4"><strong>Vantagens do plantio na época correta:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Aproveitamento máximo do ciclo vegetativo</li>
        <li>Menores problemas com pragas e doenças</li>
        <li>Melhores condições hídricas durante os períodos críticos</li>
        <li>Escape de geadas (especialmente importante no Sul)</li>
        <li>Maior potencial produtivo</li>
      </ul>
      
      <p class="mb-4"><strong>Cuidados adicionais:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Consulte sempre o zoneamento agrícola para sua região específica</li>
        <li>Considere a previsão climática sazonal ao planejar o plantio</li>
        <li>Escolha híbridos adaptados às condições de sua região</li>
        <li>Avalie o histórico climático da propriedade</li>
        <li>Escalone o plantio quando possível, para reduzir riscos climáticos</li>
      </ul>
      
      <p class="mb-4">Adaptações locais são necessárias conforme o microclima de sua propriedade. Consulte sempre a assistência técnica para recomendações específicas.</p>
    `,
    category: "Culturas",
    tags: ["milho", "plantio", "região sul", "época", "clima"]
  },
  {
    id: "3",
    title: "Manejo integrado de pragas na soja",
    summary: "Estratégias eficientes para controlar pragas na cultura da soja",
    content: `
      <p class="mb-4">O Manejo Integrado de Pragas (MIP) é uma abordagem que combina diferentes métodos de controle para manter as populações de pragas abaixo do nível de dano econômico, preservando o meio ambiente e a rentabilidade da produção.</p>
      
      <p class="mb-4"><strong>Principais pragas da soja:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Lagartas (Anticarsia gemmatalis, Chrysodeixis includens)</li>
        <li>Percevejos (Euschistus heros, Nezara viridula)</li>
        <li>Ácaros (Tetranychus urticae)</li>
        <li>Mosca-branca (Bemisia tabaci)</li>
        <li>Helicoverpa armigera</li>
      </ul>
      
      <p class="mb-4"><strong>Pilares do MIP na soja:</strong></p>
      <p class="mb-4">1. <strong>Monitoramento constante:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Realize amostragens semanais utilizando o pano de batida</li>
        <li>Identifique corretamente as espécies presentes</li>
        <li>Quantifique o nível populacional das pragas</li>
        <li>Registre a presença de inimigos naturais</li>
      </ul>
      
      <p class="mb-4">2. <strong>Níveis de ação:</strong></p>
      <p class="mb-4">Só aplique defensivos quando atingir os níveis:</p>
      <ul class="list-disc pl-5 mb-4">
        <li>Lagartas desfolhadoras: 20 lagartas/m ou 30% de desfolha (fase vegetativa)</li>
        <li>Lagartas desfolhadoras: 20 lagartas/m ou 15% de desfolha (fase reprodutiva)</li>
        <li>Percevejos: 2 percevejos/m (grãos para consumo)</li>
        <li>Percevejos: 1 percevejo/m (produção de sementes)</li>
      </ul>
      
      <p class="mb-4">3. <strong>Métodos de controle integrados:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Cultural:</strong> Rotação de culturas, plantio direto, ajuste da época de semeadura</li>
        <li><strong>Biológico:</strong> Uso de Bacillus thuringiensis, Trichogramma, fungos entomopatogênicos</li>
        <li><strong>Genético:</strong> Cultivares resistentes (Bt)</li>
        <li><strong>Químico:</strong> Uso racional de inseticidas, priorizando seletivos e rotação de princípios ativos</li>
      </ul>
      
      <p class="mb-4">4. <strong>Preservação de inimigos naturais:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Predadores: joaninhas, percevejos predadores, aranhas</li>
        <li>Parasitoides: vespas, moscas</li>
        <li>Entomopatógenos: fungos, vírus, bactérias</li>
      </ul>
      
      <p class="mb-4"><strong>Benefícios do MIP:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Redução do número de aplicações de inseticidas</li>
        <li>Economia nos custos de produção</li>
        <li>Menor impacto ambiental</li>
        <li>Preservação dos inimigos naturais</li>
        <li>Manejo de resistência das pragas</li>
      </ul>
      
      <p class="mb-4">Implementar o MIP exige comprometimento e conhecimento técnico, mas os resultados econômicos e ambientais justificam o investimento.</p>
    `,
    category: "Proteção de Plantas",
    tags: ["soja", "pragas", "MIP", "controle", "insetos"]
  },
  {
    id: "4",
    title: "Rotação de culturas: benefícios e planejamento",
    summary: "Como implementar rotação de culturas para melhorar a produtividade e saúde do solo",
    content: `
      <p class="mb-4">A rotação de culturas é uma prática agrícola que consiste em alternar diferentes espécies vegetais em uma mesma área ao longo do tempo. Esta prática traz diversos benefícios para o sistema produtivo e para o meio ambiente.</p>
      
      <p class="mb-4"><strong>Principais benefícios da rotação de culturas:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Redução da pressão de pragas e doenças específicas</li>
        <li>Melhoria da estrutura física do solo</li>
        <li>Controle da erosão</li>
        <li>Aumento da biodiversidade do solo</li>
        <li>Controle de plantas daninhas</li>
        <li>Melhor aproveitamento de nutrientes</li>
        <li>Quebra de ciclos de patógenos</li>
        <li>Diversificação da renda</li>
      </ul>
      
      <p class="mb-4"><strong>Planejamento da rotação:</strong></p>
      <p class="mb-4">Um bom planejamento de rotação deve considerar:</p>
      <ul class="list-disc pl-5 mb-4">
        <li>Famílias botânicas diferentes (ex: gramíneas e leguminosas)</li>
        <li>Diferentes sistemas radiculares (fasciculado e pivotante)</li>
        <li>Ciclos complementares das culturas</li>
        <li>Adaptação às condições regionais</li>
        <li>Mercado para os produtos</li>
      </ul>
      
      <p class="mb-4"><strong>Exemplos de rotações para diferentes regiões:</strong></p>
      <p class="mb-4">1. <strong>Centro-Oeste e Sul (Sistema Soja/Milho):</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>1º ano: Soja (safra) - Milho (safrinha)</li>
        <li>2º ano: Milho (safra) - Trigo ou aveia (inverno)</li>
        <li>3º ano: Soja (safra) - Braquiária ou milheto (cobertura)</li>
      </ul>
      
      <p class="mb-4">2. <strong>Rotação para Recuperação de Solo:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>1º ano: Soja - Aveia preta + nabo forrageiro</li>
        <li>2º ano: Milho consorciado com braquiária</li>
        <li>3º ano: Trigo - Soja</li>
        <li>4º ano: Feijão - Pousio ou adubação verde</li>
      </ul>
      
      <p class="mb-4"><strong>Dicas para implementação:</strong></p>
      <ul class="list-disc pl-5 mb-4">
        <li>Inicie a rotação em parte da propriedade para ganhar experiência</li>
        <li>Considere culturas comerciais e de cobertura</li>
        <li>Observe a sequência de herbicidas utilizados (efeito residual)</li>
        <li>Monitore a fertilidade do solo e ajuste as adubações</li>
        <li>Avalie os resultados ao longo do tempo (produtividade, sanidade, custos)</li>
      </ul>
      
      <p class="mb-4"><strong>Recomendações finais:</strong></p>
      <p class="mb-4">Desenvolva um plano de rotação de 3 a 5 anos e reavalie constantemente. Considere aspectos econômicos, mas valorize também os benefícios de médio e longo prazo. A rotação de culturas é um investimento na sustentabilidade do seu sistema produtivo.</p>
    `,
    category: "Manejo de Solo",
    tags: ["rotação", "manejo", "solo", "sustentabilidade"]
  }
];
