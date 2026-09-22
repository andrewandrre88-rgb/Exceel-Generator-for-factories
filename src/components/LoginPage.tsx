import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cloud, 
  Globe2, 
  Coins, 
  Lock,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onContinueAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onContinueAsGuest }) => {
  const { signIn, error, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    clearError();
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (err: any) {
      console.warn('Login canceled or failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">China Factory RFQ</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Excel Builder
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google Firebase Auth</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Streamlined Sourcing for Importers &amp; Brands</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create professional Excel inquiries for Chinese factories in seconds.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Upload your product reference photos, specify quantities and specs, and generate factory-ready .xlsx quotation sheets with auto-converted RMB (¥) &amp; USD ($) pricing.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">RMB (¥) Factory Quotes</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Get quotes in RMB and convert automatically to USD with live exchange formulas.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Bilingual English/Chinese</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pre-built column definitions in English &amp; 中文 for seamless supplier clarity.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Embedded Photo Grid</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Photos sit inside the Excel cells directly so suppliers know exactly what to price.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Cloud Firebase Sync</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Save your product RFQ projects securely to your account with zero setup.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Sign In to Continue</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate with Google to access your inquiries, sync projects across devices, and export custom sheets.
                </p>
              </div>

              {/* Error notice */}
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Sign in notice</p>
                    <p className="text-[11px] text-rose-300/90 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Google Sign In Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  id="google-signin-btn"
                  onClick={handleGoogleLogin}
                  disabled={isSigningIn}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isSigningIn ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
                      />
                    </svg>
                  )}
                  <span>
                    {isSigningIn ? 'Signing in with Google...' : 'Continue with Google'}
                  </span>
                </button>

                {onContinueAsGuest && (
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="w-full py-2.5 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-600/50"
                  >
                    <span>Preview Workspace in Guest Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-700/70 text-center text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure 1-click Google OAuth authentication</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Data stored safely in your isolated Firebase Firestore database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        <p>China Factory RFQ &amp; Quotation Sheet Builder • Powered by Google Firebase</p>
      </footer>
    </div>
  );
};
