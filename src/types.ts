export interface SurveyAnswers {
  nombre: string;
  edad: string;
  localidad: string;
  tieneMascota: string;
  frecuenciaPaseo?: string;
  queUsaHoy?: string;
  gastoMensual?: string;
  importanciaBiodegradable?: number;
  masImportanteBolsa?: string[];
  precioSuscripcion?: string;
  dondeComprar?: string[];
  preocupaciones: string[];
  nps: number | null;
  comentarios?: string;
  whatsapp?: string;
}

export type QuestionId =
  | 'nombre'
  | 'edad'
  | 'localidad'
  | 'tieneMascota'
  | 'frecuenciaPaseo'
  | 'queUsaHoy'
  | 'gastoMensual'
  | 'importanciaBiodegradable'
  | 'masImportanteBolsa'
  | 'precioSuscripcion'
  | 'dondeComprar'
  | 'preocupaciones'
  | 'nps'
  | 'comentarios'
  | 'whatsapp';

export type QuestionType =
  | 'text'
  | 'radio'
  | 'stars'
  | 'multi'
  | 'scale-0-10'
  | 'textarea'
  | 'phone';

export interface QuestionDef {
  id: QuestionId;
  number: number;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: string[];
  maxSelect?: number;
  optional?: boolean;
  placeholder?: string;
  iconName?: string;
  suggestions?: string[];
}

export interface SavedSurveyRecord {
  id: string;
  createdAt: string;
  timestamp: number;
  answers: SurveyAnswers;
}
