import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface FilterableDropdownProps {
  options: string[];
  selectedOption: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}

const FilterableDropdown: React.FC<FilterableDropdownProps> = ({
  options,
  selectedOption,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFilter('');
    }
  }, [isOpen]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setFilter('');
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-64 px-4 py-2 text-sm bg-secondary-900 border border-secondary-700 rounded shadow-sm cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-secondary-200">
          {selectedOption || placeholder}
        </span>
        <div className="flex items-center">
          {selectedOption && (
            <button
              onClick={handleClear}
              className="clear-button p-1 hover:bg-secondary-800 rounded-full"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-secondary-400 ml-2" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-64 mt-1 bg-secondary-900 border border-secondary-700 rounded shadow-lg">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm bg-secondary-800 border border-secondary-700 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-200"
                placeholder="Filter options..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-secondary-400" />
            </div>
          </div>
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <li
                key={option}
                className={`px-4 py-2 cursor-pointer text-sm ${
                  option === selectedOption
                    ? 'bg-primary-500 text-black'
                    : 'text-secondary-200 hover:bg-secondary-800'
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterableDropdown;
