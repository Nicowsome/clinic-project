// Empty placeholder to fix build errors
import React from 'react';

interface TwoFactorVerificationProps {
  userId?: string;
  email?: string;
  onSuccess: (data: any) => void;
  onBack: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = (props) => {
  const { onSuccess, onBack } = props;

  return (
    <div>
      <p>Two-factor authentication verification placeholder</p>
      <button onClick={() => onSuccess({ token: "dummy-token", user: { role: "user" } })}>
        Verify
      </button>
      <button onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default TwoFactorVerification;
