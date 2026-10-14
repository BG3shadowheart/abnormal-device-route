
const PC_SITE = "https://abnormal-shop.vercel.app";
const PHONE_SITE = "https://abnormal-store.vercel.app";

export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  // Route only the homepage.
  if (url.pathname !== "/") {
    return new Response("Not found", { status: 404 });
  }

  // Manual version selection for testing or switching.
  const view = url.searchParams.get("view");

  let destination;

  if (view === "desktop") {
    destination = PC_SITE;
  } else if (view === "mobile") {
    destination = PHONE_SITE;
  } else {
    const ua = request.headers.get("user-agent") || "";

    const isMobile =
      /Android|iPhone|iPod|Mobile|Windows Phone|IEMobile/i.test(ua);

    destination = isMobile ? PHONE_SITE : PC_SITE;
  }

  // Preserve query parameters, except the routing override.
  const target = new URL(destination);
  for (const [key, value] of url.searchParams) {
    if (key !== "view") {
      target.searchParams.append(key, value);
    }
  }

  return Response.redirect(target.toString(), 307);
}
