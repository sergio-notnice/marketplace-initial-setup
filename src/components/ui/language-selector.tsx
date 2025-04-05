import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Globe2, X, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Language } from '../../types';

// Available languages with their codes
const availableLanguages = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'es', name: 'Spanish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'sk', name: 'Slovak' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ar', name: 'Arabic' }
];

const proficiencyLevels = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' }
];

interface LanguageSelectorProps {
  onAdd: (language: Language) => void;
  existingLanguages?: Language[];
}

export function LanguageSelector({ onAdd, existingLanguages = [] }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showProficiencyModal, setShowProficiencyModal] = useState(false);
  const [selectedProficiency, setSelectedProficiency] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter out already selected languages
  const availableOptions = availableLanguages.filter(
    lang => !existingLanguages.some(existing => existing.language === lang.name)
  );

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.bottom > viewportHeight) {
        window.scrollTo({
          top: window.scrollY + (rect.bottom - viewportHeight) + 20,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowProficiencyModal(true);
  };

  const handleProficiencySelect = (proficiency: string) => {
    setSelectedProficiency(proficiency);
  };

  const handleAdd = () => {
    if (!selectedLanguage || !selectedProficiency) return;
    
    const language = availableLanguages.find(l => l.name === selectedLanguage);
    if (!language) return;

    onAdd({
      language: language.name,
      proficiency: selectedProficiency as Language['proficiency'],
      is_content_language: true
    });

    setSelectedLanguage(null);
    setSelectedProficiency(null);
    setShowProficiencyModal(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg text-left",
          isOpen ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">
            {selectedLanguage || "Select language"}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-gray-400 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="p-2 max-h-64 overflow-y-auto grid grid-cols-2 gap-1">
            {availableOptions.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.name)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-left group",
                  selectedLanguage === lang.name
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-gray-50"
                )}
              >
                <span className={`fi fi-${lang.code === 'en' ? 'gb' : lang.code}`}></span>
                <span>{lang.name}</span>
                {selectedLanguage === lang.name && selectedProficiency && (
                  <span className="ml-auto font-bold text-indigo-600">
                    {selectedProficiency.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Proficiency Modal */}
      {showProficiencyModal && selectedLanguage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Select Proficiency Level</h3>
              <button 
                onClick={() => setShowProficiencyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {proficiencyLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleProficiencySelect(level.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg text-left transition-colors",
                    selectedProficiency === level.value
                      ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-500"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{level.label}</span>
                    {selectedProficiency === level.value && (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowProficiencyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedProficiency}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LanguageItem({ 
  language, 
  onRemove 
}: { 
  language: Language; 
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <span className={`fi fi-${language.language.toLowerCase() === 'english' ? 'gb' : language.language.toLowerCase()} text-lg`}></span>
        <div>
          <p className="font-medium text-gray-900">{language.language}</p>
          <p className="text-sm text-gray-500 capitalize">{language.proficiency}</p>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}