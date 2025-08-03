import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { Language } from '../types';
import { PROGRAMMING_LANGUAGES } from '../data/languages';

interface LanguageSelectProps {
  selectedLanguage: Language | null;
  onLanguageChange: (language: Language) => void;
  placeholder?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  selectedLanguage,
  onLanguageChange,
  placeholder = "Select language"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = PROGRAMMING_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button"
      >
        <span>
          {selectedLanguage ? selectedLanguage.name : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }} 
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="search-container">
            <div style={{position: 'relative'}}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} 
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="dropdown-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => handleLanguageSelect(language)}
                  className="dropdown-item"
                >
                  <span style={{fontWeight: 500}}>{language.name}</span>
                  <span style={{opacity: 0.7, fontSize: '0.875rem'}}>.{language.extension}</span>
                </button>
              ))
            ) : (
              <div style={{padding: '1rem 1.25rem', textAlign: 'center', opacity: 0.7}}>
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};