import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { legacyProductTarget } from '../lib/legacyProductRedirects';

export default function ProductStoreRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const target = legacyProductTarget(slug);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <Helmet>
      <link rel="canonical" href={target} />
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
  );
}