import React from 'react';

const InputField = ({ label, type = "text", value, onChange, placeholder, disabled, required, isTextarea, autoFocus }) => {
  const baseClasses = "w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition-all bg-gray-50 focus:bg-white hover:bg-white disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {isTextarea ? (
        <textarea 
          disabled={disabled} 
          required={required} 
          value={value} 
          onChange={onChange} 
          rows="3" 
          className={baseClasses} 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          type={type} 
          autoFocus={autoFocus} 
          disabled={disabled} 
          required={required} 
          value={value} 
          onChange={onChange} 
          className={baseClasses} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
};

export default InputField;