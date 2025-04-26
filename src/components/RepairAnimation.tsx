import React from 'react';
import { Settings } from 'lucide-react';

const RepairAnimation: React.FC = () => {
  return (
    <div className="mr-2 relative">
      <div className="absolute -inset-1 bg-amber-100 rounded-full opacity-50 animate-pulse"></div>
      <Settings className="h-5 w-5 text-amber-500 repair-icon" />
    </div>
  );
};

export default RepairAnimation;