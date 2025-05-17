import { EditedImageDisplayProps } from "./types";

export const EditedImageDisplay = ({ imageUrl }: EditedImageDisplayProps) => (
  <div className="w-full h-full">
    <img
      src={imageUrl || ""}
      alt="Edited image"
      className="w-full h-full object-contain"
    />
    <div className="absolute bottom-4 right-4">
      <button
        onClick={() => imageUrl && window.open(imageUrl, "_blank")}
        className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
        aria-label="Download image"
        title="View full size"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span className="sr-only">View full size</span>
      </button>
    </div>
  </div>
);
