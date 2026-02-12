import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authenticateSSO } from '../../api/auth/sso-authenticate';

const SSOAuth: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authenticating...');

  useEffect(() => {
    authenticateSSOToken();
  }, [token]);

  const authenticateSSOToken = async () => {
    try {
      if (!token) {
        throw new Error('No SSO token provided');
      }

      // Get device fingerprint
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx?.fillText('fingerprint', 10, 10);
      const fingerprint = canvas.toDataURL();
      const deviceFingerprint = btoa(fingerprint).slice(0, 32);

      // Authenticate using the SSO service
      const data = await authenticateSSO(token, deviceFingerprint);

      // Store the auth token
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setStatus('success');
      setMessage('Authentication successful! Redirecting...');

      // Redirect based on user role
      setTimeout(() => {
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else if (data.user.role === 'VENUE_ADMIN') {
          navigate('/venue-operator-portal');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (error: any) {
      console.error('SSO authentication error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed. The link may have expired or is invalid.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/admin-login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2">
            {status === 'loading' && (
              <div className="bg-cyan-500/20 border-cyan-500 w-full h-full rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="bg-emerald-500/20 border-emerald-500 w-full h-full rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/20 border-red-500 w-full h-full rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' && 'Authenticating'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          {/* Message */}
          <p className={`text-sm mb-6 ${
            status === 'loading' ? 'text-slate-400' :
            status === 'success' ? 'text-emerald-400' :
            'text-red-400'
          }`}>
            {message}
          </p>

          {/* Security Badge */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secure Single Sign-On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOAuth;
