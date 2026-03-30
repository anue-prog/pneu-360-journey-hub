import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { LogOut, Clock, MapPin } from "lucide-react";
import type { WaitTime } from "@/hooks/useWaitTimes";

const locationLabels: Record<string, string> = {
  oftringen: "Oftringen",
  langenthal: "Langenthal",
};

const AdminWartezeit = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [waitTimes, setWaitTimes] = useState<WaitTime[]>([]);
  const [localValues, setLocalValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/admin/login", { replace: true });
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/admin/login", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const { data } = await supabase.from("wait_times").select("*").order("location");
      if (data) {
        setWaitTimes(data);
        const vals: Record<string, number> = {};
        data.forEach((wt) => { vals[wt.location] = wt.wait_minutes; });
        setLocalValues(vals);
      }
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const handleSave = async (location: string) => {
    setSaving((s) => ({ ...s, [location]: true }));
    const { error } = await supabase
      .from("wait_times")
      .update({ wait_minutes: localValues[location], updated_at: new Date().toISOString() })
      .eq("location", location);

    setSaving((s) => ({ ...s, [location]: false }));
    if (error) {
      toast.error("Fehler: " + error.message);
    } else {
      toast.success(`${locationLabels[location]}: ${localValues[location]} Min. gespeichert`);
      // Update local state
      setWaitTimes((prev) =>
        prev.map((wt) =>
          wt.location === location
            ? { ...wt, wait_minutes: localValues[location], updated_at: new Date().toISOString() }
            : wt
        )
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (loading || !session) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-8 pt-24">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Wartezeit</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Abmelden
          </Button>
        </div>

        {waitTimes.map((wt) => {
          const mins = localValues[wt.location] ?? wt.wait_minutes;
          const changed = mins !== wt.wait_minutes;
          const ago = Math.max(0, Math.round((Date.now() - new Date(wt.updated_at).getTime()) / 60000));

          return (
            <Card key={wt.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {locationLabels[wt.location] || wt.location}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Zuletzt aktualisiert: {ago === 0 ? "gerade eben" : `vor ${ago} Min.`}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">{mins}</span>
                  <span className="text-lg text-muted-foreground ml-2">Min.</span>
                </div>

                <Slider
                  value={[mins]}
                  onValueChange={([v]) =>
                    setLocalValues((prev) => ({ ...prev, [wt.location]: v }))
                  }
                  max={60}
                  step={5}
                  className="py-4"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 Min.</span>
                  <span>30 Min.</span>
                  <span>60 Min.</span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleSave(wt.location)}
                  disabled={!changed || saving[wt.location]}
                >
                  {saving[wt.location] ? "Speichern…" : "Speichern"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminWartezeit;
