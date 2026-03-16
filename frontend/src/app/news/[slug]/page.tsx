import ArticlePage from './client';

export async function generateStaticParams() {
  return [{ slug: '_' }];
}

export default function Page() {
  return <ArticlePage />;
}
