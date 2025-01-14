import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { validateTimerForm } from '../utils/validation';
import { TimerModalButtons } from './TimerModalButtons';
import { Timer } from '../types/timer';
import { toast } from 'sonner';
import { TimerAudio } from '../utils/audio';




interface AddEditTimerModal {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer | null;
}

export const AddEditTimerModal: React.FC<AddEditTimerModal> = ({ isOpen, onClose, timer }) => {
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [hours, setHours] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);
  // const [touched, setTouched] = useState({
  //   title: false,
  //   hours: false,
  //   minutes: false,
  //   seconds: false,
  // });

  // const { addTimer } = useTimerStore();
  const isEditMode = !!timer;


  const [title, setTitle] = useState(timer?.title ?? '');
  const [description, setDescription] = useState(timer?.description ?? '');
  const [hours, setHours] = useState(timer ? Math.floor(timer.duration / 3600) : 0);
  const [minutes, setMinutes] = useState(timer ? Math.floor((timer.duration % 3600) / 60) : 0);
  const [seconds, setSeconds] = useState(timer ? timer.duration % 60 : 0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });
  const timerAudio = TimerAudio.getInstance();


  const { addTimer, editTimer } = useTimerStore();

  if (!isOpen) return null;

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateTimerForm({ title, description, hours, minutes, seconds })) {
  //     return;
  //   }

  //   const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  //   addTimer({
  //     title: title.trim(),
  //     description: description.trim(),
  //     duration: totalSeconds,
  //     remainingTime: totalSeconds,
  //     isRunning: false,
  //   });

  //   onClose();
  //   setTitle('');
  //   setDescription('');
  //   setHours(0);
  //   setMinutes(0);
  //   setSeconds(0);
  //   setTouched({
  //     title: false,
  //     hours: false,
  //     minutes: false,
  //     seconds: false,
  //   });
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTimerForm({ title, description, hours, minutes, seconds })) {
      timerAudio.play().catch(console.error);
      toast.error('Please check your input:', {
        description: (
          <div className="space-y-1">
            {!isTitleValid && (
              <>
              <p>• Title is required and must be less than 50 characters</p>
              <p>• Duration must be greater than 0</p>
              </>
            )}
          </div>
        ),
        duration: 4000,
        position: window.matchMedia('(min-width: 768px)').matches ? 'top-right' : 'bottom-left',
        // className: 'md:top-4 bottom-4 left-4 md:left-auto md:right-4',
        action: {
          label: 'Dismiss',
          onClick: () => {
            timerAudio.stop();
            toast.dismiss();
          }

        },
      });
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const timerData = {
      title: title.trim(),
      description: description.trim(),
      duration: totalSeconds,
    };

    if (isEditMode && timer) {
      editTimer(timer.id, timerData);
    } else {
      addTimer({
        ...timerData,
        remainingTime: totalSeconds,
        isRunning: false,
      });
    }

    onClose();
  };


  const handleClose = () => {
    onClose();
    setTouched({
      title: false,
      hours: false,
      minutes: false,
      seconds: false,
    });
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;
  const isSubmitDisabled = !(!isTitleValid && !isTimeValid);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Timer' : 'Add New Timer'}</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`${
                touched.title && !isTitleValid
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className=""
              placeholder="Enter timer description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.min(23, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, hours: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.min(59, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, minutes: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.min(59, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, seconds: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {touched.hours && touched.minutes && touched.seconds && !isTimeValid && (
              <p className="mt-2 text-sm text-red-500">
                Please set a duration greater than 0
              </p>
            )}
          </div>

          <TimerModalButtons
            onClose={handleClose}
            // isFormValid={isTitleValid && isTimeValid}
            // isSubmitDisabled={!isSubmitDisabled}
            labelText={!isEditMode}
          />
        </form>
      </div>
    </div>
  );
};
