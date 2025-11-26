"use client"

import * as React from "react"
import { HomeIcon } from "@/components/components/ui/home"
import { MessageCircleIcon } from "@/components/components/ui/message-circle"
import { FeatherIcon } from "@/components/components/ui/feather"
import { LinkIcon } from "@/components/components/ui/link"
import { ScriptIcon } from "@/components/components/ui/script"
import { StackIcon } from "@/components/components/ui/stack"
import { UsesIcon } from "@/components/components/ui/uses"
import { RSSIcon } from "@/components/components/ui/rss"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const createNavigation = (hasBlogPosts: boolean) => [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Writing",
    url: "/blog",
    icon: FeatherIcon,
    disabled: !hasBlogPosts,
  },
  {
    title: "RSS",
    url: "/rss.xml",
    icon: RSSIcon,
    disabled: !hasBlogPosts,
    external: true,
  },
]

const createProjects = (hasBlogPosts: boolean) => [
  {
    title: "AMA",
    url: "/ama",
    icon: MessageCircleIcon,
    disabled: true,
  },
  {
    title: "Links",
    url: "/links",
    icon: LinkIcon,
    disabled: true,
  },
  {
    title: "Scripts",
    url: "/scripts",
    icon: ScriptIcon,
    disabled: true,
  },
  {
    title: "Stack",
    url: "/stack",
    icon: StackIcon,
    disabled: true,
  },
  {
    title: "Uses",
    url: "/uses",
    icon: UsesIcon,
    disabled: true,
  },
]

// Navigation item with hover animation and optional sub-items
function NavItem({ item, asChild = true, target, rel }: {
  item: { 
    title: string
    url: string
    icon: React.ComponentType<{ size?: number; isAnimating?: boolean }>
    disabled?: boolean
    external?: boolean
  }
  asChild?: boolean
  target?: string
  rel?: string
}) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    // Determine if current path matches the item URL
    const currentPath = window.location.pathname
    if (item.url === "/" && currentPath === "/") {
      setIsActive(true)
    } else if (item.url !== "/" && (currentPath.startsWith(item.url))) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [item.url])

  const Icon = item.icon

  // When disabled, render as a non-interactive anchor that looks disabled
  if (item.disabled) {
    return (
      <SidebarMenuItem
        onMouseEnter={() => setIsHovered(false)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarMenuButton
          asChild={false}
          tooltip={`${item.title} (No posts yet)`}
          disabled={true}
          className="line-through opacity-50 pointer-events-none"
        >
          <span className="flex items-center gap-2">
            <Icon size={16} isAnimating={false} />
            <span>{item.title}</span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarMenuButton
        asChild={asChild}
        tooltip={item.title}
        className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
      >
        <a href={item.url} target={item.external ? "_blank" : target} rel={item.external ? "noopener noreferrer" : rel}>
          <Icon size={16} isAnimating={isHovered || isActive} />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Project item with hover animation (no link)
function ProjectItem({ item }: {
  item: { 
    title: string
    url: string
    icon: React.ComponentType<{ size?: number; isAnimating?: boolean }>
    disabled?: boolean
    external?: boolean
  }
}) {
  const [isHovered, setIsHovered] = React.useState(false)
  const Icon = item.icon

  if (item.external && !item.disabled) {
    return (
      <SidebarMenuItem
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarMenuButton
          asChild
          tooltip={item.title}
        >
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Icon size={16} isAnimating={isHovered} />
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarMenuButton
        tooltip={item.disabled ? `${item.title} (Coming soon)` : item.title}
        disabled={item.disabled}
        className={item.disabled ? "line-through opacity-50 pointer-events-none" : ""}
      >
        <Icon size={16} isAnimating={isHovered} />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ avatarSrc, hasBlogPosts = true, ...props }: React.ComponentProps<typeof Sidebar> & { avatarSrc?: string; hasBlogPosts?: boolean }) {
  const navigation = createNavigation(hasBlogPosts)
  const projects = createProjects(hasBlogPosts)
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="mt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-3">
                <img
                  src={avatarSrc || "/avatar.png"}
                  alt="Yasin Kavakli"
                  className="size-8 rounded-full object-cover"
                />
                <span className="font-semibold">Yasin Kavakli</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground font-normal">Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((item) => (
                <ProjectItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
