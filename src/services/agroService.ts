
// Re-exportar todos os serviços relacionados à agricultura
export { getLavouras, getLavouraById } from './lavouraService';
export { getTalhoes, getTalhaoById } from './talhaoService';
export { getAtividades, getAtividadeById } from './atividadeService';
export { 
  getDiagnosticosPragas, 
  determinePlagueAlerts,
  getDiagnosticoById
} from './diagnosticoService';
