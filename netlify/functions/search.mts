export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: { query?: string };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim();

  if (!query) {
    return Response.json({ error: "প্রশ্ন লিখুন।" }, { status: 400 });
  }

  if (query.length > 700) {
    return Response.json({ error: "প্রশ্নটি ৭০০ অক্ষরের মধ্যে রাখুন।" }, { status: 400 });
  }

  const gatewayBaseUrl = process.env.NETLIFY_AI_GATEWAY_BASE_URL;
  const gatewayKey = process.env.NETLIFY_AI_GATEWAY_KEY;

  if (!gatewayBaseUrl || !gatewayKey) {
    return Response.json(
      { error: "AI Gateway কনফিগার করা নেই। Netlify deploy-তে আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }

  const aiResponse = await fetch(`${gatewayBaseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gatewayKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      messages: [
        {
          role: "system",
          content:
            "You are KhojAI, a Bengali AI search assistant. Answer in Bengali. Do not claim to browse the live web. If the query needs current facts, say what should be verified and suggest reliable source types. Return only valid JSON matching this shape: {\"title\":\"short title\",\"answer\":\"clear answer\",\"keyPoints\":[\"point\"],\"followUps\":[\"question\"],\"verify\":[\"source or check\"]}.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!aiResponse.ok) {
    return Response.json({ error: "AI সার্ভিস এখন উত্তর দিতে পারছে না।" }, { status: 502 });
  }

  const payload = await aiResponse.json();
  const text = payload.choices?.[0]?.message?.content;

  try {
    return Response.json(normalizeResult(JSON.parse(text)));
  } catch {
    return Response.json({
      title: "সার্চ ফলাফল",
      answer: typeof text === "string" ? text : "উত্তর তৈরি হয়েছে, কিন্তু ফরম্যাট পড়া যায়নি।",
      keyPoints: [],
      followUps: ["আরও নির্দিষ্ট করে কী জানতে চান?"],
      verify: ["সময়সংবেদনশীল তথ্য হলে অফিসিয়াল বা সাম্প্রতিক উৎসে যাচাই করুন।"],
    });
  }
};

export const config = {
  path: "/api/search",
};

function normalizeResult(result: Record<string, unknown>) {
  return {
    title: asText(result.title, "সার্চ ফলাফল").slice(0, 90),
    answer: asText(result.answer, "উত্তর পাওয়া যায়নি।"),
    keyPoints: asList(result.keyPoints).slice(0, 5),
    followUps: asList(result.followUps).slice(0, 4),
    verify: asList(result.verify).slice(0, 4),
  };
}

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim()).map((item) => item.trim());
}
