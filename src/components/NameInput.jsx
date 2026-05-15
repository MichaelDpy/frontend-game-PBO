// components/NameInput.jsx
const NameInput = ({ value, onChange, placeholder = 'Enter your name...', label }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <label className="text-white font-semibold text-lg drop-shadow-md">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          px-4 py-2
          rounded-lg
          border-4 border-green-800
          bg-white/90
          text-green-900
          font-semibold
          text-center
          w-48
          focus:outline-none focus:ring-4 focus:ring-green-400
          placeholder-green-700/50
        "
      />
    </div>
  );
};

export default NameInput;
