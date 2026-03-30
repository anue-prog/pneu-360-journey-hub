import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIRE_WIDTHS = [
  "125","135","145","155","165","175","185","195","205","215",
  "225","235","245","255","265","275","285","295","305","315","325","335","345","355",
];
const TIRE_HEIGHTS = ["25","30","35","40","45","50","55","60","65","70","75","80","85"];
const TIRE_INCHES = ["12","13","14","15","16","17","18","19","20","21","22","23","24"];

const TIRE_EXTRACT_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_tire_data",
    description: "Extract tire size information from a photo of a tire sidewall.",
    parameters: {
      type: "object",
      properties: {
        width: { type: "string", description: "Tire width in mm, e.g. '225'" },
        height: { type: "string", description: "Tire aspect ratio / height in %, e.g. '45'" },
        inch: { type: "string", description: "Rim diameter in inches, e.g. '18'" },
        brand: { type: "string", description: "Tire brand if visible, e.g. 'CONTINENTAL'. Empty string if not readable." },
        confidence: { type: "string", enum: ["high", "medium", "low"], description: "How confident are you in the reading" },
      },
      required: ["width", "height", "inch", "confidence"],
      additionalProperties: false,
    },
  },
};

const VEHICLE_DOC_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_vehicle_data",
    description: "Extract vehicle data from a Swiss Fahrzeugausweis (vehicle registration document).",
    parameters: {
      type: "object",
      properties: {
        brand: { type: "string", description: "Vehicle brand/make from field 2, e.g. 'VW', 'BMW', 'MERCEDES-BENZ'" },
        model: { type: "string", description: "Vehicle model/type from field 3, e.g. 'Golf', 'X5'" },
        year: { type: "string", description: "Year of first registration from field 32, e.g. '2021'" },
        color: { type: "string", description: "Vehicle color from field 26, e.g. 'SCHWARZ', 'WEISS', 'SILBER'" },
        typengenehmigung: { type: "string", description: "Type approval number from field 24. Could be a code like '1VD123', the letter 'X', or start with 'IVI'." },
        stammnummer: { type: "string", description: "Stammnummer from field 18. Only extract if typengenehmigung starts with 'IVI'. Otherwise empty string." },
        confidence: { type: "string", enum: ["high", "medium", "low"], description: "Overall confidence in the extraction" },
      },
      required: ["brand", "model", "year", "color", "typengenehmigung", "stammnummer", "confidence"],
      additionalProperties: false,
    },
  },
};

function closestMatch(value: string, list: string[]): string | null {
  const v = value.trim();
  if (list.includes(v)) return v;
  // Try numeric matching for tire sizes
  const num = parseInt(v, 10);
  if (!isNaN(num)) {
    const closest = list.reduce((best, item) => {
      const itemNum = parseInt(item, 10);
      if (isNaN(itemNum)) return best;
      return Math.abs(itemNum - num) < Math.abs(parseInt(best, 10) - num) ? item : best;
    }, list[0]);
    if (Math.abs(parseInt(closest, 10) - num) <= 10) return closest;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { type, images } = await req.json();
    // type: "tire" | "vehicle-doc"
    // images: string[] (base64 encoded images)

    if (!type || !images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "Missing type or images" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "tire") {
      const results = [];
      for (const img of images) {
        const imageContent = img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
        
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `Du bist ein Experte für Reifengrössen. Du analysierst Fotos von Reifenflanken und extrahierst die Reifengrösse.
Die Reifengrösse steht auf der Seitenwand des Reifens im Format: BREITE/HÖHE RZOLL (z.B. 225/45 R18).
- Breite: 3-stellige Zahl in mm (z.B. 225)
- Höhe: 2-stellige Zahl als Prozentwert (z.B. 45)  
- Zoll: 2-stellige Zahl nach dem R (z.B. 18)
Falls du auch die Reifenmarke erkennen kannst (z.B. CONTINENTAL, MICHELIN, PIRELLI etc.), gib diese ebenfalls an.
Achte besonders auf die DOT-Nummer und die grösste, deutlichste Zahlenfolge auf der Flanke.`,
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Bitte lies die Reifengrösse von diesem Foto ab. Extrahiere Breite, Höhe und Zoll sowie die Marke falls sichtbar." },
                  { type: "image_url", image_url: { url: imageContent } },
                ],
              },
            ],
            tools: [TIRE_EXTRACT_TOOL],
            tool_choice: { type: "function", function: { name: "extract_tire_data" } },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("AI gateway error for tire:", response.status, errText);
          if (response.status === 429) {
            return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." }), {
              status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ error: "AI-Guthaben aufgebraucht." }), {
              status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          results.push({ error: "Konnte Reifen nicht erkennen" });
          continue;
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          const parsed = JSON.parse(toolCall.function.arguments);
          // Validate against known values
          const width = closestMatch(parsed.width, TIRE_WIDTHS);
          const height = closestMatch(parsed.height, TIRE_HEIGHTS);
          const inch = closestMatch(parsed.inch, TIRE_INCHES);
          results.push({
            width: width || parsed.width,
            height: height || parsed.height,
            inch: inch || parsed.inch,
            brand: (parsed.brand || "").toUpperCase(),
            confidence: parsed.confidence || "medium",
            validated: !!(width && height && inch),
          });
        } else {
          results.push({ error: "Konnte Reifengrösse nicht ablesen" });
        }
      }

      return new Response(JSON.stringify({ type: "tire", results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "vehicle-doc") {
      const img = images[0];
      const imageContent = img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Du bist ein Experte für Schweizer Fahrzeugausweise. Du analysierst Fotos von Schweizer Fahrzeugausweisen und extrahierst die relevanten Daten.

Der Schweizer Fahrzeugausweis enthält folgende relevante Felder:
- Feld 2: Fahrzeugmarke (z.B. VW, BMW, MERCEDES-BENZ, AUDI)
- Feld 3: Fahrzeugtyp/Modell (z.B. Golf, 3er, A-Klasse)
- Feld 18: Stammnummer (wichtig bei IVI-Typengenehmigung)
- Feld 24: Typengenehmigung - kann sein:
  - Ein normaler Code wie "1VD 123" oder "1AB234"
  - Der Buchstabe "X" (bedeutet: keine CH-Typengenehmigung, COC-Dokument nötig)
  - Beginnt mit "IVI" (bedeutet: Einzelimport, Stammnummer aus Feld 18 extrahieren)
- Feld 26: Fahrzeugfarbe (z.B. SCHWARZ, WEISS, SILBER, BLAU, ROT, GRAU)
- Feld 32: Datum der Erstinverkehrsetzung (daraus das Jahr extrahieren)

WICHTIG:
- Gib die Marke in GROSSBUCHSTABEN zurück
- Gib die Farbe in GROSSBUCHSTABEN auf DEUTSCH zurück
- Bei der Typengenehmigung: genau lesen ob es "X", "IVI..." oder ein normaler Code ist
- Bei IVI: unbedingt die Stammnummer aus Feld 18 extrahieren
- Nur das JAHR aus dem Datum extrahieren (z.B. "2021" aus "15.03.2021")`,
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Bitte extrahiere alle relevanten Fahrzeugdaten aus diesem Schweizer Fahrzeugausweis." },
                { type: "image_url", image_url: { url: imageContent } },
              ],
            },
          ],
          tools: [VEHICLE_DOC_TOOL],
          tool_choice: { type: "function", function: { name: "extract_vehicle_data" } },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("AI gateway error for vehicle-doc:", response.status, errText);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI-Guthaben aufgebraucht." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Fahrzeugausweis konnte nicht gelesen werden" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        const typenUpper = (parsed.typengenehmigung || "").toUpperCase().trim();
        const needsCOC = /^X$/.test(typenUpper);
        const isIVI = typenUpper.startsWith("IVI");

        return new Response(JSON.stringify({
          type: "vehicle-doc",
          result: {
            brand: (parsed.brand || "").toUpperCase(),
            model: parsed.model || "",
            year: parsed.year || "",
            color: (parsed.color || "").toUpperCase(),
            typengenehmigung: parsed.typengenehmigung || "",
            stammnummer: isIVI ? (parsed.stammnummer || "") : "",
            needsCOC,
            isIVI,
            confidence: parsed.confidence || "medium",
          },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Daten konnten nicht extrahiert werden" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-image-reader error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
