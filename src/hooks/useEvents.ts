"use client";

import { useEffect, useState } from "react";
import { supabase, DISHDATA_SLUG } from "@/lib/supabase";

export interface SiteEvent {
  id: string;
  title: string;
  description: string | null;
  /** YYYY-MM-DD */
  event_date: string;
  event_time: string | null;
  tag: string | null;
  cta_url: string | null;
}

// Published, upcoming events for this restaurant. RLS limits anon reads to
// published rows; the date filter hides events that have already happened.
export const useEvents = () => {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      let list: SiteEvent[] = [];
      if (DISHDATA_SLUG) {
        const { data: org } = await supabase.from("orgs").select("id").eq("slug", DISHDATA_SLUG).maybeSingle();
        if (org) {
          const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
          const { data } = await supabase
            .from("website_events")
            .select("id,title,description,event_date,event_time,tag,cta_url")
            .eq("org_id", org.id)
            .gte("event_date", today)
            .order("event_date", { ascending: true })
            .limit(12);
          list = (data as SiteEvent[] | null) ?? [];
        }
      }
      if (active) {
        setEvents(list);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { events, loading };
};
