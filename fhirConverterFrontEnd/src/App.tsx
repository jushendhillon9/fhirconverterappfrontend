import React, { useState, useContext } from 'react';
import { FileText, Upload, Database, ArrowRight } from 'lucide-react';
import DragAndDrop from './components/DragAndDrop';
import DropdownMenu from './components/DropdownMenu'
import DatasetUpload from './components/DatasetUpload';
import {ConvertedContext} from "./contexts/ConvertedContext"
import {FileContext} from "./contexts/FileContext"
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

function App() {
  const [projectId, setProjectId] = useState('');
  const [bucketsAndObjects, setBucketsAndObjects] = useState('');
  const [isConverted, setIsConverted] = useState(false); //for context
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    setProjectId(event.target.value);
  };

  const handleSubmitId = () => {
    const accessToken = localStorage.getItem('accessToken');
    const requestBody = accessToken + ',' + projectId;

    fetch('https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/listBucketsAndObjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Failed to fetch buckets');
        }
      })
      .then((data) => {
        setBucketsAndObjects(data);
        // Further processing of data if needed
      })
      .catch((error) => {
        console.error('Error fetching buckets:', error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-emerald-50/30 dark:from-slate-950 dark:via-background dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-sky-200/50 dark:border-sky-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                FhirConverter App
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">Convert your CSV/JSON files to FHIR 🔥</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Conversion Model Overview */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Follow the Model
          </h2>
          <Card className="max-w-4xl mx-auto p-8 border-sky-200/50 dark:border-sky-800/50 shadow-xl bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <span className="text-lg font-medium text-blue-700 dark:text-blue-300">CSV</span>
              </div>
              
              <div className="text-2xl text-slate-400 dark:text-slate-500">||</div>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <span className="text-lg font-medium text-emerald-700 dark:text-emerald-300">JSON</span>
              </div>

              <ArrowRight className="h-8 w-8 text-orange-500 animate-pulse drop-shadow-sm" />

              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Database className="h-12 w-12 text-white animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <span className="text-lg font-medium text-orange-700 dark:text-orange-300">FHIR</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Individual File Conversion */}
        <section>
          <DragAndDrop />
        </section>

        {/* GCP Bucket Conversion */}
        <section>
          <Card className="max-w-2xl mx-auto border-emerald-200/50 dark:border-emerald-800/50 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/30">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg mx-auto mb-4 w-fit">
                  <Upload className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Convert from GCS Buckets</h3>
                <p className="text-muted-foreground">
                  Input your Google Cloud project ID to convert files from your buckets
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectId" className="text-emerald-700 dark:text-emerald-300">Project ID</Label>
                  <Input
                    id="projectId"
                    type="text"
                    value={projectId}
                    onChange={handleChange}
                    placeholder="Enter your GCP Project ID"
                    className="mt-1 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <Button 
                  onClick={handleSubmitId} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                  disabled={!projectId.trim()}
                >
                  Connect to Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dynamic Content */}
        <ConvertedContext.Provider value={{isConverted, setIsConverted}}>
          <FileContext.Provider value={{file, setFile}}>
            {bucketsAndObjects && (
              <section>
                <DropdownMenu givenProjectId={projectId} bucketsAndObjects={bucketsAndObjects}/>
              </section>
            )}
            {isConverted && (
              <section>
                <DatasetUpload/>
              </section>
            )}
          </FileContext.Provider>
        </ConvertedContext.Provider>
      </main>

      {/* Footer with Logo */}
      <footer className="py-12 border-t border-sky-200/50 dark:border-sky-800/50 bg-gradient-to-br from-slate-50/50 to-sky-50/30 dark:from-slate-950/50 dark:to-slate-900/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 rounded-full shadow-2xl">
            <Database className="h-16 w-16 text-white animate-pulse drop-shadow-lg" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Powered by modern healthcare technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;