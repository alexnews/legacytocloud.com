import ProjectsClient from './client';

// For static export - returns empty params for catch-all route
// This allows client-side routing for all /dashboard/projects/* paths
export async function generateStaticParams() {
  return [{ slug: [] }];
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}
