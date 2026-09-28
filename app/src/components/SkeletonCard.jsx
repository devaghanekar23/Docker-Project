import React from "react";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-badge skeleton-shimmer"></div>
        <div className="skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-line skeleton-shimmer"></div>
        <div className="skeleton-line short skeleton-shimmer"></div>
        <div className="skeleton-footer skeleton-shimmer"></div>
      </div>
    </div>
  );
}