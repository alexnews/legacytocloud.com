'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  projects,
  connections,
  analysis,
  Project,
  Connection,
  Analysis,
  AnalysisResult,
  Table,
  Risk,
} from '@/lib/api';

export default function ProjectsClient() {
  const pathname = usePathname();

  // Parse the path to determine which view to render
  // /dashboard/projects/ -> list (but we redirect to /dashboard)
  // /dashboard/projects/[id] -> project detail
  // /dashboard/projects/[id]/analysis/[analysisId] -> analysis detail

  const parts = pathname.split('/').filter(Boolean);
  // parts: ['dashboard', 'projects', ...rest]

  const projectId = parts[2] || null;
  const isAnalysis = parts[3] === 'analysis';
  const analysisId = isAnalysis ? parts[4] : null;

  if (!projectId) {
    // No project ID - redirect to dashboard
    return <RedirectToDashboard />;
  }

  if (isAnalysis && analysisId) {
    return <AnalysisDetailView projectId={projectId} analysisId={analysisId} />;
  }

  return <ProjectDetailView projectId={projectId} />;
}

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return (
    <DashboardLayout>
      <div className="text-center py-12 text-gray-500">Redirecting...</div>
    </DashboardLayout>
  );
}

// ============================================
// Project Detail View
// ============================================

function ProjectDetailView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [connectionList, setConnectionList] = useState<Connection[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState('');
  const [quickAnalysisResult, setQuickAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisMethod, setAnalysisMethod] = useState<'connect' | 'upload'>('connect');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [projectData, connectionsData, analysesData] = await Promise.all([
        projects.get(projectId),
        connections.list(),
        analysis.listForProject(projectId),
      ]);
      setProject(projectData);
      setConnectionList(connectionsData.connections);
      setAnalyses(analysesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSetSource = async (connectionId: string) => {
    try {
      await projects.update(projectId, { source_connection_id: connectionId });
      loadData();
    } catch (err) {
      alert('Failed to set source connection');
    }
  };

  const handleSetTarget = async (connectionId: string) => {
    try {
      await projects.update(projectId, { target_connection_id: connectionId });
      loadData();
    } catch (err) {
      alert('Failed to set target connection');
    }
  };

  const handleQuickAnalysis = async () => {
    if (!selectedConnection) {
      alert('Please select a connection to analyze');
      return;
    }
    setAnalyzing(true);
    setQuickAnalysisResult(null);
    try {
      const result = await analysis.quick(selectedConnection);
      setQuickAnalysisResult(result);
    } catch (err) {
      alert('Analysis failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadError('Please select a .sql file to upload');
      return;
    }
    setAnalyzing(true);
    setQuickAnalysisResult(null);
    setUploadError('');
    try {
      const result = await analysis.upload(uploadFile);
      setQuickAnalysisResult(result);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.sql')) {
        setUploadError('Only .sql files are supported');
        setUploadFile(null);
        return;
      }
      setUploadFile(file);
      setUploadError('');
    }
  };

  const handleRunAnalysis = async () => {
    if (!project?.source_connection_id) {
      alert('Please set a source connection first');
      return;
    }
    setAnalyzing(true);
    try {
      await analysis.run(projectId, project.source_connection_id);
      loadData();
    } catch (err) {
      alert('Analysis failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projects.delete(projectId);
      router.push('/dashboard');
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getMigrationLabel = (type: string) => {
    const labels: Record<string, string> = {
      mssql_to_snowflake: 'MSSQL -> Snowflake',
      mysql_to_snowflake: 'MySQL -> Snowflake',
      postgres_to_snowflake: 'PostgreSQL -> Snowflake',
      mysql_to_postgres: 'MySQL -> PostgreSQL (legacy)',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      created: 'bg-gray-100 text-gray-800',
      analyzing: 'bg-blue-100 text-blue-800',
      analyzed: 'bg-green-100 text-green-800',
      planning: 'bg-yellow-100 text-yellow-800',
      planned: 'bg-green-100 text-green-800',
      migrating: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceType = () => {
    if (!project) return 'mysql';
    const parts = project.migration_type.split('_to_');
    return parts[0];
  };

  const getTargetType = () => {
    if (!project) return 'postgres';
    const parts = project.migration_type.split('_to_');
    return parts[1];
  };

  const getConnectionName = (id: string | null) => {
    if (!id) return 'Not set';
    const conn = connectionList.find((c) => c.id === id);
    return conn ? conn.name : 'Unknown';
  };

  const filteredSourceConnections = connectionList.filter((c) => c.db_type === getSourceType());
  const filteredTargetConnections = connectionList.filter((c) => c.db_type === getTargetType());

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading project...</div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error || 'Project not found'}</div>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              Projects
            </Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600">{getMigrationLabel(project.migration_type)}</p>
          {project.description && <p className="text-gray-500 mt-2">{project.description}</p>}
        </div>
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm">
          Delete Project
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Source Connection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Source Connection ({getSourceType().toUpperCase()})
          </h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current:</p>
            <p className="font-medium">{getConnectionName(project.source_connection_id)}</p>
          </div>
          {filteredSourceConnections.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select source</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={project.source_connection_id || ''}
                onChange={(e) => handleSetSource(e.target.value)}
              >
                <option value="">-- Select --</option>
                {filteredSourceConnections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.host})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No {getSourceType()} connections available.{' '}
              <Link href="/dashboard/connections" className="text-primary-600 hover:text-primary-800">
                Add one
              </Link>
            </p>
          )}
        </div>

        {/* Target Connection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Target Connection ({getTargetType().toUpperCase()})
          </h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current:</p>
            <p className="font-medium">{getConnectionName(project.target_connection_id)}</p>
          </div>
          {filteredTargetConnections.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select target</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={project.target_connection_id || ''}
                onChange={(e) => handleSetTarget(e.target.value)}
              >
                <option value="">-- Select --</option>
                {filteredTargetConnections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.host})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No {getTargetType()} connections available.{' '}
              <Link href="/dashboard/connections" className="text-primary-600 hover:text-primary-800">
                Add one
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Schema Analysis Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Schema Analysis</h2>
        </div>

        {/* Analysis Method Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setAnalysisMethod('connect')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  analysisMethod === 'connect'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Connect to Database
              </button>
              <button
                onClick={() => setAnalysisMethod('upload')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  analysisMethod === 'upload'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Schema File
              </button>
            </nav>
          </div>
        </div>

        {/* Connect to Database Option */}
        {analysisMethod === 'connect' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Analysis Tool</h3>
            <div className="flex gap-3">
              <select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a connection to analyze</option>
                {connectionList.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.db_type})
                  </option>
                ))}
              </select>
              <button
                onClick={handleQuickAnalysis}
                disabled={analyzing || !selectedConnection}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Quick Analyze'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Don't have a connection? <Link href="/dashboard/connections" className="text-primary-600 hover:underline">Add one here</Link>
            </p>
          </div>
        )}

        {/* Upload Schema File Option */}
        {analysisMethod === 'upload' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Schema File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a .sql file containing CREATE TABLE statements. No database connection required.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block">
                  <span className="sr-only">Choose SQL file</span>
                  <input
                    type="file"
                    accept=".sql"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100
                      cursor-pointer"
                  />
                </label>
                {uploadFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
              </div>
              <button
                onClick={handleFileUpload}
                disabled={analyzing || !uploadFile}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Schema File'}
              </button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>How to export your schema:</strong><br />
                MySQL: <code className="bg-blue-100 px-1 rounded">mysqldump --no-data mydb {'>'} schema.sql</code><br />
                MariaDB: <code className="bg-blue-100 px-1 rounded">mysqldump --no-data mydb {'>'} schema.sql</code>
              </p>
            </div>
          </div>
        )}

        {quickAnalysisResult && <QuickAnalysisView result={quickAnalysisResult} />}

        {analyses.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Analysis History</h3>
            <div className="space-y-2">
              {analyses.map((a) => (
                <Link
                  key={a.id}
                  href={`/dashboard/projects/${projectId}/analysis/${a.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          a.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : a.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {a.status}
                      </span>
                      <span className="ml-3 text-sm text-gray-600">
                        {a.tables_count} tables, {a.total_rows.toLocaleString()} rows
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {analyses.length === 0 && !quickAnalysisResult && (
          <p className="text-center text-gray-500 py-8">
            No analysis results yet. Set a source connection and run analysis.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

function QuickAnalysisView({ result }: { result: AnalysisResult }) {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [showDDL, setShowDDL] = useState(false);

  const handleDownloadDDL = () => {
    if (!result.snowflake_ddl) return;
    const blob = new Blob([result.snowflake_ddl], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snowflake_schema_${result.database || 'export'}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyDDL = async () => {
    if (!result.snowflake_ddl) return;
    await navigator.clipboard.writeText(result.snowflake_ddl);
    alert('DDL copied to clipboard!');
  };

  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        Analysis failed: {result.error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{result.tables_count}</div>
          <div className="text-sm text-blue-600">Tables</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{result.total_rows.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Rows</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{result.risks.length}</div>
          <div className="text-sm text-yellow-600">Issues Found</div>
        </div>
      </div>

      {/* Snowflake DDL Section */}
      {result.snowflake_ddl && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-cyan-900">Snowflake DDL</h4>
            <div className="flex gap-2">
              <button
                onClick={handleCopyDDL}
                className="px-3 py-1 text-sm bg-white border border-cyan-300 rounded hover:bg-cyan-100"
              >
                Copy
              </button>
              <button
                onClick={handleDownloadDDL}
                className="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700"
              >
                Download .sql
              </button>
              <button
                onClick={() => setShowDDL(!showDDL)}
                className="px-3 py-1 text-sm bg-white border border-cyan-300 rounded hover:bg-cyan-100"
              >
                {showDDL ? 'Hide' : 'Preview'}
              </button>
            </div>
          </div>
          {showDDL && (
            <pre className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
              {result.snowflake_ddl}
            </pre>
          )}
        </div>
      )}

      {result.risks.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Migration Risks</h4>
          <div className="space-y-2">
            {result.risks.map((risk, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-lg text-sm ${
                  risk.severity === 'error'
                    ? 'bg-red-50 text-red-700'
                    : risk.severity === 'warning'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <span className="font-medium">{risk.table}</span>
                {risk.column && <span>.{risk.column}</span>}: {risk.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Tables</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {result.tables.map((table) => (
            <div key={table.name} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{table.name}</span>
                  <span className="text-xs text-gray-500">
                    {table.columns.length} cols, {table.row_count.toLocaleString()} rows
                  </span>
                  {!table.has_primary_key && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">No PK</span>
                  )}
                </div>
                <span className="text-gray-400">{expandedTable === table.name ? '-' : '+'}</span>
              </button>
              {expandedTable === table.name && (
                <div className="px-4 pb-4 bg-gray-50">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="py-2">Column</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Nullable</th>
                        <th className="py-2">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((col) => (
                        <tr key={col.name} className="border-t border-gray-200">
                          <td className="py-2 font-mono">{col.name}</td>
                          <td className="py-2 text-gray-600">{col.data_type}</td>
                          <td className="py-2">{col.nullable ? 'Yes' : 'No'}</td>
                          <td className="py-2 text-gray-500">{col.default || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {table.indexes.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs text-gray-500 uppercase mb-2">Indexes</h5>
                      <div className="space-y-1">
                        {table.indexes.map((idx) => (
                          <div key={idx.name} className="text-sm">
                            <span className="font-mono">{idx.name}</span>
                            <span className="text-gray-500 ml-2">
                              ({idx.columns.join(', ')}){idx.unique && ' UNIQUE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Analysis Detail View
// ============================================

function AnalysisDetailView({ projectId, analysisId }: { projectId: string; analysisId: string }) {
  const [analysisData, setAnalysisData] = useState<Analysis | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [riskSummary, setRiskSummary] = useState({ errors: 0, warnings: 0, info: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tables' | 'risks'>('tables');

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    try {
      const [analysisResult, tablesResult, risksResult] = await Promise.all([
        analysis.get(analysisId),
        analysis.getTables(analysisId),
        analysis.getRisks(analysisId),
      ]);
      setAnalysisData(analysisResult);
      setTables(tablesResult.tables);
      setRisks(risksResult.risks);
      setRiskSummary(risksResult.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading analysis...</div>
      </DashboardLayout>
    );
  }

  if (error || !analysisData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error || 'Analysis not found'}</div>
          <Link href={`/dashboard/projects/${projectId}`} className="text-primary-600 hover:text-primary-800">
            Back to Project
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            Projects
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/dashboard/projects/${projectId}`} className="text-gray-400 hover:text-gray-600">
            Project
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-gray-900">Schema Analysis</h1>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              analysisData.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : analysisData.status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {analysisData.status}
          </span>
        </div>
        <p className="text-gray-600">Analyzed on {new Date(analysisData.created_at).toLocaleString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{analysisData.tables_count}</div>
          <div className="text-sm text-gray-500">Tables</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{analysisData.total_rows.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Rows</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{riskSummary.errors}</div>
          <div className="text-sm text-gray-500">Errors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{riskSummary.warnings}</div>
          <div className="text-sm text-gray-500">Warnings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{riskSummary.info}</div>
          <div className="text-sm text-gray-500">Info</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'tables'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tables ({tables.length})
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'risks'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Migration Risks ({risks.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tables' && (
            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table.name} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{table.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{table.type}</span>
                      <span className="text-sm text-gray-500">{table.columns.length} columns</span>
                      <span className="text-sm text-gray-500">{table.row_count.toLocaleString()} rows</span>
                      {!table.has_primary_key && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          No Primary Key
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xl">{expandedTable === table.name ? '-' : '+'}</span>
                  </button>
                  {expandedTable === table.name && (
                    <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                      <table className="min-w-full text-sm mt-4">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 uppercase">
                            <th className="py-2 pr-4">Column Name</th>
                            <th className="py-2 pr-4">Data Type</th>
                            <th className="py-2 pr-4">Nullable</th>
                            <th className="py-2">Default Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col) => (
                            <tr key={col.name} className="border-t border-gray-200">
                              <td className="py-2 pr-4 font-mono text-gray-900">{col.name}</td>
                              <td className="py-2 pr-4 text-gray-600 font-mono text-xs">{col.data_type}</td>
                              <td className="py-2 pr-4">
                                {col.nullable ? (
                                  <span className="text-gray-500">Yes</span>
                                ) : (
                                  <span className="text-gray-900 font-medium">No</span>
                                )}
                              </td>
                              <td className="py-2 text-gray-500 font-mono text-xs">{col.default || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {table.indexes.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-xs text-gray-500 uppercase mb-3 font-medium">Indexes</h4>
                          <div className="space-y-2">
                            {table.indexes.map((idx) => (
                              <div key={idx.name} className="flex items-center gap-2 text-sm">
                                <span className="font-mono text-gray-900">{idx.name}</span>
                                {idx.unique && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">UNIQUE</span>
                                )}
                                <span className="text-gray-500">({idx.columns.join(', ')})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-3">
              {risks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No migration risks detected.</p>
              ) : (
                risks.map((risk, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      risk.severity === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : risk.severity === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          risk.severity === 'error'
                            ? 'bg-red-500'
                            : risk.severity === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {risk.severity === 'error' ? '!' : risk.severity === 'warning' ? '?' : 'i'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {risk.table}
                          {risk.column && <span className="text-gray-500">.{risk.column}</span>}
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            risk.severity === 'error'
                              ? 'text-red-700'
                              : risk.severity === 'warning'
                              ? 'text-yellow-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {risk.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 uppercase">{risk.type}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
