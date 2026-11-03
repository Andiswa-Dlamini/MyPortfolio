const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: { message: "Chat service is not configured" } });
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || "");
  } catch {
    return jsonResponse(400, { error: { message: "Invalid request body" } });
  }

  try {
    const url = new URL(GEMINI_ENDPOINT);
    url.searchParams.set("key", apiKey);

    const upstreamResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    return {
      statusCode: upstreamResponse.status,
      headers: { "Content-Type": "application/json" },
      body: await upstreamResponse.text()
    };
  } catch {
    return jsonResponse(502, { error: { message: "Chat service is unavailable" } });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
