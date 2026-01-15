export const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="mb-10">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-1/2 top-4 h-0.5 bg-gray-200 transform -translate-x-1/2 w-[calc(100%-4rem)]">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
              maxWidth: '100%'
            }}
          />
        </div>
        
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isActive = currentStep >= index;
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};