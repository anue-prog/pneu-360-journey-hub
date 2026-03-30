import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Phone, Mail } from "lucide-react";
import standortOftringen from "@/assets/standort-oftringen.jpg";
import standortLangenthal from "@/assets/standort-langenthal.jpg";
import type { WaitTime } from "@/hooks/useWaitTimes";

const standortImages = [standortOftringen, standortLangenthal];

interface StandortProps {
  standort: {
    name: string;
    slug: string;
    adresse: string;
    telefon: string;
    email?: string;
    maps: string;
    oeffnungszeiten: string;
    detail: string;
  };
  index: number;
  waitTime?: WaitTime;
  isOpen: boolean;
  minutesAgo: (dateStr: string) => number;
  loading: boolean;
}

const StandortCard = ({ standort, index, waitTime, isOpen, minutesAgo, loading }: StandortProps) => {
  const waitLabel = () => {
    if (loading) return null;
    if (!isOpen) return "Aktuell geschlossen";
    if (!waitTime) return null;
    const mins = waitTime.wait_minutes;
    if (mins === 0) return "Keine Wartezeit";
    return `ca. ${mins} Min. Wartezeit`;
  };

  const label = waitLabel();
  const ago = waitTime ? minutesAgo(waitTime.updated_at) : 0;

  return (
    <div className="group">
      {/* Bild */}
      <Link to={`/standorte/${standort.slug}`} className="block mb-8 overflow-hidden">
        <img
          src={standortImages[index]}
          alt={`Pneu 360 Standort ${standort.name}`}
          className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          loading={index === 0 ? "eager" : "lazy"}
        />
      </Link>

      {/* Name + Wartezeit */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-brand-subheading uppercase tracking-[-0.02em]">{standort.name}</h2>
        {label && (
          <div className="flex flex-col items-end shrink-0">
            <span className={`text-brand-label text-xs ${isOpen && waitTime && waitTime.wait_minutes <= 10 ? "text-green-400" : "text-muted-foreground"}`}>
              {label}
            </span>
            {isOpen && waitTime && ago <= 60 && (
              <span className="text-[11px] text-muted-foreground/60 mt-0.5">
                vor {ago < 1 ? "1" : ago} Min. aktualisiert
              </span>
            )}
          </div>
        )}
      </div>

      {/* Beschreibung */}
      <p className="text-brand-body text-muted-foreground mb-8">{standort.detail}</p>

      {/* Info-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-brand-body">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          <span className="text-foreground/85">{standort.adresse}</span>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          <a href={`tel:${standort.telefon.replace(/\s/g, "")}`} className="text-brand-accent hover:text-foreground transition-colors">
            {standort.telefon}
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          <span className="text-foreground/85 whitespace-pre-line text-sm">{standort.oeffnungszeiten}</span>
        </div>
        {standort.email && (
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            <a href={`mailto:${standort.email}`} className="text-brand-accent hover:text-foreground transition-colors">
              {standort.email}
            </a>
          </div>
        )}
      </div>

      {/* Link */}
      <Link
        to={`/standorte/${standort.slug}`}
        className="inline-flex items-center gap-2 text-brand-label text-brand-accent hover:text-foreground transition-colors"
      >
        Mehr erfahren
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default StandortCard;
