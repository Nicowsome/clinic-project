// Empty placeholder to fix build errors
import React from 'react';

interface TwoFactorSetupProps {
  onComplete: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete }) => {
  return (
    <div>
      <p>Two-factor authentication setup placeholder</p>
      <button onClick={onComplete}>Complete Setup</button>
    </div>
  );
};

export default TwoFactorSetup;
