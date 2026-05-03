/**
 * Proxy webhook requests to MCS backend
 * Forwards to ag-nc.co (publicly accessible via Cloudflare tunnel)
 */
export async function onRequestPost(context) {
  try {
    const request = context.request;
    const body = await request.json();
    
    // Forward to MCS backend public webhook endpoint
    // ag-nc.co is accessible from the public internet
    const response = await fetch('https://ag-nc.co/api/v1/webhooks/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Webhook proxy failed', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
