"use client";

import React, {
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRight,
  ChevronUpIcon,
  CopyIcon,
  File,
  Folder,
  FolderOpen,
  MinusIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

/* ==========================================================================
   1. Kibo UI — Pill (@repo/pill)
   ========================================================================== */
export type PillProps = ComponentProps<typeof Badge> & {
  themed?: boolean;
};

export const Pill = ({
  variant = "secondary",
  className,
  ...props
}: PillProps) => (
  <Badge
    className={cn("gap-2 rounded-full px-3 py-1 font-normal", className)}
    variant={variant}
    {...props}
  />
);

export type PillStatusProps = {
  children: ReactNode;
  className?: string;
};

export const PillStatus = ({
  children,
  className,
  ...props
}: PillStatusProps) => (
  <div
    className={cn(
      "flex items-center gap-1.5 border-r border-border pr-2 font-medium",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type PillIndicatorProps = {
  variant?: "success" | "error" | "warning" | "info";
  pulse?: boolean;
};

export const PillIndicator = ({
  variant = "success",
  pulse = false,
}: PillIndicatorProps) => (
  <span className="relative flex size-2">
    {pulse && (
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          variant === "success" && "bg-emerald-400",
          variant === "error" && "bg-rose-400",
          variant === "warning" && "bg-amber-400",
          variant === "info" && "bg-sky-400"
        )}
      />
    )}
    <span
      className={cn(
        "relative inline-flex size-2 rounded-full",
        variant === "success" && "bg-emerald-500",
        variant === "error" && "bg-rose-500",
        variant === "warning" && "bg-amber-500",
        variant === "info" && "bg-sky-500"
      )}
    />
  </span>
);

export type PillDeltaProps = {
  className?: string;
  delta: number;
};

export const PillDelta = ({ className, delta }: PillDeltaProps) => {
  if (!delta) {
    return (
      <MinusIcon className={cn("size-3 text-muted-foreground", className)} />
    );
  }
  if (delta > 0) {
    return (
      <ChevronUpIcon className={cn("size-3 text-emerald-500", className)} />
    );
  }
  return <ChevronDownIcon className={cn("size-3 text-rose-500", className)} />;
};

/* ==========================================================================
   2. Kibo UI — Status (@repo/status)
   ========================================================================== */
export type StatusProps = ComponentProps<typeof Badge> & {
  status: "online" | "offline" | "maintenance" | "degraded";
};

export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    className={cn(
      "flex items-center gap-2 rounded-full px-2.5 py-0.5 font-normal",
      "group",
      status,
      className
    )}
    variant="secondary"
    {...props}
  />
);

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className={cn("relative flex h-2 w-2", className)} {...props}>
    <span
      className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-rose-500",
        "group-[.maintenance]:bg-sky-500",
        "group-[.degraded]:bg-amber-500"
      )}
    />
    <span
      className={cn(
        "relative inline-flex h-2 w-2 rounded-full",
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-rose-500",
        "group-[.maintenance]:bg-sky-500",
        "group-[.degraded]:bg-amber-500"
      )}
    />
  </span>
);

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn("text-muted-foreground text-xs", className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.online]:block">Online</span>
        <span className="hidden group-[.offline]:block">Offline</span>
        <span className="hidden group-[.maintenance]:block">Maintenance</span>
        <span className="hidden group-[.degraded]:block">Degraded</span>
      </>
    )}
  </span>
);

/* ==========================================================================
   3. Kibo UI — Announcement (@repo/announcement)
   ========================================================================== */
export type AnnouncementProps = ComponentProps<typeof Badge> & {
  themed?: boolean;
};

export const Announcement = ({
  variant = "outline",
  themed = false,
  className,
  ...props
}: AnnouncementProps) => (
  <Badge
    className={cn(
      "group max-w-full gap-2 rounded-full bg-background px-3 py-0.5 font-medium shadow-sm transition-all",
      "hover:shadow-md",
      themed && "announcement-themed border-foreground/10",
      className
    )}
    variant={variant}
    {...props}
  />
);

export type AnnouncementTagProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTag = ({
  className,
  ...props
}: AnnouncementTagProps) => (
  <div
    className={cn(
      "-ml-2.5 shrink-0 truncate rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-mono text-foreground",
      className
    )}
    {...props}
  />
);

export type AnnouncementTitleProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTitle = ({
  className,
  ...props
}: AnnouncementTitleProps) => (
  <div
    className={cn("flex items-center gap-1.5 truncate py-0.5 text-xs text-muted-foreground", className)}
    {...props}
  />
);

/* ==========================================================================
   4. Kibo UI — Snippet (@repo/snippet)
   ========================================================================== */
export type SnippetProps = ComponentProps<typeof Tabs>;

export const Snippet = ({ className, ...props }: SnippetProps) => (
  <Tabs
    className={cn(
      "group w-full gap-0 overflow-hidden rounded-lg border border-border bg-card",
      className
    )}
    {...props}
  />
);

export type SnippetHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SnippetHeader = ({ className, ...props }: SnippetHeaderProps) => (
  <div
    className={cn(
      "flex flex-row items-center justify-between border-b border-border bg-secondary/50 px-2 py-1",
      className
    )}
    {...props}
  />
);

export type SnippetCopyButtonProps = ComponentProps<typeof Button> & {
  value: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const SnippetCopyButton = ({
  asChild,
  value,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: SnippetCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (
      typeof window === "undefined" ||
      !navigator.clipboard?.writeText ||
      !value
    ) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    }, onError);
  };

  if (asChild) {
    return cloneElement(children as ReactElement, {
      onClick: copyToClipboard,
    });
  }

  const icon = isCopied ? (
    <CheckIcon className="size-3.5 text-emerald-400" />
  ) : (
    <CopyIcon className="size-3.5 text-muted-foreground" />
  );

  return (
    <Button
      type="button"
      className={cn("h-7 w-7", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? icon}
    </Button>
  );
};

export const SnippetTabsList = TabsList;

export const SnippetTabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof TabsTrigger>) => (
  <TabsTrigger className={cn("gap-1.5 text-xs font-mono", className)} {...props} />
);

export const SnippetTabsContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof TabsContent>) => (
  <TabsContent
    className={cn("mt-0 bg-background/80 p-3 text-xs font-mono", className)}
    {...props}
  >
    <pre className="overflow-x-auto text-foreground">{children}</pre>
  </TabsContent>
);

/* ==========================================================================
   5. Kibo UI — Tree (@repo/tree)
   ========================================================================== */
type TreeContextType = {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  indent?: number;
  animateExpand?: boolean;
};

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("Tree components must be used within a TreeProvider");
  }
  return context;
};

type TreeNodeContextType = {
  nodeId: string;
  level: number;
  isLast: boolean;
  parentPath: boolean[];
};

const TreeNodeContext = createContext<TreeNodeContextType | undefined>(
  undefined
);

const useTreeNode = () => {
  const context = useContext(TreeNodeContext);
  if (!context) {
    throw new Error("TreeNode components must be used within a TreeNode");
  }
  return context;
};

export type TreeProviderProps = {
  children: ReactNode;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  className?: string;
};

export const TreeProvider = ({
  children,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds,
  onSelectionChange,
  indent = 18,
  animateExpand = true,
  className,
}: TreeProviderProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds ?? []
  );

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) return;
      let newSelection: string[];
      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }
      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedIds(newSelection);
      }
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ]
  );

  return (
    <TreeContext.Provider
      value={{
        expandedIds,
        selectedIds: currentSelectedIds,
        toggleExpanded,
        handleSelection,
        showLines,
        showIcons,
        selectable,
        multiSelect,
        indent,
        animateExpand,
      }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </TreeContext.Provider>
  );
};

export const TreeView = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-1.5", className)} {...props}>
    {children}
  </div>
);

export type TreeNodeProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  children?: ReactNode;
};

export const TreeNode = ({
  nodeId: providedNodeId,
  level = 0,
  isLast = false,
  parentPath = [],
  children,
  className,
  ...props
}: TreeNodeProps) => {
  const generatedId = useId();
  const nodeId = providedNodeId ?? generatedId;

  const currentPath = level === 0 ? [] : [...parentPath];
  if (level > 0 && parentPath.length < level - 1) {
    while (currentPath.length < level - 1) {
      currentPath.push(false);
    }
  }
  if (level > 0) {
    currentPath[level - 1] = isLast;
  }

  return (
    <TreeNodeContext.Provider
      value={{
        nodeId,
        level,
        isLast,
        parentPath: currentPath,
      }}
    >
      <div className={cn("select-none", className)} {...props}>
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
};

export const TreeLines = () => {
  const { showLines, indent } = useTree();
  const { level, isLast, parentPath } = useTreeNode();

  if (!showLines || level === 0) return null;

  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-0">
      {Array.from({ length: level }, (_, index) => {
        const shouldHideLine = parentPath[index] === true;
        if (shouldHideLine && index === level - 1) return null;
        return (
          <div
            className="absolute top-0 bottom-0 border-border/60 border-l"
            key={index.toString()}
            style={{
              left: index * (indent ?? 0) + 12,
              display: shouldHideLine ? "none" : "block",
            }}
          />
        );
      })}
      <div
        className="absolute top-1/2 border-border/60 border-t"
        style={{
          left: (level - 1) * (indent ?? 0) + 12,
          width: (indent ?? 0) - 4,
          transform: "translateY(-1px)",
        }}
      />
      {isLast && (
        <div
          className="absolute top-0 border-border/60 border-l"
          style={{
            left: (level - 1) * (indent ?? 0) + 12,
            height: "50%",
          }}
        />
      )}
    </div>
  );
};

export const TreeNodeTrigger = ({
  children,
  className,
  onClick,
  ...props
}: ComponentProps<typeof motion.div>) => {
  const { selectedIds, toggleExpanded, handleSelection, indent } = useTree();
  const { nodeId, level } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);

  return (
    <motion.div
      className={cn(
        "group relative mx-0.5 flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs transition-colors",
        "hover:bg-accent/60",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={(e) => {
        toggleExpanded(nodeId);
        handleSelection(nodeId, e.ctrlKey || e.metaKey);
        onClick?.(e);
      }}
      style={{ paddingLeft: level * (indent ?? 0) + 8 }}
      {...props}
    >
      <TreeLines />
      {children as ReactNode}
    </motion.div>
  );
};

export const TreeNodeContent = ({
  children,
  hasChildren = false,
  className,
  ...props
}: ComponentProps<typeof motion.div> & { hasChildren?: boolean }) => {
  const { animateExpand, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  return (
    <AnimatePresence initial={false}>
      {hasChildren && isExpanded && (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: animateExpand ? 0.2 : 0 }}
        >
          <div className={className} {...(props as any)}>
            {children as ReactNode}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const TreeExpander = ({
  hasChildren = false,
  className,
  onClick,
}: HTMLAttributes<HTMLDivElement> & { hasChildren?: boolean }) => {
  const { expandedIds, toggleExpanded } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!hasChildren) return <div className="mr-1 h-4 w-4" />;

  return (
    <motion.div
      animate={{ rotate: isExpanded ? 90 : 0 }}
      className={cn(
        "mr-1 flex h-4 w-4 cursor-pointer items-center justify-center",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        toggleExpanded(nodeId);
        onClick?.(e);
      }}
      transition={{ duration: 0.15 }}
    >
      <ChevronRight className="h-3 w-3 text-muted-foreground" />
    </motion.div>
  );
};

export const TreeIcon = ({
  icon,
  hasChildren = false,
  className,
}: HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  hasChildren?: boolean;
}) => {
  const { showIcons, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!showIcons) return null;

  const defaultIcon = hasChildren ? (
    isExpanded ? (
      <FolderOpen className="h-3.5 w-3.5 text-sky-400" />
    ) : (
      <Folder className="h-3.5 w-3.5 text-sky-400" />
    )
  ) : (
    <File className="h-3.5 w-3.5 text-muted-foreground" />
  );

  return (
    <div
      className={cn(
        "mr-2 flex h-4 w-4 items-center justify-center text-muted-foreground",
        className
      )}
    >
      {icon || defaultIcon}
    </div>
  );
};

export const TreeLabel = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("flex-1 truncate font-mono text-xs", className)}
    {...props}
  />
);
