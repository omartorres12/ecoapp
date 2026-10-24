import { QuestionDef } from '../types';

export const BOGOTA_LOCALIDADES = [
  'Usaquén',
  'Chapinero',
  'Suba',
  'Teusaquillo',
  'Kennedy',
  'Engativá',
  'Fontibón',
  'Cedritos',
  'Santa Bárbara',
  'Barrios Unidos',
  'Salitre',
  'Puente Aranda'
];

export const ALL_QUESTIONS: QuestionDef[] = [
  {
    id: 'nombre',
    number: 1,
    title: '¿Cuál es tu nombre?',
    subtitle: 'Nos gusta saber con quién estamos conversando.',
    type: 'text',
    placeholder: 'Escribe tu nombre o apodo...',
    optional: false,
  },
  {
    id: 'edad',
    number: 2,
    title: '¿Cuál es tu rango de edad?',
    subtitle: 'Para entender mejor a nuestra comunidad.',
    type: 'radio',
    options: [
      'Menos de 18',
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55 o más'
    ],
    optional: false,
  },
  {
    id: 'localidad',
    number: 3,
    title: '¿En qué localidad o barrio de Bogotá vives?',
    subtitle: 'Queremos saber dónde empezar nuestras rutas de entrega.',
    type: 'text',
    placeholder: 'Ej: Chapinero Alto, Cedritos, Modelia...',
    suggestions: BOGOTA_LOCALIDADES,
    optional: false,
  },
  {
    id: 'tieneMascota',
    number: 4,
    title: '¿Tienes mascota?',
    subtitle: 'EcoGuardian cuida el planeta junto a tus compañeros peludos.',
    type: 'radio',
    options: [
      'Perro',
      'Gato',
      'Otro',
      'No tengo'
    ],
    optional: false,
  },
  {
    id: 'frecuenciaPaseo',
    number: 5,
    title: '¿Con qué frecuencia sacas a tu mascota a pasear?',
    subtitle: 'Cuéntanos la rutina habitual de paseos en Bogotá.',
    type: 'radio',
    options: [
      'Varias veces al día',
      'Una vez al día',
      'Algunas veces por semana',
      'Casi nunca'
    ],
    optional: false,
  },
  {
    id: 'queUsaHoy',
    number: 6,
    title: '¿Qué usas hoy para recoger las heces?',
    subtitle: 'Para conocer los hábitos actuales en tu hogar.',
    type: 'radio',
    options: [
      'Bolsa plástica común',
      'Bolsa biodegradable',
      'Papel o periódico',
      'No recojo'
    ],
    optional: false,
  },
  {
    id: 'gastoMensual',
    number: 7,
    title: '¿Cuánto gastas al mes en bolsas para tu mascota?',
    subtitle: 'Calcula un estimado en pesos colombianos.',
    type: 'radio',
    options: [
      'Menos de $5.000',
      '$5.000-$10.000',
      '$10.000-$20.000',
      'Más de $20.000'
    ],
    optional: false,
  },
  {
    id: 'importanciaBiodegradable',
    number: 8,
    title: '¿Qué tan importante es para ti que la bolsa sea biodegradable?',
    subtitle: 'Las bolsas EcoGuardian se degradan naturalmente en 180 días sin microplásticos.',
    type: 'stars',
    optional: false,
  },
  {
    id: 'masImportanteBolsa',
    number: 9,
    title: '¿Qué es lo más importante al elegir una bolsa?',
    subtitle: 'Selecciona máximo 2 factores clave para ti.',
    type: 'multi',
    maxSelect: 2,
    options: [
      'Resistencia',
      'Precio',
      'Que sea biodegradable',
      'Que no huela',
      'Facilidad de uso'
    ],
    optional: false,
  },
  {
    id: 'precioSuscripcion',
    number: 10,
    title: '¿Cuánto pagarías al mes por una suscripción con dispensador gratis?',
    subtitle: 'Recibe tus rollos mensuales a domicilio sin preocuparte por que se acaben.',
    type: 'radio',
    options: [
      'Menos de $10.000',
      '$10.000-$15.000',
      '$15.000-$25.000',
      'Más de $25.000'
    ],
    optional: false,
  },
  {
    id: 'dondeComprar',
    number: 11,
    title: '¿Dónde preferirías comprar tus bolsas EcoGuardian?',
    subtitle: 'Puedes seleccionar varias opciones.',
    type: 'multi',
    options: [
      'Página web',
      'WhatsApp',
      'Tienda de mascotas',
      'Supermercado',
      'Veterinaria'
    ],
    optional: false,
  },
  {
    id: 'preocupaciones',
    number: 12,
    title: '¿Qué te preocupa de comprar un producto biodegradable?',
    subtitle: 'Selección múltiple. Queremos resolver tus dudas reales.',
    type: 'multi',
    options: [
      'Que se rompa',
      'Precio alto',
      'Dudo de que sea biodegradable de verdad',
      'No lo encuentro cerca',
      'Nada'
    ],
    optional: false,
  },
  {
    id: 'nps',
    number: 13,
    title: '¿Recomendarías EcoGuardian a un amigo o familiar?',
    subtitle: 'En una escala de 0 (nada probable) a 10 (totalmente seguro).',
    type: 'scale-0-10',
    optional: false,
  },
  {
    id: 'comentarios',
    number: 14,
    title: 'Comentarios o sugerencias',
    subtitle: '¿Tienes alguna idea o inquietud que quisieras compartir con el equipo?',
    type: 'textarea',
    placeholder: 'Escribe aquí tu opinión, sugerencia o expectativa...',
    optional: true,
  },
  {
    id: 'whatsapp',
    number: 15,
    title: 'Número de WhatsApp para contactarte',
    subtitle: 'Opcional. Te avisaremos cuando lancemos muestras gratis y promociones en Bogotá.',
    type: 'phone',
    placeholder: 'Ej: 304 379 5676',
    optional: true,
  },
];
