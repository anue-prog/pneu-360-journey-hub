import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WaitTime {
  id: string;
  location: string;
  wait_minutes: number;
  updated_at: string;
}

// Öffnungszeiten: Mo-Fr 07:30-18:00, Sa 08:00-16:00, So geschlossen
function isOpen(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=So, 6=Sa
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;

  if (day === 0) return false; // Sonntag
  if (day === 6) return time >= 480 && time < 960; // Sa 08:00-16:00
  return time >= 450 && time < 1080; // Mo-Fr 07:30-18:00
}

function minutesAgo(dateStr: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
}

export function useWaitTimes() {
  const [waitTimes, setWaitTimes] = useState<WaitTime[]>([]);
  const [loading, setLoading] = useState(true);
  const open = isOpen();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("wait_times")
        .select("*")
        .order("location");
      if (data) setWaitTimes(data);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel("wait_times_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wait_times" },
        (payload) => {
          const updated = payload.new as WaitTime;
          setWaitTimes((prev) =>
            prev.map((wt) => (wt.id === updated.id ? updated : wt))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { waitTimes, loading, isOpen: open, minutesAgo };
}
