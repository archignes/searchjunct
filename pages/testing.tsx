import React, { useEffect, useState } from 'react';

const TestingPage = () => {
    const [urlParam, setUrlParam] = useState<string | null>(null);

  useEffect(() => {
    // Extract the 'url' query parameter only if window is defined
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const url = searchParams.get('url')
      setUrlParam(url);
    }
  }, []);

  // Only render the link in development mode and display the URL
  if (process.env.NODE_ENV === 'development' && urlParam) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>URL: {decodeURIComponent(urlParam)}</p>
        <a href={decodeURIComponent(urlParam)} target="_blank" rel="noopener noreferrer">
          Click here to open the link
        </a>
      </div>
    );
  }

  // Render a placeholder or redirect in production
  return (
    <div>
      This page is only available in development mode.
    </div>
  );
};

export default TestingPage;
