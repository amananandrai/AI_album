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
    <div className="rise flex flex-col gap-4 rounded-sticker border-2 border-ink bg-card p-4 shadow-sticker sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-sun text-on-sun shadow-sticker-sm">
          <ArrowUpDown className="h-4 w-4" />
        </div>
        <div>
          <p className="kicker">Sort</p>
          <p className="display text-lg font-extrabold">Gallery order</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-[220px]" aria-label="Sort by">
            <SelectValue placeholder="Sort by">
              <div className="flex items-center gap-2">
                {sortOptions.find(opt => opt.value === sortBy)?.icon && (
                  <span className="h-4 w-4">
                    {React.createElement(sortOptions.find(opt => opt.value === sortBy)!.icon, { className: "h-4 w-4" })}
                  </span>
                )}
                <span>{getCurrentSortOption()}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full sm:w-[200px]" aria-label="Sort order">
            <SelectValue>
              <span>{getCurrentOrderOption()}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortBy === 'likes' ? (
              <>
                <SelectItem value="desc">Most Popular</SelectItem>
                <SelectItem value="asc">Least Popular</SelectItem>
              </>
            ) : sortBy === 'fileName' ? (
              <>
                <SelectItem value="asc">A to Z</SelectItem>
                <SelectItem value="desc">Z to A</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}