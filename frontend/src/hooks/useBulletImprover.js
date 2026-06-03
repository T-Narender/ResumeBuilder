import { useState } from 'react';
import toast from 'react-hot-toast';
import { BASE_URL, API_PATHS } from '../utils/apiPath';

export const useBulletImprover = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const improveBullet = async (bulletText, jobTitle, regenerate = false) => {
    if (!bulletText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${API_PATHS.AI.IMPROVE_BULLET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText, jobTitle, regenerate }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuggestions(prev => {
          const newSuggestions = [data, ...prev].slice(0, 3);
          setCurrentIndex(0);
          return newSuggestions;
        });
      } else {
        toast.error(data.message || 'Failed to improve bullet');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while improving bullet point');
    } finally {
      setLoading(false);
    }
  };

  const nextSuggestion = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };
  
  const clearSuggestions = () => {
    setSuggestions([]);
    setCurrentIndex(0);
  };

  return {
    loading,
    currentSuggestion: suggestions.length > 0 ? suggestions[currentIndex] : null,
    totalSuggestions: suggestions.length,
    currentIndex,
    improveBullet,
    nextSuggestion,
    prevSuggestion,
    clearSuggestions
  };
};
