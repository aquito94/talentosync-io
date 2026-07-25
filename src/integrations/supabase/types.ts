export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      candidatos: {
        Row: {
          ciudad: string | null
          competencias: string[] | null
          correo: string | null
          created_at: string
          cv_storage_path: string | null
          cv_url: string | null
          disponibilidad: string | null
          educacion: Json | null
          estado: Database["public"]["Enums"]["estado_candidato"]
          experiencia: Json | null
          experiencia_anos: number | null
          id: string
          idiomas: Json | null
          linkedin_url: string | null
          metadata: Json | null
          moneda: string | null
          nombre_completo: string
          notas: string | null
          pais: string | null
          portfolio_url: string | null
          pretension_salarial: number | null
          resumen_profesional: string | null
          telefono: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ciudad?: string | null
          competencias?: string[] | null
          correo?: string | null
          created_at?: string
          cv_storage_path?: string | null
          cv_url?: string | null
          disponibilidad?: string | null
          educacion?: Json | null
          estado?: Database["public"]["Enums"]["estado_candidato"]
          experiencia?: Json | null
          experiencia_anos?: number | null
          id?: string
          idiomas?: Json | null
          linkedin_url?: string | null
          metadata?: Json | null
          moneda?: string | null
          nombre_completo: string
          notas?: string | null
          pais?: string | null
          portfolio_url?: string | null
          pretension_salarial?: number | null
          resumen_profesional?: string | null
          telefono?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ciudad?: string | null
          competencias?: string[] | null
          correo?: string | null
          created_at?: string
          cv_storage_path?: string | null
          cv_url?: string | null
          disponibilidad?: string | null
          educacion?: Json | null
          estado?: Database["public"]["Enums"]["estado_candidato"]
          experiencia?: Json | null
          experiencia_anos?: number | null
          id?: string
          idiomas?: Json | null
          linkedin_url?: string | null
          metadata?: Json | null
          moneda?: string | null
          nombre_completo?: string
          notas?: string | null
          pais?: string | null
          portfolio_url?: string | null
          pretension_salarial?: number | null
          resumen_profesional?: string | null
          telefono?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversaciones_copilot: {
        Row: {
          archivada: boolean
          contexto: Json | null
          created_at: string
          id: string
          modelo_ia: string | null
          proceso_id: string | null
          titulo: string
          ultimo_mensaje_at: string | null
          updated_at: string
          user_id: string
          vacante_id: string | null
        }
        Insert: {
          archivada?: boolean
          contexto?: Json | null
          created_at?: string
          id?: string
          modelo_ia?: string | null
          proceso_id?: string | null
          titulo?: string
          ultimo_mensaje_at?: string | null
          updated_at?: string
          user_id: string
          vacante_id?: string | null
        }
        Update: {
          archivada?: boolean
          contexto?: Json | null
          created_at?: string
          id?: string
          modelo_ia?: string | null
          proceso_id?: string | null
          titulo?: string
          ultimo_mensaje_at?: string | null
          updated_at?: string
          user_id?: string
          vacante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversaciones_copilot_proceso_id_fkey"
            columns: ["proceso_id"]
            isOneToOne: false
            referencedRelation: "procesos_seleccion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversaciones_copilot_vacante_id_fkey"
            columns: ["vacante_id"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      correos_generados: {
        Row: {
          asunto: string
          candidato_id: string | null
          created_at: string
          cuerpo: string
          destinatario_correo: string
          destinatario_nombre: string | null
          estado: Database["public"]["Enums"]["estado_correo"]
          fecha_envio: string | null
          fecha_programada: string | null
          id: string
          metadata: Json | null
          modelo_ia: string | null
          proceso_id: string | null
          tipo: Database["public"]["Enums"]["tipo_correo"]
          updated_at: string
          user_id: string
          vacante_id: string | null
        }
        Insert: {
          asunto: string
          candidato_id?: string | null
          created_at?: string
          cuerpo: string
          destinatario_correo: string
          destinatario_nombre?: string | null
          estado?: Database["public"]["Enums"]["estado_correo"]
          fecha_envio?: string | null
          fecha_programada?: string | null
          id?: string
          metadata?: Json | null
          modelo_ia?: string | null
          proceso_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_correo"]
          updated_at?: string
          user_id: string
          vacante_id?: string | null
        }
        Update: {
          asunto?: string
          candidato_id?: string | null
          created_at?: string
          cuerpo?: string
          destinatario_correo?: string
          destinatario_nombre?: string | null
          estado?: Database["public"]["Enums"]["estado_correo"]
          fecha_envio?: string | null
          fecha_programada?: string | null
          id?: string
          metadata?: Json | null
          modelo_ia?: string | null
          proceso_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_correo"]
          updated_at?: string
          user_id?: string
          vacante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "correos_generados_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correos_generados_proceso_id_fkey"
            columns: ["proceso_id"]
            isOneToOne: false
            referencedRelation: "procesos_seleccion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correos_generados_vacante_id_fkey"
            columns: ["vacante_id"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      entrevistas: {
        Row: {
          candidato_id: string | null
          created_at: string
          duracion_minutos: number | null
          entrevistador: string | null
          entrevistador_correo: string | null
          fecha_programada: string
          feedback: string | null
          id: string
          notas: string | null
          preguntas_star: Json | null
          proceso_id: string
          puntuacion: number | null
          resultado: Database["public"]["Enums"]["resultado_entrevista"]
          tipo: Database["public"]["Enums"]["tipo_entrevista"]
          ubicacion_o_enlace: string | null
          updated_at: string
          user_id: string
          vacante_id: string | null
        }
        Insert: {
          candidato_id?: string | null
          created_at?: string
          duracion_minutos?: number | null
          entrevistador?: string | null
          entrevistador_correo?: string | null
          fecha_programada: string
          feedback?: string | null
          id?: string
          notas?: string | null
          preguntas_star?: Json | null
          proceso_id: string
          puntuacion?: number | null
          resultado?: Database["public"]["Enums"]["resultado_entrevista"]
          tipo?: Database["public"]["Enums"]["tipo_entrevista"]
          ubicacion_o_enlace?: string | null
          updated_at?: string
          user_id: string
          vacante_id?: string | null
        }
        Update: {
          candidato_id?: string | null
          created_at?: string
          duracion_minutos?: number | null
          entrevistador?: string | null
          entrevistador_correo?: string | null
          fecha_programada?: string
          feedback?: string | null
          id?: string
          notas?: string | null
          preguntas_star?: Json | null
          proceso_id?: string
          puntuacion?: number | null
          resultado?: Database["public"]["Enums"]["resultado_entrevista"]
          tipo?: Database["public"]["Enums"]["tipo_entrevista"]
          ubicacion_o_enlace?: string | null
          updated_at?: string
          user_id?: string
          vacante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevistas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_proceso_id_fkey"
            columns: ["proceso_id"]
            isOneToOne: false
            referencedRelation: "procesos_seleccion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_vacante_id_fkey"
            columns: ["vacante_id"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones_ia: {
        Row: {
          ajuste_cultural: number | null
          candidato_id: string | null
          coincidencia_criterios: Json | null
          compatibilidad: number | null
          competencias_detectadas: string[] | null
          created_at: string
          fortalezas: string[] | null
          id: string
          modelo_ia: string | null
          preguntas_sugeridas: Json | null
          proceso_id: string | null
          raw_response: Json | null
          recomendacion: string | null
          resumen_ejecutivo: string | null
          riesgos: string[] | null
          tokens_utilizados: number | null
          updated_at: string
          user_id: string
          vacante_id: string | null
        }
        Insert: {
          ajuste_cultural?: number | null
          candidato_id?: string | null
          coincidencia_criterios?: Json | null
          compatibilidad?: number | null
          competencias_detectadas?: string[] | null
          created_at?: string
          fortalezas?: string[] | null
          id?: string
          modelo_ia?: string | null
          preguntas_sugeridas?: Json | null
          proceso_id?: string | null
          raw_response?: Json | null
          recomendacion?: string | null
          resumen_ejecutivo?: string | null
          riesgos?: string[] | null
          tokens_utilizados?: number | null
          updated_at?: string
          user_id: string
          vacante_id?: string | null
        }
        Update: {
          ajuste_cultural?: number | null
          candidato_id?: string | null
          coincidencia_criterios?: Json | null
          compatibilidad?: number | null
          competencias_detectadas?: string[] | null
          created_at?: string
          fortalezas?: string[] | null
          id?: string
          modelo_ia?: string | null
          preguntas_sugeridas?: Json | null
          proceso_id?: string | null
          raw_response?: Json | null
          recomendacion?: string | null
          resumen_ejecutivo?: string | null
          riesgos?: string[] | null
          tokens_utilizados?: number | null
          updated_at?: string
          user_id?: string
          vacante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_ia_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_ia_proceso_id_fkey"
            columns: ["proceso_id"]
            isOneToOne: false
            referencedRelation: "procesos_seleccion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_ia_vacante_id_fkey"
            columns: ["vacante_id"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes_copilot: {
        Row: {
          contenido: string
          conversacion_id: string
          created_at: string
          id: string
          metadata: Json | null
          rol: string
          tokens: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contenido: string
          conversacion_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          rol: string
          tokens?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contenido?: string
          conversacion_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          rol?: string
          tokens?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_copilot_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "conversaciones_copilot"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_dashboard: {
        Row: {
          candidatos_nuevos: number | null
          candidatos_totales: number | null
          contrataciones: number | null
          correos_enviados: number | null
          created_at: string
          entrevistas_programadas: number | null
          entrevistas_realizadas: number | null
          evaluaciones_ia_ejecutadas: number | null
          fecha: string
          id: string
          metadata: Json | null
          tasa_conversion: number | null
          tiempo_promedio_contratacion: number | null
          tokens_ia_consumidos: number | null
          updated_at: string
          user_id: string
          vacantes_activas: number | null
          vacantes_creadas: number | null
        }
        Insert: {
          candidatos_nuevos?: number | null
          candidatos_totales?: number | null
          contrataciones?: number | null
          correos_enviados?: number | null
          created_at?: string
          entrevistas_programadas?: number | null
          entrevistas_realizadas?: number | null
          evaluaciones_ia_ejecutadas?: number | null
          fecha?: string
          id?: string
          metadata?: Json | null
          tasa_conversion?: number | null
          tiempo_promedio_contratacion?: number | null
          tokens_ia_consumidos?: number | null
          updated_at?: string
          user_id: string
          vacantes_activas?: number | null
          vacantes_creadas?: number | null
        }
        Update: {
          candidatos_nuevos?: number | null
          candidatos_totales?: number | null
          contrataciones?: number | null
          correos_enviados?: number | null
          created_at?: string
          entrevistas_programadas?: number | null
          entrevistas_realizadas?: number | null
          evaluaciones_ia_ejecutadas?: number | null
          fecha?: string
          id?: string
          metadata?: Json | null
          tasa_conversion?: number | null
          tiempo_promedio_contratacion?: number | null
          tokens_ia_consumidos?: number | null
          updated_at?: string
          user_id?: string
          vacantes_activas?: number | null
          vacantes_creadas?: number | null
        }
        Relationships: []
      }
      perfiles_usuarios: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          correo: string | null
          created_at: string
          empresa: string | null
          id: string
          idioma: string | null
          nombre_completo: string | null
          telefono: string | null
          updated_at: string
          user_id: string
          zona_horaria: string | null
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          correo?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          idioma?: string | null
          nombre_completo?: string | null
          telefono?: string | null
          updated_at?: string
          user_id: string
          zona_horaria?: string | null
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          correo?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          idioma?: string | null
          nombre_completo?: string | null
          telefono?: string | null
          updated_at?: string
          user_id?: string
          zona_horaria?: string | null
        }
        Relationships: []
      }
      procesos_seleccion: {
        Row: {
          candidato_id: string
          created_at: string
          etapa: Database["public"]["Enums"]["etapa_proceso"]
          fecha_aplicacion: string | null
          fecha_ultimo_cambio: string | null
          id: string
          metadata: Json | null
          notas: string | null
          prioridad: Database["public"]["Enums"]["prioridad"]
          puntuacion_general: number | null
          updated_at: string
          user_id: string
          vacante_id: string
        }
        Insert: {
          candidato_id: string
          created_at?: string
          etapa?: Database["public"]["Enums"]["etapa_proceso"]
          fecha_aplicacion?: string | null
          fecha_ultimo_cambio?: string | null
          id?: string
          metadata?: Json | null
          notas?: string | null
          prioridad?: Database["public"]["Enums"]["prioridad"]
          puntuacion_general?: number | null
          updated_at?: string
          user_id: string
          vacante_id: string
        }
        Update: {
          candidato_id?: string
          created_at?: string
          etapa?: Database["public"]["Enums"]["etapa_proceso"]
          fecha_aplicacion?: string | null
          fecha_ultimo_cambio?: string | null
          id?: string
          metadata?: Json | null
          notas?: string | null
          prioridad?: Database["public"]["Enums"]["prioridad"]
          puntuacion_general?: number | null
          updated_at?: string
          user_id?: string
          vacante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "procesos_seleccion_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procesos_seleccion_vacante_id_fkey"
            columns: ["vacante_id"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_prompt"]
          contenido: string
          created_at: string
          descripcion: string | null
          es_favorito: boolean
          es_publico: boolean
          etiquetas: string[] | null
          id: string
          titulo: string
          updated_at: string
          user_id: string
          variables: Json | null
          veces_utilizado: number
        }
        Insert: {
          categoria?: Database["public"]["Enums"]["categoria_prompt"]
          contenido: string
          created_at?: string
          descripcion?: string | null
          es_favorito?: boolean
          es_publico?: boolean
          etiquetas?: string[] | null
          id?: string
          titulo: string
          updated_at?: string
          user_id: string
          variables?: Json | null
          veces_utilizado?: number
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_prompt"]
          contenido?: string
          created_at?: string
          descripcion?: string | null
          es_favorito?: boolean
          es_publico?: boolean
          etiquetas?: string[] | null
          id?: string
          titulo?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
          veces_utilizado?: number
        }
        Relationships: []
      }
      roles_usuarios: {
        Row: {
          created_at: string
          id: string
          rol: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rol: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rol?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vacantes: {
        Row: {
          beneficios: string[] | null
          cargo: string
          ciudad: string | null
          competencias: string[] | null
          created_at: string
          departamento: string | null
          descripcion: string | null
          empresa: string | null
          estado: Database["public"]["Enums"]["estado_vacante"]
          fecha_cierre: string | null
          fecha_publicacion: string | null
          id: string
          kpis: string[] | null
          metadata: Json | null
          modalidad: Database["public"]["Enums"]["modalidad_trabajo"] | null
          moneda: string | null
          nivel: Database["public"]["Enums"]["nivel_cargo"] | null
          objetivo_cargo: string | null
          palabras_clave_ats: string[] | null
          perfil_ideal: string | null
          preguntas_star: Json | null
          responsabilidades: string[] | null
          salario_max: number | null
          salario_min: number | null
          tipo_contratacion:
            | Database["public"]["Enums"]["tipo_contratacion"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          beneficios?: string[] | null
          cargo: string
          ciudad?: string | null
          competencias?: string[] | null
          created_at?: string
          departamento?: string | null
          descripcion?: string | null
          empresa?: string | null
          estado?: Database["public"]["Enums"]["estado_vacante"]
          fecha_cierre?: string | null
          fecha_publicacion?: string | null
          id?: string
          kpis?: string[] | null
          metadata?: Json | null
          modalidad?: Database["public"]["Enums"]["modalidad_trabajo"] | null
          moneda?: string | null
          nivel?: Database["public"]["Enums"]["nivel_cargo"] | null
          objetivo_cargo?: string | null
          palabras_clave_ats?: string[] | null
          perfil_ideal?: string | null
          preguntas_star?: Json | null
          responsabilidades?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          tipo_contratacion?:
            | Database["public"]["Enums"]["tipo_contratacion"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          beneficios?: string[] | null
          cargo?: string
          ciudad?: string | null
          competencias?: string[] | null
          created_at?: string
          departamento?: string | null
          descripcion?: string | null
          empresa?: string | null
          estado?: Database["public"]["Enums"]["estado_vacante"]
          fecha_cierre?: string | null
          fecha_publicacion?: string | null
          id?: string
          kpis?: string[] | null
          metadata?: Json | null
          modalidad?: Database["public"]["Enums"]["modalidad_trabajo"] | null
          moneda?: string | null
          nivel?: Database["public"]["Enums"]["nivel_cargo"] | null
          objetivo_cargo?: string | null
          palabras_clave_ats?: string[] | null
          perfil_ideal?: string | null
          preguntas_star?: Json | null
          responsabilidades?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          tipo_contratacion?:
            | Database["public"]["Enums"]["tipo_contratacion"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "reclutador" | "manager" | "visualizador"
      categoria_prompt:
        | "vacantes"
        | "candidatos"
        | "correos"
        | "entrevistas"
        | "analisis"
        | "reportes"
        | "general"
      estado_candidato:
        | "nuevo"
        | "en_revision"
        | "preseleccionado"
        | "entrevista"
        | "oferta"
        | "contratado"
        | "descartado"
      estado_correo: "borrador" | "enviado" | "programado" | "fallido"
      estado_vacante:
        | "borrador"
        | "publicada"
        | "pausada"
        | "cerrada"
        | "archivada"
      etapa_proceso:
        | "aplicacion"
        | "screening"
        | "entrevista_inicial"
        | "prueba_tecnica"
        | "entrevista_final"
        | "oferta"
        | "contratado"
        | "rechazado"
      modalidad_trabajo: "presencial" | "remoto" | "hibrido"
      nivel_cargo:
        | "junior"
        | "semi_senior"
        | "senior"
        | "lead"
        | "manager"
        | "director"
        | "ejecutivo"
      prioridad: "baja" | "media" | "alta" | "urgente"
      resultado_entrevista: "pendiente" | "aprobado" | "rechazado" | "en_espera"
      tipo_contratacion:
        | "indefinido"
        | "temporal"
        | "obra_labor"
        | "prestacion_servicios"
        | "practicas"
        | "freelance"
      tipo_correo:
        | "invitacion"
        | "rechazo"
        | "oferta"
        | "seguimiento"
        | "agendamiento"
        | "bienvenida"
        | "personalizado"
      tipo_entrevista:
        | "telefonica"
        | "video"
        | "presencial"
        | "tecnica"
        | "panel"
        | "cultural"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "reclutador", "manager", "visualizador"],
      categoria_prompt: [
        "vacantes",
        "candidatos",
        "correos",
        "entrevistas",
        "analisis",
        "reportes",
        "general",
      ],
      estado_candidato: [
        "nuevo",
        "en_revision",
        "preseleccionado",
        "entrevista",
        "oferta",
        "contratado",
        "descartado",
      ],
      estado_correo: ["borrador", "enviado", "programado", "fallido"],
      estado_vacante: [
        "borrador",
        "publicada",
        "pausada",
        "cerrada",
        "archivada",
      ],
      etapa_proceso: [
        "aplicacion",
        "screening",
        "entrevista_inicial",
        "prueba_tecnica",
        "entrevista_final",
        "oferta",
        "contratado",
        "rechazado",
      ],
      modalidad_trabajo: ["presencial", "remoto", "hibrido"],
      nivel_cargo: [
        "junior",
        "semi_senior",
        "senior",
        "lead",
        "manager",
        "director",
        "ejecutivo",
      ],
      prioridad: ["baja", "media", "alta", "urgente"],
      resultado_entrevista: ["pendiente", "aprobado", "rechazado", "en_espera"],
      tipo_contratacion: [
        "indefinido",
        "temporal",
        "obra_labor",
        "prestacion_servicios",
        "practicas",
        "freelance",
      ],
      tipo_correo: [
        "invitacion",
        "rechazo",
        "oferta",
        "seguimiento",
        "agendamiento",
        "bienvenida",
        "personalizado",
      ],
      tipo_entrevista: [
        "telefonica",
        "video",
        "presencial",
        "tecnica",
        "panel",
        "cultural",
      ],
    },
  },
} as const
