'use client';

import { useState, useRef, useCallback } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

const SOURCE_FORMATS: Record<string, { label: string; extensions: string }> = {
  csv: { label: 'CSV', extensions: '.csv, .tsv' },
  excel: { label: 'Excel', extensions: '.xls, .xlsx' },
  sqlite: { label: 'SQLite', extensions: '.sqlite, .db, .sqlite3' },
  sql: { label: 'SQL Dump', extensions: '.sql' },
  dbf: { label: 'DBF / DBase', extensions: '.dbf' },
};

const TARGET_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (XLSX)' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
];

type ConvertState = 'idle' | 'uploading' | 'done' | 'error';

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  const [target, setTarget] = useState('postgresql');
  const [state, setState] = useState<ConvertState>('idle');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState('');
  const [stats, setStats] = useState<{ tables: string; rows: string; warnings: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const detectFormat = (filename: string): string | null => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      csv: 'csv', tsv: 'csv',
      xls: 'excel', xlsx: 'excel',
      sqlite: 'sqlite', sqlite3: 'sqlite', db: 'sqlite',
      sql: 'sql',
      dbf: 'dbf',
    };
    return map[ext || ''] || null;
  };

  const handleFile = (f: File) => {
    setFile(f);
    setDetectedFormat(detectFormat(f.name));
    setState('idle');
    setError('');
    setResultUrl(null);
    setStats(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleConvert = async () => {
    if (!file) return;

    setState('uploading');
    setError('');
    setResultUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/convert?outputFormat=${target}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(data.detail || `Error ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get('Content-Disposition');
      const nameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const name = nameMatch?.[1] || `converted_to_${target}.zip`;

      setResultUrl(url);
      setResultName(name);
      setStats({
        tables: res.headers.get('X-Tables-Count') || '?',
        rows: res.headers.get('X-Total-Rows') || '?',
        warnings: res.headers.get('X-Warnings-Count') || '0',
      });
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setState('error');
    }
  };

  const reset = () => {
    setFile(null);
    setDetectedFormat(null);
    setState('idle');
    setError('');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setStats(null);
  };

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Free Online Converter
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Database File Converter
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Convert between CSV, Excel, SQLite, SQL dumps, and DBF files.
            Upload your file, pick a target format, download the result. No registration required.
          </p>
        </div>

        {/* Converter Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8">

          {/* Step 1: Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mr-2">1</span>
              Upload your file
            </label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.tsv,.xls,.xlsx,.sqlite,.sqlite3,.db,.sql,.dbf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {fileSizeMB} MB
                      {detectedFormat && (
                        <> &middot; Detected: <span className="text-blue-400">{SOURCE_FORMATS[detectedFormat]?.label || detectedFormat}</span></>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="ml-4 text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-10 h-10 mx-auto text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-400">
                    <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">CSV, Excel, SQLite, SQL, DBF (max 10 MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Step 2: Target Format */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mr-2">2</span>
              Choose target format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TARGET_FORMATS.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setTarget(fmt.value)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    target === fmt.value
                      ? 'bg-blue-600 text-white ring-2 ring-blue-500/50'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={!file || !detectedFormat || state === 'uploading'}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white"
          >
            {state === 'uploading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Converting...
              </span>
            ) : (
              `Convert to ${TARGET_FORMATS.find((f) => f.value === target)?.label || target}`
            )}
          </button>

          {/* Error */}
          {state === 'error' && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Result */}
          {state === 'done' && resultUrl && (
            <div className="mt-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 mb-1">Conversion complete</h3>
                  {stats && (
                    <p className="text-xs text-slate-400">
                      {stats.tables} table{stats.tables !== '1' ? 's' : ''} &middot; {stats.rows} rows
                      {stats.warnings !== '0' && (
                        <span className="text-amber-400"> &middot; {stats.warnings} warning{stats.warnings !== '1' ? 's' : ''}</span>
                      )}
                    </p>
                  )}
                </div>
                <a
                  href={resultUrl}
                  download={resultName}
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download ZIP
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Supported Formats Table */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Supported Formats</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">Source Formats (upload)</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {Object.entries(SOURCE_FORMATS).map(([key, fmt]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="font-medium">{fmt.label}</span>
                    <span className="text-slate-500">{fmt.extensions}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Target Formats (download)</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {TARGET_FORMATS.map((fmt) => (
                  <li key={fmt.value} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-medium">{fmt.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { title: 'No Registration', desc: 'Upload and convert instantly. No account needed.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            { title: 'Schema Analysis', desc: 'We detect types, keys, and warn about compatibility issues.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { title: 'Free Up to 10 MB', desc: 'Small files convert for free. No limits on format types.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <svg className="w-6 h-6 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
