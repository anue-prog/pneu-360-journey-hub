import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOCATION_QUERIES = [
  "Pneu 360 Oftringen Perry Center",
  "Pneu 360 Langenthal Meilenstein",
];

// In-memory cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

let placeIdCache: { ids: string[]; timestamp: number } | null = null;
const PLACE_ID_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: { text: string; languageCode: string };
  originalText?: { text: string; languageCode: string };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
}

async function searchPlaceId(query: string, apiKey: string): Promise<string | null> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName",
    },
    body: JSON.stringify({ textQuery: query }),
  });

  if (!response.ok) {
    console.error(`Text Search error for "${query}": ${response.status}`);
    return null;
  }

  const data = await response.json();
  return data.places?.[0]?.id || null;
}

async function getPlaceIds(apiKey: string): Promise<string[]> {
  if (placeIdCache && Date.now() - placeIdCache.timestamp < PLACE_ID_CACHE_TTL) {
    return placeIdCache.ids;
  }

  const ids: string[] = [];
  for (const query of LOCATION_QUERIES) {
    const id = await searchPlaceId(query, apiKey);
    if (id) ids.push(id);
  }

  if (ids.length > 0) {
    placeIdCache = { ids, timestamp: Date.now() };
  }
  return ids;
}

async function fetchPlaceReviews(placeId: string, apiKey: string) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews,rating,userRatingCount,displayName,googleMapsUri",
    },
  });

  if (!response.ok) {
    console.error(`Place Details error for ${placeId}: ${response.status}`);
    return null;
  }
  return await response.json();
}

async function fetchCuratedReviews(): Promise<any[]> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data, error } = await supabase
      .from("curated_reviews")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching curated reviews:", error);
      return [];
    }

    return (data || []).map((r: any) => ({
      name: r.name,
      text: r.text,
      rating: r.rating,
      time: "",
      photoUri: r.photo_url || "",
      location: r.location || "",
      curated: true,
    }));
  } catch (err) {
    console.error("Curated reviews fetch failed:", err);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY not configured");
    }

    // Fetch curated reviews and Google reviews in parallel
    const [curatedReviews, placeIds] = await Promise.all([
      fetchCuratedReviews(),
      getPlaceIds(apiKey),
    ]);

    // Fetch Google reviews
    const googleReviews: any[] = [];
    let weightedRatingSum = 0;
    let totalReviewCount = 0;
    let placeName = "Pneu 360";
    let googleMapsUri = "";

    for (const placeId of placeIds) {
      const placeData = await fetchPlaceReviews(placeId, apiKey);
      if (!placeData) continue;

      const locationCount = placeData.userRatingCount || 0;
      if (placeData.rating && locationCount > 0) {
        weightedRatingSum += placeData.rating * locationCount;
      }
      if (placeName === "Pneu 360") {
        placeName = placeData.displayName?.text || placeName;
      }
      if (!googleMapsUri && placeData.googleMapsUri) {
        googleMapsUri = placeData.googleMapsUri;
      }
      totalReviewCount += locationCount;

      // Only 5-star Google reviews
      const reviews = (placeData.reviews || [])
        .filter((r: GoogleReview) => r.rating === 5)
        .map((r: GoogleReview) => ({
          name: r.authorAttribution?.displayName || "Anonym",
          text: r.originalText?.text || r.text?.text || "",
          rating: r.rating,
          time: r.relativePublishTimeDescription || "",
          photoUri: r.authorAttribution?.photoUri || "",
          curated: false,
        }));

      googleReviews.push(...reviews);
    }

    // Deduplicate Google reviews
    const seen = new Set<string>();
    const uniqueGoogle = googleReviews.filter((r) => {
      const key = `${r.name}::${r.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Merge: curated first (sorted by sort_order), then Google reviews
    const allReviews = [...curatedReviews, ...uniqueGoogle];

    const result = {
      rating: totalReviewCount > 0 ? Math.round((weightedRatingSum / totalReviewCount) * 10) / 10 : 4.9,
      totalReviews: totalReviewCount || 120,
      placeName,
      googleMapsUri,
      reviews: allReviews,
    };

    cache = { data: result, timestamp: Date.now() };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
