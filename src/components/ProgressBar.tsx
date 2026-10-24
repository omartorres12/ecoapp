import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  questionNumber: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  questionNumber,
}) => {
  const percentage = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-[#5E7367] mb-1.5 px-0.5">
        <span className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1F5C3A] text-white text-[10px] font-bold">
            {questionNumber}
          </span>
          <span>Pregunta {questionNumber} de 15</span>
        </span>
        <span className="text-[#1F5C3A] font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-[#E4ECE7] rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#1F5C3A] to-[#2D7A4F] rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
