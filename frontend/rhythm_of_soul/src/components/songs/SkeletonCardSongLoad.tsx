import React from "react";

type SkeletonCardSongLoadProps = {
  length: number;
};

export default function SkeletonCardSongLoad({ length }: SkeletonCardSongLoadProps) {
  return (
    <div className="d-flex overflow-auto flex-nowrap">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="card me-3 flex-grow-1"
          style={{
            flex: "0 0 16.666%",
            minWidth: "150px",
            maxWidth: "200px",
          }}
        >
          <div className="card-body text-center p-2">
            <div className="skeleton skeleton-img mb-2" style={{ width: "100%" }}></div>
            <div className="skeleton skeleton-text mb-1 mx-auto" style={{ width: "60%", height: "14px" }}></div>
            <div className="skeleton skeleton-text mx-auto" style={{ width: "40%", height: "12px" }}></div>
          </div>
        </div>
      ))}
      <style>
        {`
        .skeleton {
        background: linear-gradient(
            90deg,
            #e0e0e0 25%,
            #f0f0f0 50%,
            #e0e0e0 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
        border-radius: 4px;
        }

        .skeleton-img {
        aspect-ratio: 1 / 1;
        width: 100%;
        border-radius: 0.75rem;
        }

        .skeleton-text {
        border-radius: 6px;
        }

        @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
        }
        `}
      </style>
    </div>
  );
}
