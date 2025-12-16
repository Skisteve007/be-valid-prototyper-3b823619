import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition flex items-center gap-2"
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6 text-foreground" />
    </button>
  );
};

export default BackButton;
