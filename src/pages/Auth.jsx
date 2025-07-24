import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Chrome, 
  FileText, 
  Bell, 
  Lock,
  Loader2,
  KeyRound,
} from 'lucide-react';

const Auth = () => {
  const { user, loading, signIn, signInWithEmail } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err.message);
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message);
      setIsSigningIn(false);
    }
  };

  if (loading && !isSigningIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* CORRECTED LINE: Using the class from index.css */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold">InvoiceGuard</h1>
                <p className="text-blue-200 text-sm">Warranty Protection Hub</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Never lose track of your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> warranties</span> again
            </h2>
            
            <div className="space-y-4 mt-8">
              <FeatureItem 
                icon={FileText}
                title="Smart Invoice Processing"
                description="AI-powered data extraction from receipts."
              />
              <FeatureItem 
                icon={Bell}
                title="Warranty Alerts"
                description="Never miss an expiration date with smart notifications."
              />
              <FeatureItem 
                icon={Lock}
                title="Secure Cloud Storage"
                description="Your documents are encrypted and safely stored."
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">InvoiceGuard</h1>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
                <p className="text-blue-200">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-900/50 text-white rounded-xl py-3 pl-12 pr-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-900/50 text-white rounded-xl py-3 pl-12 pr-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSigningIn && email ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  <span>{isSigningIn && email ? 'Signing in...' : 'Sign In / Sign Up'}</span>
                </button>
              </form>

              {error && (
                <p className="mt-4 text-center text-red-400 text-sm">{error}</p>
              )}

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink mx-4 text-blue-200 text-sm">OR</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 border border-gray-200"
              >
                {isSigningIn && !email ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
      <Icon className="w-5 h-5 text-blue-300" />
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-blue-200 text-sm">{description}</p>
    </div>
  </div>
);

export default Auth;