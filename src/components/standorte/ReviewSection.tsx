import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { Star, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CTAButton from "@/components/shared/CTAButton";

const ReviewSection = () => {
  const { data, loading } = useGoogleReviews();

  // Filter reviews with text first, then sort by rating + text length
  const sortedReviews = [...data.reviews]
    .filter((r) => r.text && r.text.length > 0)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.text?.length || 0) - (a.text?.length || 0);
    })
    .slice(0, 6);

  return (
    <div className="mt-16 md:mt-24">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-extrabold text-brand-accent">
          {data.rating.toFixed(1)}
        </span>
        <div>
          <div className="flex gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(data.rating)
                    ? "text-brand-accent fill-brand-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {data.totalReviews}+ Bewertungen auf Google
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(loading ? Array(3).fill(null) : sortedReviews).map(
          (review, i) =>
            loading ? (
              <div
                key={i}
                className="bg-card border border-border/40 p-6 md:p-8 animate-pulse"
              >
                <div className="h-16 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            ) : (
              <blockquote
                key={i}
                className="bg-card border border-border/40 p-6 md:p-8"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-3 h-3 ${
                        j < review.rating
                          ? "text-brand-accent fill-brand-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm leading-[1.8] text-foreground/80 font-light mb-4 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {review.photoUri && (
                      <AvatarImage src={review.photoUri} alt={review.name} />
                    )}
                    <AvatarFallback className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent">
                      {review.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center justify-between">
                    <cite className="text-xs font-bold tracking-[1px] text-brand-accent not-italic">
                      {review.name}
                    </cite>
                    {review.time && (
                      <span className="text-[10px] text-muted-foreground">
                        {review.time}
                      </span>
                    )}
                  </div>
                </div>
              </blockquote>
            )
        )}
      </div>

      {data.googleMapsUri && (
        <div className="mt-8 flex justify-center">
          <CTAButton href={data.googleMapsUri} variant="outline">
            <Star className="w-4 h-4" />
            Jetzt auf Google bewerten
            <ExternalLink className="w-3 h-3" />
          </CTAButton>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
