'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Calendar, Heart, FileText } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700">
        <ArrowUpDown className="h-5 w-5" />
        <span className="font-medium">Sort by:</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by">
              <div className="flex items-center gap-2">
                {sortOptions.find(opt => opt.value === sortBy)?.icon && (
                  <span className="h-4 w-4">
                    {React.createElement(sortOptions.find(opt => opt.value === sortBy)!.icon, { className: "h-4 w-4" })}
                  </span>
                )}
                {getCurrentSortOption()}
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
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue>
              {getCurrentOrderOption()}
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