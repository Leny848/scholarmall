"use client";

import { useEffect, useState } from "react";
import { Scholarship } from "@/types";
import { ScholarshipGrid } from "@/components/scholarship-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scholarships")
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data);
        setLoading(false);
      });
  }, []);

  const filtered = scholarships.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || s.category === category;
    const matchesCountry = country === "All" || s.country === country;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const categories = ["All", "STEM", "Arts", "Business", "Medicine", "Engineering", "Social Sciences", "Law"];
  const countries = ["All", "USA", "UK", "Canada", "Australia", "Germany", "Global", "Netherlands"];

  const activeFilters = (category !== "All" ? 1 : 0) + (country !== "All" ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">All Scholarships</h1>
          <p className="text-neutral-400">Browse all available opportunities. No account needed.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input
              placeholder="Search scholarships..."
              className="pl-12 h-12 bg-neutral-900 border-neutral-700 rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2 text-neutral-500 text-sm mr-2">
            <SlidersHorizontal className="w-4 h-4" />
            Category:
          </div>
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className={`rounded-full text-xs ${
                category === c 
                  ? "bg-amber-500 text-black hover:bg-amber-400 font-semibold" 
                  : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 text-neutral-500 text-sm mr-2">
            <SlidersHorizontal className="w-4 h-4" />
            Country:
          </div>
          {countries.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={country === c ? "default" : "outline"}
              onClick={() => setCountry(c)}
              className={`rounded-full text-xs ${
                country === c 
                  ? "bg-amber-500 text-black hover:bg-amber-400 font-semibold" 
                  : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {c}
            </Button>
          ))}
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-neutral-500">{filtered.length} results</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {setSearchQuery(""); setCategory("All"); setCountry("All");}}
              className="text-amber-400 hover:text-amber-300 text-xs"
            >
              <X className="w-3 h-3 mr-1" /> Clear filters
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="glass-card h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <ScholarshipGrid scholarships={filtered} />
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg mb-4">No scholarships found.</p>
            <Button 
              variant="outline" 
              className="border-amber-500/30 text-amber-400"
              onClick={() => {setSearchQuery(""); setCategory("All"); setCountry("All");}}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
