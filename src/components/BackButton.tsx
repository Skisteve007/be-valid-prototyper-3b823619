import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackPath = "/dashboard" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Always navigate to dashboard from dashboard sub-pages
    navigate(fallbackPath);
  };

  return (
    <button 
      onClick={handleBack}
      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition flex items-center gap-2"
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6 text-foreground" />
    </button>
  );
};

export default BackButton;
