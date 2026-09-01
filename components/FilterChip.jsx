const FilterChip = ({
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white shadow-lg scale-105"
          : "bg-white border border-gray-300 text-[#081D4A] hover:border-[#6C3CE9] hover:text-[#6C3CE9] hover:shadow-md"
      }`}
    >
      {label}
    </button>
  );
};

export default FilterChip;