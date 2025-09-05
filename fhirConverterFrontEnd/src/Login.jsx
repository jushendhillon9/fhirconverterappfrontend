import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import googleLogo from './assets/googleLogoGif.gif';

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/devstorage.read_write';

const GoogleSignInButton = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef(null);

  // Load GIS script once
  useEffect(() => {
    const id = 'google-gis';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
          if (resp && resp.access_token) {
            console.log('Google sign-in success. Access token:', resp.access_token);
            localStorage.setItem('accessToken', resp.access_token);
            navigate('/convertPage');
          } else {
            console.error('No access token returned:', resp);
          }
        },
        error_callback: (err) => {
          console.error('Google sign-in failed:', err);
        },
      });
    };
    document.body.appendChild(s);
  }, []);

  const handleSignIn = () => {
    if (!tokenClientRef.current) {
      console.error('Token client not initialized yet');
      return;
    }
    tokenClientRef.current.requestAccessToken();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-emerald-50/30 dark:from-slate-950 dark:via-background dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-sky-200/50 dark:border-sky-800/50 bg-background/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-center items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
            FhirConverter App
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 rounded-full shadow-2xl mb-6">
              <Database className="h-16 w-16 text-white animate-pulse drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Welcome to FHIR Converter
            </h2>
            <p className="text-muted-foreground">
              Sign in with Google to access your healthcare data conversion tools
            </p>
          </div>

          {/* Sign-in Card */}
          <Card className="border-sky-200/50 dark:border-sky-800/50 shadow-2xl bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-sky-800 dark:text-sky-200">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Secure Authentication
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Connect to Google Cloud Storage and FHIR datasets
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-sky-200/50 dark:border-sky-800/50">
                  <img
                    src={googleLogo}
                    alt="Google Logo"
                    className="w-30 h-30 object-contain"
                  />
                </div>
              </div>

              {/* Sign-in Button */}
              <div className="space-y-4">
                <button
                  onClick={handleSignIn}
                  className="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition"
                >
                  Sign in with Google
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Continue to converter</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 border-t border-sky-200/50 dark:border-sky-800/50 bg-gradient-to-br from-slate-50/50 to-sky-50/30 dark:from-slate-950/50 dark:to-slate-900/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by modern healthcare technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GoogleSignInButton;
