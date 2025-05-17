
// Re-exportar todos os serviços relacionados à agricultura
export { getLavouras, getLavouraById, createLavoura } from './lavouraService';
export { getTalhoes, getTalhaoById } from './talhaoService';
export { getAtividades, getAtividadeById, createAtividade } from './atividadeService';
export { 
  getDiagnosticosPragas, 
  determinePlagueAlerts,
  getDiagnosticoById
} from './diagnosticoService';
