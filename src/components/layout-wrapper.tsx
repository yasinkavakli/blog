'use client'

import React from "react"
import { AppSidebar } from "./app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { ShareIcon } from "./components/ui/share"
import { CheckIcon } from "./components/ui/check"
import { cn } from "./lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  avatarSrc?: string
  hasBlogPosts?: boolean
}

// Separate component to use useSidebar hook
function HeaderContent({ breadcrumbs, avatarSrc, onShare, isCopied, tooltipOpen, onTooltipOpenChange, isHovered, setIsHovered }: {
  breadcrumbs?: { label: string; href?: string }[]
  avatarSrc?: string
  onShare: () => void
  isCopied: boolean
  tooltipOpen: boolean
  onTooltipOpenChange: (open: boolean) => void
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        {avatarSrc && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-6 p-0 overflow-hidden transition-all duration-200 ease-linear",
                      isCollapsed ? "opacity-100 w-6" : "opacity-0 w-0"
                    )}
                    onClick={() => window.location.href = "/"}
                  >
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="size-6 rounded-full object-cover"
                    />
                    <span className="sr-only">Go to homepage</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Yasin Kavakli
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isCollapsed && <div className="border-r border-dashed mr-2 h-4" />}
          </>
        )}
        <SidebarTrigger className="-ml-1" />
        <div className="border-r border-dashed mr-2 h-4" />
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <div className="border-l border-dashed mx-1.5 h-4" />
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <span className="text-sm text-muted-foreground">Yasin Kavakli</span>
        )}
      </div>
      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={onTooltipOpenChange}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={onShare}
              onMouseEnter={() => !isCopied && setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isCopied ? (
                <CheckIcon size={16} />
              ) : (
                <ShareIcon size={16} isAnimating={isHovered} />
              )}
              <span className="sr-only">Share this page</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isCopied ? '✓ Copied to clipboard!' : 'Share this page'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default function LayoutWrapper({ children, breadcrumbs, avatarSrc, hasBlogPosts = true }: LayoutWrapperProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)
  const [tooltipOpen, setTooltipOpen] = React.useState(false)

  // Controlled sidebar state - read from cookie on mount
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Read cookie on mount to get the saved state
    const cookies = document.cookie.split('; ');
    const sidebarCookie = cookies.find(row => row.startsWith('sidebar_state='));
    if (sidebarCookie) {
      const value = sidebarCookie.split('=')[1];
      setSidebarOpen(value === 'true');
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !contentRef.current) return;

    // Save scroll position
    const handleScroll = () => {
      if (contentRef.current) {
        sessionStorage.setItem('contentScroll', contentRef.current.scrollTop.toString());
      }
    };

    const container = contentRef.current;
    container.addEventListener('scroll', handleScroll);
    
    // Restore scroll position if it exists
    const savedScroll = sessionStorage.getItem('contentScroll');
    if (savedScroll) {
      container.scrollTop = parseInt(savedScroll, 10);
    }

    return () => container.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTooltipOpen(true)
      setTimeout(() => {
        setIsCopied(false)
        setTooltipOpen(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Don't render until we've read the cookie to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="h-svh overflow-hidden">
      <AppSidebar avatarSrc={avatarSrc} hasBlogPosts={hasBlogPosts} />
      <SidebarInset className="overflow-hidden">
        <div className="flex flex-col h-full w-full rounded-xl bg-background dark:bg-card">
          <header className="flex h-14 shrink-0 items-center border-b border-dashed px-4">
            <HeaderContent
              breadcrumbs={breadcrumbs}
              avatarSrc={avatarSrc}
              onShare={handleShare}
              isCopied={isCopied}
              tooltipOpen={tooltipOpen}
              onTooltipOpenChange={setTooltipOpen}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
            />
          </header>
          <div ref={contentRef} className="flex-1 flex flex-col items-center py-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
