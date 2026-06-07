import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse-subtle">
      {/* Image Block */}
      <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-luxury-charcoal" />
      {/* Brand & Title */}
      <div className="h-4 w-1/4 bg-gray-200 dark:bg-luxury-charcoal" />
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-luxury-charcoal" />
      {/* Price */}
      <div className="h-4 w-1/3 bg-gray-200 dark:bg-luxury-charcoal" />
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 w-full animate-pulse-subtle">
      {/* Left: Image gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-luxury-charcoal" />
        <div className="grid grid-cols-4 gap-4">
          <div className="aspect-square bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="aspect-square bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="aspect-square bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="aspect-square bg-gray-200 dark:bg-luxury-charcoal" />
        </div>
      </div>
      
      {/* Right: Info */}
      <div className="flex flex-col gap-6">
        <div className="h-4 w-1/5 bg-gray-200 dark:bg-luxury-charcoal" />
        <div className="h-10 w-4/5 bg-gray-200 dark:bg-luxury-charcoal" />
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-luxury-charcoal" />
        
        <hr className="border-gray-200 dark:border-luxury-border" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="h-4 w-full bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-luxury-charcoal" />
        </div>
        
        {/* Sizes */}
        <div className="space-y-2">
          <div className="h-4 w-1/6 bg-gray-200 dark:bg-luxury-charcoal" />
          <div className="flex gap-2">
            <div className="h-10 w-12 bg-gray-200 dark:bg-luxury-charcoal" />
            <div className="h-10 w-12 bg-gray-200 dark:bg-luxury-charcoal" />
            <div className="h-10 w-12 bg-gray-200 dark:bg-luxury-charcoal" />
            <div className="h-10 w-12 bg-gray-200 dark:bg-luxury-charcoal" />
          </div>
        </div>

        {/* Button */}
        <div className="h-12 w-full bg-gray-200 dark:bg-luxury-charcoal mt-4" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse-subtle">
      {Array.from({ length: rows }).map((_, rIndex) => (
        <div key={rIndex} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, cIndex) => (
            <div
              key={cIndex}
              className={`h-6 bg-gray-200 dark:bg-luxury-charcoal rounded ${
                cIndex === 0 ? 'w-1/4' : 'w-1/6'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
