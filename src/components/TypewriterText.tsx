
import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  pauseBetween?: number;
  className?: string;
}

const TypewriterText = ({ texts, speed = 100, pauseBetween = 2000, className = '' }: TypewriterTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start pause before deleting
          setTimeout(() => setIsDeleting(true), pauseBetween);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentFullText.slice(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, speed, pauseBetween]);

  return (
    <div className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </div>
  );
};

export default TypewriterText;
