import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { useUIStore } from './useUIStore';

export function useDynamicBottomTab() {
  const setTabBarSticky = useUIStore((s) => s.setTabBarSticky);
  const isStickyRef = useRef(false);

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    

    const paddingToBottom = 15;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isStickyRef.current !== isAtBottom) {
      isStickyRef.current = isAtBottom;
      setTabBarSticky(isAtBottom);
    }
  }, [setTabBarSticky]);

  useFocusEffect(
    useCallback(() => {
      setTabBarSticky(isStickyRef.current);
      return () => {
        // Unfocus logic is handled by other tabs' FocusEffects overriding this
      };
    }, [setTabBarSticky])
  );

  return handleScroll;
}

