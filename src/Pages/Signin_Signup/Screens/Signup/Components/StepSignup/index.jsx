import "./index.css";
export default function FormCard({ children, currentStep, prevFormStep }) {
const activeStep = (value) => {
  if(currentStep === value)
    return "active";
  else return "";
}

  return (
    <div className="formCar">
      {currentStep < 3 && (
        <>
          <div className="checkStep">
            <div className={`Step ${activeStep(0)}`} id='0'>1</div>
            <div className="Line"></div>
            <div className={`Step ${activeStep(1)}`} id='1'>2</div>
            <div className="Line"></div>
            <div className={`Step ${activeStep(2)}`} id='2'>3</div>
          </div>
        </>
      )}
      {children}
    </div>
  );
}
