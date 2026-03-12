import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface AgentReviewProps {
  review: Review;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-yellow-500 text-yellow-500"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export const AgentReview = ({ review }: AgentReviewProps) => {
  const initials = review.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar size="default">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium truncate">
              {review.userName}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <StarRating rating={review.rating} />
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};
