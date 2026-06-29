"use client";

import { useEffect, useState } from "react";
import { Scholarship } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, MapPin, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Props {
  scholarships?: Scholarship[];
}

export function ScholarshipGrid({ scholarships: propScholarships }: Props) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(propScholarships || []);
  const [loading, setLoading] = useState(!propScholarships);

  useEffect(() => {
    if (!propScholarships) {
      fetch("/api/scholarships")
        .then(r => r.json())
        .then(data => { setScholarships(data); setLoading(false); });
    }
  }, [propScholarships]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className="glass-card h-96 animate-pulse" />)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scholarships.map(s => (
        <Card key={s.id} className="glass-card overflow-hidden group hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="h-48 bg-neutral-800 relative overflow-hidden">
            {s.image_url ? (
              <img src={s.image_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-neutral-700" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-500/90 text-black font-semibold">{s.category}</Badge>
            </div>
          </div>
          <CardContent className="p-5">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">{s.title}</h3>
            <div className="flex items-center gap-4 mb-3 text-sm">
              <span className="flex items-center gap-1 text-amber-400 font-bold"><DollarSign className="w-4 h-4" />{s.amount}</span>
              <span className="flex items-center gap-1 text-neutral-400"><MapPin className="w-4 h-4" />{s.country}</span>
            </div>
            <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{s.description}</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-neutral-500 text-xs"><Calendar className="w-3 h-3" />{new Date(s.deadline).toLocaleDateString()}</span>
              <Link href={`/apply?id=${s.id}`}>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg">
                  Apply <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
