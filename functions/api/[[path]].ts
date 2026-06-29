/**
 * Cloudflare Pages Function — API Proxy
 *
 * Forwards all /api/* requests from Cloudflare Pages to the Express backend on Render.
 * This eliminates CORS issues and makes auth cookies work seamlessly
 * (browser sees requests as same-origin since Pages + Function share the domain).
 */

export async function onRequest(context: EventContext<unknown, string, unknown>) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Render backend URL — set this in Cloudflare Pages environment variables
  const renderUrl = (env as Record<string, string>).RENDER_API_URL;

  if (!renderUrl) {
    return new Response(
      JSON.stringify({
        error: "RENDER_API_URL not configured. Set it in Cloudflare Pages dashboard → Settings → Environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const targetUrl = renderUrl + url.pathname + url.search;

  // Build the proxy request — forward method, headers, and body
  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    redirect: "follow",
  });

  try {
    const response = await fetch(proxyRequest);

    // Rebuild response, stripping hop-by-hop headers Cloudflare handles
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("transfer-encoding");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Backend unreachable. Make sure your Render service is running.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
