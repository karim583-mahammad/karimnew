import React from 'react';

interface TimerModalButtonsProps {
  onClose: () => void;
  labelText: boolean;
}

export const TimerModalButtons: React.FC<TimerModalButtonsProps> = ({ onClose, labelText }) => {
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
        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-700
        }`}
        // disabled={isSubmitDisabled}
      >
        {labelText ? 'Add Timer' : 'Save Changes'}
      </button>
    </div>
  );
};
