import { useNavigate } from 'react-router-dom';
import { AuditTrail } from '@/components/admin/AuditTrail';
import { SteveOwnerGate } from '@/components/SteveOwnerGate';

const AuditTrailPage = () => {
  const navigate = useNavigate();

  return (
    <SteveOwnerGate>
      <AuditTrail onBack={() => navigate('/admin')} />
    </SteveOwnerGate>
  );
};

export default AuditTrailPage;
