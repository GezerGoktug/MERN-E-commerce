import { ReactNode, useState } from "react";

const useMultipleStepForm = (comps: ReactNode[]) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < comps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return {
    next,
    prev,
    step: comps[currentStep],
  };
};

export default useMultipleStepForm;
