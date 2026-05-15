// components/ColorPicker.jsx
const ColorPicker = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="flex gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorChange(color.name)}
          className={`
            w-12 h-12 rounded-full ${color.bg} ${color.border}
            border-4
            ${selectedColor === color.name ? 'ring-4 ring-white scale-110' : ''}
            hover:scale-110 transition-transform
          `}
          aria-label={`Select ${color.name} color`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
