export default {
  async fetch(request, env) {
    const html = await env.SCAN.get("index.html");
    if (!html) return new Response("not found", { status: 404 });
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};
