import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const XLogoTooltip: React.FC = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href="https://x.com/yasinkavakliat" className="font-semibold size-4 inline-flex" aria-label="Follow Yasin on X (formerly Twitter)">
          <svg
            x="11"
            y="11"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="logo-icon"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
              opacity="0.7"
              className="logo-path transition-all duration-300 group-hover/x:opacity-100 group-hover/x:fill-primary"
            />
          </svg>
        </a>
      </TooltipTrigger>
      <TooltipContent>x.com/yasinkavakliat</TooltipContent>
    </Tooltip>
  );
};
