import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useLongPressHome = (delay: number = 500) => {
  const navigate = useNavigate();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    longPressTimer.current = setTimeout(() => {
      navigate("/");
    }, delay);
  };

  const handleEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return {
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };
};
