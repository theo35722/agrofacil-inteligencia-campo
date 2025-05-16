export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          summary: string | null
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      atividades: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_programada: string
          data_realizacao: string | null
          descricao: string | null
          id: string
          status: string
          talhao_id: string
          tipo: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_programada: string
          data_realizacao?: string | null
          descricao?: string | null
          id?: string
          status?: string
          talhao_id: string
          tipo: string
          user_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_programada?: string
          data_realizacao?: string | null
          descricao?: string | null
          id?: string
          status?: string
          talhao_id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosticos_pragas: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_diagnostico: string
          id: string
          nivel_infestacao: string
          observacoes: string | null
          praga: string
          talhao_id: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_diagnostico?: string
          id?: string
          nivel_infestacao: string
          observacoes?: string | null
          praga: string
          talhao_id: string
          user_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_diagnostico?: string
          id?: string
          nivel_infestacao?: string
          observacoes?: string | null
          praga?: string
          talhao_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_pragas_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      lavouras: {
        Row: {
          area_total: number | null
          atualizado_em: string
          criado_em: string
          id: string
          localizacao: string | null
          nome: string
          unidade_area: string | null
          user_id: string
        }
        Insert: {
          area_total?: number | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          localizacao?: string | null
          nome: string
          unidade_area?: string | null
          user_id: string
        }
        Update: {
          area_total?: number | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          localizacao?: string | null
          nome?: string
          unidade_area?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marketplace_products: {
        Row: {
          contact_phone: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string
          price: number
          title: string
          user_id: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          price: number
          title: string
          user_id?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          price?: number
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      practice_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          summary: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          summary: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          foto_url: string | null
          id: string
          nome: string | null
          tipo_usuario: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          foto_url?: string | null
          id: string
          nome?: string | null
          tipo_usuario?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          foto_url?: string | null
          id?: string
          nome?: string | null
          tipo_usuario?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      talhoes: {
        Row: {
          area: number | null
          atualizado_em: string
          criado_em: string
          cultura: string
          data_colheita_estimada: string | null
          data_plantio: string | null
          fase: string
          id: string
          lavoura_id: string
          nome: string
          status: string | null
          unidade_area: string | null
        }
        Insert: {
          area?: number | null
          atualizado_em?: string
          criado_em?: string
          cultura: string
          data_colheita_estimada?: string | null
          data_plantio?: string | null
          fase: string
          id?: string
          lavoura_id: string
          nome: string
          status?: string | null
          unidade_area?: string | null
        }
        Update: {
          area?: number | null
          atualizado_em?: string
          criado_em?: string
          cultura?: string
          data_colheita_estimada?: string | null
          data_plantio?: string | null
          fase?: string
          id?: string
          lavoura_id?: string
          nome?: string
          status?: string | null
          unidade_area?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talhoes_lavoura_id_fkey"
            columns: ["lavoura_id"]
            isOneToOne: false
            referencedRelation: "lavouras"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
