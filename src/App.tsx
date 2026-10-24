import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_QUESTIONS } from './data/questions';
import { QuestionDef, SurveyAnswers } from './types';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { ThankYouScreen } from './components/ThankYouScreen';
import { AdminModal } from './components/AdminModal';
import { InstallModal } from './components/InstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { clearDraft, loadDraft, saveDraft } from './utils/storage';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const INITIAL_ANSWERS: SurveyAnswers = {
  nombre: '',
  edad: '',
  localidad: '',
  tieneMascota: '',
  frecuenciaPaseo: '',
  queUsaHoy: '',
  gastoMensual: '',
  importanciaBiodegradable: 0,
  masImportanteBolsa: [],
  precioSuscripcion: '',
  dondeComprar: [],
  preocupaciones: [],
  nps: null,
  comentarios: '',
  whatsapp: '',
};

type ScreenType = 'welcome' | 'survey' | 'summary' | 'thank-you';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_ANSWERS);
  const [direction, setDirection] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWAInstall();

  // Try to restore draft on initial load
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
      setAnswers((prev) => ({ ...prev, ...draft.answers }));
    }
  }, []);

  // Compute active question list based on pet ownership
  // If user selects "No tengo" mascota, questions 5 through 11 are skipped!
  const activeQuestions = useMemo(() => {
    const hasNoPet = answers.tieneMascota && answers.tieneMascota.toLowerCase() === 'no tengo';
    if (hasNoPet) {
      return ALL_QUESTIONS.filter((q) => q.number <= 4 || q.number >= 12);
    }
    return ALL_QUESTIONS;
  }, [answers.tieneMascota]);

  const currentQuestion: QuestionDef = activeQuestions[currentIndex] || activeQuestions[0];

  // Validate current question
  const validateCurrentStep = (): boolean => {
    setValidationError(null);
    if (!currentQuestion) return true;
    if (currentQuestion.optional) return true;

    const val = answers[currentQuestion.id as keyof SurveyAnswers];

    switch (currentQuestion.type) {
      case 'text':
        if (!val || typeof val !== 'string' || !val.trim()) {
          setValidationError('Por favor ingresa una respuesta para continuar.');
          return false;
        }
        break;
      case 'radio':
        if (!val || typeof val !== 'string' || !val.trim()) {
          setValidationError('Por favor selecciona una de las opciones.');
          return false;
        }
        break;
      case 'stars':
        if (!val || typeof val !== 'number' || val <= 0) {
          setValidationError('Por favor selecciona una calificación de 1 a 5 estrellas.');
          return false;
        }
        break;
      case 'multi':
        if (!val || !Array.isArray(val) || val.length === 0) {
          setValidationError('Por favor selecciona al menos una opción.');
          return false;
        }
        break;
      case 'scale-0-10':
        if (answers.nps === null || answers.nps === undefined) {
          setValidationError('Por favor selecciona una puntuación entre 0 y 10.');
          return false;
        }
        break;
    }

    return true;
  };

  const handleFieldChange = (field: keyof SurveyAnswers, value: unknown) => {
    setValidationError(null);
    setAnswers((prev) => {
      const updated = { ...prev, [field]: value };
      saveDraft(updated, currentIndex);
      return updated;
    });
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentIndex < activeQuestions.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end of questions, proceed to Summary
      setScreen('summary');
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Back from first question goes to welcome
      setScreen('welcome');
    }
  };

  const handleStartSurvey = () => {
    setCurrentIndex(0);
    setScreen('survey');
  };

  const handleEditQuestion = (stepIndex: number) => {
    const targetIdx = Math.min(Math.max(0, stepIndex), activeQuestions.length - 1);
    setCurrentIndex(targetIdx);
    setScreen('survey');
  };

  const handleSurveySubmitted = () => {
    clearDraft();
    setScreen('thank-you');
  };

  const handleRestart = () => {
    clearDraft();
    setAnswers(INITIAL_ANSWERS);
    setCurrentIndex(0);
    setScreen('welcome');
  };

  // Variants for question slide transitions
  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between selection:bg-[#1F5C3A]/20">
      {/* Header with 3s logo hold trigger */}
      <Header
        onAdminOpen={() => setAdminOpen(true)}
        isOnline={isOnline}
        isInstalled={isInstalled}
        isInstallable={isInstallable}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
        {screen === 'welcome' && (
          <WelcomeScreen
            onStart={handleStartSurvey}
            onAdminOpen={() => setAdminOpen(true)}
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            onOpenInstallModal={() => setInstallModalOpen(true)}
          />
        )}

        {screen === 'survey' && currentQuestion && (
          <div className="w-full flex flex-col">
            {/* Top Progress Bar */}
            <div className="mb-6">
              <ProgressBar
                currentStep={currentIndex}
                totalSteps={activeQuestions.length}
                questionNumber={currentQuestion.number}
              />
            </div>

            {/* Animated Question View */}
            <div className="overflow-hidden min-h-[340px] flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <QuestionCard
                    question={currentQuestion}
                    answers={answers}
                    onChange={handleFieldChange}
                    onNext={handleNext}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Validation Notice */}
            {validationError && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Navigation Buttons: Atrás & Siguiente */}
            <div className="mt-8 flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl bg-white border border-[#DCE4DE] text-[#334D3D] text-sm font-bold hover:bg-[#F2F7F4] active:scale-95 transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1F5C3A] hover:bg-[#154228] text-white text-base font-extrabold active:scale-98 transition-all shadow-lg shadow-[#1F5C3A]/25 cursor-pointer"
              >
                <span>
                  {currentIndex === activeQuestions.length - 1 ? 'Revisar Respuestas' : 'Siguiente'}
                </span>
                {currentIndex === activeQuestions.length - 1 ? (
                  <CheckCircle className="w-5 h-5 text-[#86EFAC]" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {screen === 'summary' && (
          <SummaryScreen
            answers={answers}
            onEditQuestion={handleEditQuestion}
            onSubmitted={handleSurveySubmitted}
            onBack={() => setScreen('survey')}
          />
        )}

        {screen === 'thank-you' && <ThankYouScreen onRestart={handleRestart} />}
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-3 px-4 text-center border-t border-[#EAEFEA] bg-[#FFFDF9]/60 text-[11px] text-[#71867A]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span>EcoGuardian • Almidón de maíz</span>
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="hover:text-[#1F5C3A] hover:underline transition-colors"
          >
            Modo Admin (mantén presionado el logo)
          </button>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />

      {/* PWA Install Modal */}
      <InstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onInstallAndroid={install}
      />
    </div>
  );
}
