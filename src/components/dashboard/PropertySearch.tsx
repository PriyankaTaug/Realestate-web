"use client";

import { useState } from "react";

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  category: string;
  status: string;
  priceRange: string;
  location: string;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    status: "all",
    priceRange: "all",
    location: "all"
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "all",
      status: "all",
      priceRange: "all",
      location: "all"
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Search Properties</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
          suppressHydrationWarning
        >
          Clear all filters
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by property name, location, or description..."
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            suppressHydrationWarning
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            suppressHydrationWarning
          >
            <option value="all">All Categories</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            suppressHydrationWarning
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            suppressHydrationWarning
          >
            <option value="all">All Prices</option>
            <option value="0-50">₹0 - ₹50 Lakh</option>
            <option value="50-100">₹50 Lakh - ₹1 Cr</option>
            <option value="100-200">₹1 Cr - ₹2 Cr</option>
            <option value="200-500">₹2 Cr - ₹5 Cr</option>
            <option value="500+">₹5 Cr+</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            suppressHydrationWarning
          >
            <option value="all">All Locations</option>
            <option value="kochi">Kochi</option>
            <option value="trivandrum">Trivandrum</option>
            <option value="kozhikode">Kozhikode</option>
            <option value="kannur">Kannur</option>
            <option value="thrissur">Thrissur</option>
            <option value="kollam">Kollam</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.query || filters.category !== "all" || filters.status !== "all" || filters.priceRange !== "all" || filters.location !== "all") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.query && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                Search: "{filters.query}"
                <button onClick={() => handleFilterChange("query", "")} className="ml-1 hover:text-emerald-600">×</button>
              </span>
            )}
            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Category: {filters.category}
                <button onClick={() => handleFilterChange("category", "all")} className="ml-1 hover:text-blue-600">×</button>
              </span>
            )}
            {filters.status !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                Status: {filters.status}
                <button onClick={() => handleFilterChange("status", "all")} className="ml-1 hover:text-yellow-600">×</button>
              </span>
            )}
            {filters.priceRange !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                Price: {filters.priceRange}
                <button onClick={() => handleFilterChange("priceRange", "all")} className="ml-1 hover:text-purple-600">×</button>
              </span>
            )}
            {filters.location !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Location: {filters.location}
                <button onClick={() => handleFilterChange("location", "all")} className="ml-1 hover:text-green-600">×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
