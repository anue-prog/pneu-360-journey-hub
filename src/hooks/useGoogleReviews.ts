import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { reviews as fallbackReviews, siteConfig } from "@/data/siteData";

export interface GoogleReview {
  name: string;
  text: string;
  rating: number;
  time: string;
  photoUri: string;
}

export interface GoogleReviewsData {
  rating: number;
  totalReviews: number;
  placeName: string;
  googleMapsUri: string;
  reviews: GoogleReview[];
}

const FALLBACK_DATA: GoogleReviewsData = {
  rating: parseFloat(siteConfig.reviewScore),
  totalReviews: parseInt(siteConfig.reviewCount),
  placeName: siteConfig.firmaName,
  googleMapsUri: "",
  reviews: fallbackReviews.map((r) => ({
    name: r.name,
    text: r.text,
    rating: 5,
    time: "",
    photoUri: "",
  })),
};

export function useGoogleReviews() {
  const [data, setData] = useState<GoogleReviewsData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("google-reviews");
        if (error) throw error;
        if (result && result.reviews?.length > 0) {
          setData(result);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Using fallback reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { data, loading, isLive };
}
