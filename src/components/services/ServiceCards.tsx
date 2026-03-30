import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { services } from "@/data/siteData";
import { ArrowRight } from "lucide-react";

const ServiceCards = () => (
  <div className="divide-y divide-border/20">
    {services.map((s, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          to={s.href}
          className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 transition-all duration-300 hover:pl-4"
        >
          <div className="flex items-baseline gap-6 mb-2 md:mb-0">
            <span className="text-[11px] text-muted-foreground/40 font-light tracking-[2px]">{s.nr}</span>
            <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] group-hover:text-brand-accent transition-colors duration-200">
              {s.titel}
            </h3>
          </div>
          <div className="flex items-center gap-6 md:gap-10 pl-12 md:pl-0">
            <p className="text-base text-muted-foreground font-light max-w-[340px] leading-[1.7] hidden md:block">{s.text}</p>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);

export default ServiceCards;
