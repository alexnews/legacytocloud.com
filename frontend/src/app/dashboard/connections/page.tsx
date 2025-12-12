'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { connections, Connection, ConnectionCreate } from '@/lib/api';

export default function ConnectionsPage() {
  const [connectionList, setConnectionList] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await connections.list();
      setConnectionList(response.connections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const result = await connections.testSaved(id);
      alert(result.success ? 'Connection successful!' : `Connection failed: ${result.message}`);
      loadConnections();
    } catch (error) {
      alert('Test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this connection?')) return;
    try {
      await connections.delete(id);
      loadConnections();
    } catch (error) {
      alert('Delete failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getDbIcon = (type: string) => {
    const icons: Record<string, string> = {
      mssql: '🪟',
      mysql: '🐬',
      postgres: '🐘',
      snowflake: '❄️',
    };
    return icons[type] || '🗄️';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Connections</h1>
          <p className="text-gray-600">Manage your source and target database connections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Add Connection
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading connections...</div>
      ) : connectionList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-5xl mb-4">🗄️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
          <p className="text-gray-500 mb-4">Add a database connection to get started.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Add Connection
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Database
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {connectionList.map((conn) => (
                <tr key={conn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getDbIcon(conn.db_type)}</span>
                      <span className="font-medium text-gray-900">{conn.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                    {conn.db_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {conn.host}:{conn.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {conn.database}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {conn.is_tested ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Tested
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Not tested
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleTest(conn.id)}
                      disabled={testingId === conn.id}
                      className="text-primary-600 hover:text-primary-800 mr-4"
                    >
                      {testingId === conn.id ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleDelete(conn.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateConnectionModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            loadConnections();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function CreateConnectionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState<ConnectionCreate>({
    name: '',
    db_type: 'mssql',
    host: 'localhost',
    port: 1433,
    database: '',
    username: '',
    password: '',
    ssl_enabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (field: keyof ConnectionCreate, value: string | number | boolean) => {
    setTestResult(null);

    // Auto-update port when db_type changes
    if (field === 'db_type') {
      const ports: Record<string, number> = { mssql: 1433, mysql: 3306, postgres: 5432, snowflake: 443 };
      const dbType = value as ConnectionCreate['db_type'];
      setFormData((prev) => ({ ...prev, db_type: dbType, port: ports[dbType] || 1433 }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await connections.test(formData);
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await connections.create(formData);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Database Connection</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="My Database"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database Type
              </label>
              <select
                value={formData.db_type}
                onChange={(e) => handleChange('db_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="mssql">MSSQL (SQL Server)</option>
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                <option value="snowflake">Snowflake</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <input
                  type="text"
                  required
                  value={formData.host}
                  onChange={(e) => handleChange('host', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input
                  type="number"
                  required
                  value={formData.port}
                  onChange={(e) => handleChange('port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
              <input
                type="text"
                required
                value={formData.database}
                onChange={(e) => handleChange('database', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ssl"
                checked={formData.ssl_enabled}
                onChange={(e) => handleChange('ssl_enabled', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="ssl" className="ml-2 text-sm text-gray-700">
                Use SSL
              </label>
            </div>

            {testResult && (
              <div
                className={`px-4 py-3 rounded-lg text-sm ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {testResult.success ? '✓ ' : '✗ '}
                {testResult.message}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Connection'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
