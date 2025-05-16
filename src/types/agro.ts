
export interface Lavoura {
  id: string;
  nome: string;
  localizacao?: string;
  area_total?: number;
  unidade_area?: string;
  criado_em: string;
  atualizado_em: string;
  user_id: string;
}

export interface Talhao {
  id: string;
  lavoura_id: string;
  nome: string;
  cultura: string;
  fase: string;
  status?: string;
  area?: number;
  unidade_area?: string;
  data_plantio?: string;
  data_colheita_estimada?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Atividade {
  id: string;
  user_id: string;
  talhao_id: string;
  tipo: string;
  descricao?: string;
  status: string;
  data_programada: string;
  data_realizacao?: string;
  criado_em: string;
  atualizado_em: string;
  talhao?: Talhao; // Para relacionamento com join
}

export interface DiagnosticoPraga {
  id: string;
  user_id: string;
  talhao_id: string;
  praga: string;
  nivel_infestacao: string;
  observacoes?: string;
  data_diagnostico: string;
  criado_em: string;
  atualizado_em: string;
  talhao?: Talhao; // Para relacionamento com join
}

// Tipos para o alerta de pragas
export interface PlagueAlertData {
  hasAlert: boolean;
  message: string;
  severity?: "low" | "medium" | "high";
  culturas?: string[];
}

// Helper para formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
};
