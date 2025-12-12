'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { projects, Project } from '@/lib/api';

export default function DashboardPage() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projects.list();
      setProjectList(response.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMigrationLabel = (type: string) => {
    const labels: Record<string, string> = {
      mssql_to_snowflake: 'MSSQL → Snowflake',
      mysql_to_snowflake: 'MySQL → Snowflake',
      postgres_to_snowflake: 'PostgreSQL → Snowflake',
      mysql_to_postgres: 'MySQL → PostgreSQL (legacy)',
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

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your database migration projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      ) : projectList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-5xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first migration project to get started.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {getMigrationLabel(project.migration_type)}
              </p>
              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              )}
              <p className="text-xs text-gray-400">
                Created {new Date(project.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            loadProjects();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function CreateProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [migrationType, setMigrationType] = useState('mssql_to_snowflake');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await projects.create({
        name,
        description: description || undefined,
        migration_type: migrationType,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="My Migration Project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Migration Type
              </label>
              <select
                value={migrationType}
                onChange={(e) => setMigrationType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="mssql_to_snowflake">MSSQL → Snowflake</option>
                <option value="mysql_to_snowflake">MySQL → Snowflake</option>
                <option value="postgres_to_snowflake">PostgreSQL → Snowflake</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description of your migration project"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
