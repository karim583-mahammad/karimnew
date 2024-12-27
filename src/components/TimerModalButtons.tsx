import React from 'react';

interface TimerModalButtonsProps {
  onClose: () => void;
  isFormValid: boolean;
  isSubmitDisabled: boolean;
  labelText: boolean;
}

export const TimerModalButtons: React.FC<TimerModalButtonsProps> = ({ onClose, isFormValid, isSubmitDisabled, labelText }) => {
    console.log
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
          isFormValid && !isSubmitDisabled
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-400 cursor-not-allowed'
        }`}
        disabled={isSubmitDisabled}
      >
        {labelText ? 'Add Timer' : 'Save Changes'}
      </button>
    </div>
  );
};
