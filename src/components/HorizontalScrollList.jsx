import { forwardRef, useEffect, useRef } from "react";
import "./horizontalScrollList.css";

const HorizontalScrollList = forwardRef(function HorizontalScrollList(
  {
    items,
    renderItem,
    visibleCount = 3,
    gap = 8,
    className = "",
    ariaLabel,
    getItemKey,
  },
  ref,
) {
  const innerRef = useRef(null);
  const containerRef = ref ?? innerRef;

  const itemFlexBasis = `calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;

      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef, items.length]);

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className={`horizontal-scroll-list${className ? ` ${className}` : ""}`}
      style={{ gap: `${gap}px` }}
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <div
          key={getItemKey ? getItemKey(item, index) : index}
          className="horizontal-scroll-list-item"
          data-hsl-index={index}
          style={{ flex: `0 0 ${itemFlexBasis}` }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
});

export default HorizontalScrollList;
