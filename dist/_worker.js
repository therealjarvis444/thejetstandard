export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle /api/webhooks/subscribe
    if (url.pathname === '/api/webhooks/subscribe') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        const body = await request.json();
        const response = await fetch('https://mcs-jetstandard.loca.lt/api/v1/webhooks/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(body),
        });
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    
    // Redirect old main.v3.js to new JS
    if (url.pathname === '/js/main.v3.js') {
      const newUrl = new URL('/js/main-1777719806.js', url.origin);
      return new Response(null, {
        status: 301,
        headers: {
          'Location': newUrl.toString(),
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }
    
    // For all other requests, serve from ASSETS
    return env.ASSETS.fetch(request);
  }
};
