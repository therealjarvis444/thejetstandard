/**
 * A-Mail Subscriber Proxy for The Jet Standard
 * Receives form submissions from the frontend and forwards to A-Mail API
 */

const A_MAIL_BASE_URL = 'https://ag-nc.co';
const CAMPAIGN_ID = '0a2bfebe-373c-5219-9c6c-b26746f49de7';
const AUTH_CREDS = 'username=archer&password=password123';

async function getAccessToken() {
  const response = await fetch(`${A_MAIL_BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: AUTH_CREDS,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`A-Mail auth failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const body = await request.json();

    // Validate required fields
    const { email, first_name, last_name, phone, extra_data = {} } = body;
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get fresh JWT token from A-Mail
    const accessToken = await getAccessToken();

    // Forward to A-Mail subscribers endpoint
    const payload = {
      email,
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || null,
      extra_data: {
        ...extra_data,
        source: extra_data.source || 'website',
        page_url: extra_data.page_url || '',
        submitted_at: new Date().toISOString(),
      },
    };

    const amResponse = await fetch(`${A_MAIL_BASE_URL}/api/v1/email-campaigns/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Campaign-ID': CAMPAIGN_ID,
      },
      body: JSON.stringify(payload),
    });

    const amData = await amResponse.json();

    if (!amResponse.ok) {
      // Handle "already exists" gracefully
      if (amData.detail === 'Subscriber already exists') {
        return new Response(JSON.stringify({
          success: true,
          message: 'You are already subscribed!',
          data: { email },
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      return new Response(JSON.stringify({
        error: 'A-Mail API error',
        details: amData,
      }), {
        status: amResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription successful!',
      data: amData,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Subscribe function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
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
    },
  });
}
