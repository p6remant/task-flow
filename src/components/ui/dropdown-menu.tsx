"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DROPDOWN_MENU_MIN_WIDTH } from "@/constants/app-config";
import { cn } from "@/lib/cn";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type UiDropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: "start" | "end";
};

export function UiDropdownMenu({ trigger, children, align = "end" }: UiDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const closeMenu = () => setIsOpen(false);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const wrapperElement = wrapperRef.current;
    const menuElement = menuRef.current;

    if (!wrapperElement || !menuElement) return;

    const calculatePosition = () => {
      const triggerRect = wrapperElement.getBoundingClientRect();

      const padding = 8;
      const offset = 4;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const menuWidth = Math.max(menuElement.offsetWidth, DROPDOWN_MENU_MIN_WIDTH);

      const menuHeight = menuElement.offsetHeight;

      let left = align === "end" ? triggerRect.right - menuWidth : triggerRect.left;

      left = clamp(left, padding, viewportWidth - menuWidth - padding);

      let top = triggerRect.bottom + offset;

      const shouldOpenAbove = top + menuHeight > viewportHeight - padding;

      if (shouldOpenAbove) {
        top = triggerRect.top - menuHeight - offset;
      }

      top = clamp(top, padding, viewportHeight - menuHeight - padding);

      setPosition({ top, left });
    };

    calculatePosition();

    const rafId = requestAnimationFrame(calculatePosition);

    // cleanup animation frame
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (wrapperRef.current?.contains(targetNode)) return;
      if (menuRef.current?.contains(targetNode)) return;

      closeMenu();
    };

    document.addEventListener("mousedown", handleOutsideInteraction);

    // cleanup event listener
    return () => document.removeEventListener("mousedown", handleOutsideInteraction);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnResizeOrScroll = () => closeMenu();

    window.addEventListener("resize", closeOnResizeOrScroll);
    window.addEventListener("scroll", closeOnResizeOrScroll, true);

    // cleanup event listeners
    return () => {
      window.removeEventListener("resize", closeOnResizeOrScroll);
      window.removeEventListener("scroll", closeOnResizeOrScroll, true);
    };
  }, [isOpen]);

  const menuContent = typeof children === "function" ? children(closeMenu) : children;

  return (
    <>
      <div ref={wrapperRef} className="relative inline-flex">
        <div
          className="inline-flex cursor-pointer"
          onClick={() => setIsOpen((previous) => !previous)}
          role="presentation"
        >
          {trigger}
        </div>
      </div>

      {isOpen
        ? createPortal(
            <div
              ref={menuRef}
              className="max-h-[min(24rem,calc(100dvh-1rem))] min-w-44 overflow-y-auto overscroll-contain rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-xl"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                zIndex: 99999,
              }}
              role="menu"
              onClick={(event) => event.stopPropagation()}
            >
              {menuContent}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export type UiMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean;
};

export function UiMenuButton({
  className = "",
  danger,
  type = "button",
  ...props
}: UiMenuButtonProps) {
  const style = danger
    ? "text-red-400 hover:bg-red-950/50 focus-visible:bg-red-950/50"
    : "text-neutral-200 hover:bg-neutral-800 focus-visible:bg-neutral-800";

  return (
    <button
      type={type}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm outline-none",
        style,
        "focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-inset",
        className,
      )}
      role="menuitem"
      {...props}
    />
  );
}
