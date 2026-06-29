"use client";

import { useEffect, useState } from "react";
import { Scholarship } from "@/types";
import { ScholarshipGrid } from "@/components/scholarship-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, DollarSign, Globe, Award, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [stats, setStats] = useState({ total: 0, totalValue: 0, countries: 0, categories: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const categories = ["All", "STEM", "Arts", "Business", "Medicine", "Engineering", "Social Sciences", "Law"];
  const countries = ["All", "USA", "UK", "Canada", "Australia", "Germany", "Global", "Netherlands"];

  useEffect(() => {
    setIsVisible(true);
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await fetch("/api/scholarships");
      const data = await res.json();
      setScholarships(data);

      const totalValue = data.reduce((acc: number, s: Scholarship) => {
        const amount = parseInt(s.amount.replace(/[^0-9]/g, "")) || 0;
        return acc + amount;
      }, 0);

      const uniqueCountries = new Set(data.map((s: Scholarship) => s.country)).size;
      const uniqueCategories = new Set(data.map((s: Scholarship) => s.category)).size;

      setStats({
        total: data.length,
        totalValue,
        countries: uniqueCountries,
        categories: uniqueCategories,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesCountry = selectedCountry === "All" || s.country === selectedCountry;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 pt-16 sm:pt-24 pb-20 sm:pb-32">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
              <span>No Sign-Up Required — Apply Directly</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Find Your Perfect{" "}
              <span className="text-gradient">Scholarship</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Browse thousands of scholarships from top universities worldwide. 
              No account needed — apply directly in seconds.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative px-4">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search scholarships by keyword, country, or field..."
                className="pl-14 h-14 bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-500 rounded-2xl text-base shadow-2xl shadow-black/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 px-4">
              <Link href="/scholarships">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl px-8 h-12 text-base w-full sm:w-auto">
                  Browse All Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-5 sm:p-6 text-center hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
            <GraduationCap className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Scholarships</p>
          </div>
          <div className="glass-card p-5 sm:p-6 text-center hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
            <DollarSign className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-white">${(stats.totalValue / 1000).toFixed(0)}k+</p>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Total Value</p>
          </div>
          <div className="glass-card p-5 sm:p-6 text-center hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
            <Globe className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.countries}</p>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Countries</p>
          </div>
          <div className="glass-card p-5 sm:p-6 text-center hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
            <TrendingUp className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.categories}</p>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Categories</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <p className="text-sm text-neutral-500 mb-3 font-medium">Category</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full whitespace-nowrap text-xs sm:text-sm ${
                    selectedCategory === cat 
                      ? "bg-amber-500 text-black hover:bg-amber-400 font-semibold" 
                      : "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-3 font-medium">Country</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {countries.map((c) => (
                <Button
                  key={c}
                  variant={selectedCountry === c ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCountry(c)}
                  className={`rounded-full whitespace-nowrap text-xs sm:text-sm ${
                    selectedCountry === c 
                      ? "bg-amber-500 text-black hover:bg-amber-400 font-semibold" 
                      : "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Featured Scholarships
          </h2>
          <p className="text-neutral-500 text-sm">{filteredScholarships.length} results</p>
        </div>

        <ScholarshipGrid scholarships={filteredScholarships} />

        {filteredScholarships.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg mb-4">No scholarships found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {setSearchQuery(""); setSelectedCategory("All"); setSelectedCountry("All");}}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <GraduationCap className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Fund Your Future?</h2>
            <p className="text-neutral-400 max-w-lg mx-auto mb-8">
              Join thousands of students who found their perfect scholarship through ScholarMall. No sign-up required.
            </p>
            <Link href="/scholarships">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl px-8">
                Explore All Scholarships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
