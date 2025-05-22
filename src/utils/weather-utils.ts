
/**
 * Converte a porcentagem de chance de chuva em um texto descritivo
 * @param rainChance - Porcentagem de chance de chuva (0-100)
 * @param showPercentage - Se deve mostrar a porcentagem entre parênteses
 * @returns Texto formatado com a chance de chuva
 */
export function formatRainChance(rainChance: number, showPercentage: boolean = true): string {
  let description = '';
  
  if (rainChance >= 90) {
    description = 'Alta';
  } else if (rainChance >= 60) {
    description = 'Moderada';
  } else if (rainChance >= 30) {
    description = 'Baixa';
  } else {
    description = 'Muito baixa';
  }
  
  return showPercentage 
    ? `${description} (${rainChance}%)` 
    : description;
}
