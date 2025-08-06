'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Calendar, Heart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortControlsProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  const sortOptions = [
    { value: 'createdAt', label: 'Date Created', icon: Calendar },
    { value: 'likes', label: 'Popularity', icon: Heart },
    { value: 'fileName', label: 'Name', icon: FileText },
  ];

  const orderOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' },
  ];

  const handleSortByChange = (value: string) => {
    onSortChange(value, sortOrder);
  };

  const handleSortOrderChange = (value: string) => {
    onSortChange(sortBy, value);
  };

  const getCurrentSortOption = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Date Created';
  };

  const getCurrentOrderOption = () => {
    if (sortBy === 'likes') {
      return sortOrder === 'desc' ? 'Most Popular' : 'Least Popular';
    } else if (sortBy === 'fileName') {
      return sortOrder === 'asc' ? 'A to Z' : 'Z to A';
    } else {
      return sortOrder === 'desc' ? 'Newest First' : 'Oldest First';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8 p-6 sm:p-8 bg-secondary text-accent rounded-xl shadow-lg border border-primary/50">
      <div className="flex items-center gap-3">
        <ArrowUpDown className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
        <span className="font-semibold text-accent text-base sm:text-lg">Sort by:</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-[200px] lg:w-[220px] bg-secondary text-accent hover:bg-tertiary hover:text-accent border border-primary/50 rounded-lg px-4 py-3">
            <SelectValue placeholder="Sort by">
              <div className="flex items-center gap-3">
                {sortOptions.find(opt => opt.value === sortBy)?.icon && (
                  <span className="h-5 w-5">
                    {React.createElement(sortOptions.find(opt => opt.value === sortBy)!.icon, { className: "h-5 w-5" })}
                  </span>
                )}
                <span className="font-medium">{getCurrentSortOption()}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-secondary border border-primary/50">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value} className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-secondary text-accent hover:bg-tertiary hover:text-accent border border-primary/50 rounded-lg px-4 py-3">
            <SelectValue>
              <span className="font-medium">{getCurrentOrderOption()}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-secondary border border-primary/50">
            {sortBy === 'likes' ? (
              <>
                <SelectItem value="desc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">Most Popular</SelectItem>
                <SelectItem value="asc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">Least Popular</SelectItem>
              </>
            ) : sortBy === 'fileName' ? (
              <>
                <SelectItem value="asc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">A to Z</SelectItem>
                <SelectItem value="desc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">Z to A</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="desc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">Newest First</SelectItem>
                <SelectItem value="asc" className="bg-secondary text-accent hover:bg-tertiary hover:text-accent px-4 py-3">Oldest First</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}