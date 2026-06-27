import { useEffect, useRef } from "react";
import HorizontalScrollList from "../components/HorizontalScrollList";

function InsertValueScrollStrip({ values, activeIndex, isOperating }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!isOperating || activeIndex == null) return;

    const container = listRef.current;
    if (!container) return;

    const activeItem = container.querySelector(`[data-hsl-index="${activeIndex}"]`);
    activeItem?.scrollIntoView({ inline: "nearest", behavior: "smooth" });
  }, [activeIndex, isOperating, values.length]);

  if (!values.length) {
    return <div className="bst-insert-empty">No insert in progress</div>;
  }

  const showCurrent = isOperating && activeIndex != null;

  return (
    <HorizontalScrollList
      ref={listRef}
      items={values}
      visibleCount={3}
      gap={8}
      className="bst-insert-scroll"
      ariaLabel="Insert value queue — scroll horizontally to see all"
      getItemKey={(val, index) => `${val}-${index}`}
      renderItem={(val, index) => {
        const isCurrent = showCurrent && index === activeIndex;
        return (
          <div
            className={[
              "bst-insert-value",
              isCurrent ? "bst-insert-value-current" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {val}
          </div>
        );
      }}
    />
  );
}

export default InsertValueScrollStrip;
