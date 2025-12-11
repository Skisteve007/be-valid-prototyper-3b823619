interface AgeGateProps {
  children: React.ReactNode;
}

// Age verification is now handled in the signup form checkbox
// This component is a pass-through wrapper
export const AgeGate = ({ children }: AgeGateProps) => {
  return <>{children}</>;
};
