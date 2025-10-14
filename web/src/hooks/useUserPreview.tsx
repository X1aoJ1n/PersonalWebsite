import { useState, useRef, useCallback } from 'react';
import type { UserPreviewData } from '@/models';
import { getUserPreviewById } from '@/api/user';

const HOVER_DELAY = 400; // 延迟显示
const HIDE_DELAY = 300;  // 延迟隐藏

export const useUserPreview = () => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<UserPreviewData | null>(null);
  // 关键：让卡片初始位置在屏幕外，防止闪烁
  const [cardPosition, setCardPosition] = useState({ top: -9999, left: -9999 });

  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const fetchData = useCallback(async (userId: string) => {
    setIsLoading(true);
    setPreviewData(null);
    try {
      const res = await getUserPreviewById(userId);
      if (res.code === 200 && res.data) {
        setPreviewData(res.data);
      } else {
        // 如果获取数据失败，直接隐藏卡片
        setIsCardVisible(false);
      }
    } catch (error) {
      console.error("获取用户预览信息失败:", error);
      setIsCardVisible(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMouseEnterForReply = useCallback((
    _event: React.MouseEvent,
    userId: string,
    anchorElement: HTMLElement | null
  ) => {
    // 1. 鼠标进入任何目标，立即取消任何将要隐藏卡片的计划
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    // 2. 取消任何正在等待显示的旧计划，以当前目标为准
    if (showTimer.current) {
      clearTimeout(showTimer.current);
    }

    if (!anchorElement) {
      return;
    }
    

    // 3. 启动一个新的计时器来显示卡片
    showTimer.current = window.setTimeout(() => {
      const rect = anchorElement.getBoundingClientRect();

      // --- 核心定位逻辑 (简单且可靠) ---
      const top = rect.bottom + 4; // 永远在目标下方 8px
      let left = rect.left;         // 默认与目标左侧对齐
      
      const cardWidth = 300;
      const rightEdge = window.innerWidth;
      const spacing = 8;

      // --- 边界检查 ---
      // 防止卡片超出屏幕右侧
      if (left + cardWidth > rightEdge - spacing) {
        left = rightEdge - cardWidth - spacing;
      }
      
      // 防止卡片超出屏幕左侧
      if (left < spacing) {
          left = spacing;
      }

      setCardPosition({ top, left });
      setIsCardVisible(true);
      fetchData(userId);
    }, HOVER_DELAY);
  }, [fetchData]);

    const handleMouseEnterForComment = useCallback((
    _event: React.MouseEvent,
    userId: string,
    anchorElement: HTMLElement | null
  ) => {
    // 1. 鼠标进入任何目标，立即取消任何将要隐藏卡片的计划
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    // 2. 取消任何正在等待显示的旧计划，以当前目标为准
    if (showTimer.current) {
      clearTimeout(showTimer.current);
    }

    if (!anchorElement) {
      return;
    }
    

    // 3. 启动一个新的计时器来显示卡片
    showTimer.current = window.setTimeout(() => {
      const rect = anchorElement.getBoundingClientRect();

      // --- 核心定位逻辑 (简单且可靠) ---
      const top = rect.bottom + 28; // 永远在目标下方 8px
      let left = rect.left - 56;         // 默认与目标左侧对齐
      
      const cardWidth = 300;
      const rightEdge = window.innerWidth;
      const spacing = 8;

      // --- 边界检查 ---
      // 防止卡片超出屏幕右侧
      if (left + cardWidth > rightEdge - spacing) {
        left = rightEdge - cardWidth - spacing;
      }
      
      // 防止卡片超出屏幕左侧
      if (left < spacing) {
          left = spacing;
      }

      setCardPosition({ top, left });
      setIsCardVisible(true);
      fetchData(userId);
    }, HOVER_DELAY);
  }, [fetchData]);

  const handleMouseEnterForPost = useCallback((
    _event: React.MouseEvent,
    userId: string,
    anchorElement: HTMLElement | null
  ) => {
    // 1. 鼠标进入任何目标，立即取消任何将要隐藏卡片的计划
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    // 2. 取消任何正在等待显示的旧计划，以当前目标为准
    if (showTimer.current) {
      clearTimeout(showTimer.current);
    }

    if (!anchorElement) {
      return;
    }
    

    // 3. 启动一个新的计时器来显示卡片
    showTimer.current = window.setTimeout(() => {
      const rect = anchorElement.getBoundingClientRect();

      // --- 核心定位逻辑 (简单且可靠) ---
      const top = rect.bottom + 8; // 永远在目标下方 8px
      let left = rect.left;         // 默认与目标左侧对齐
      
      const cardWidth = 300;
      const rightEdge = window.innerWidth;
      const spacing = 8;

      // --- 边界检查 ---
      // 防止卡片超出屏幕右侧
      if (left + cardWidth > rightEdge - spacing) {
        left = rightEdge - cardWidth - spacing;
      }
      
      // 防止卡片超出屏幕左侧
      if (left < spacing) {
          left = spacing;
      }

      setCardPosition({ top, left });
      setIsCardVisible(true);
      fetchData(userId);
    }, HOVER_DELAY);
  }, [fetchData]);

  const handleMouseLeave = useCallback(() => {
    // 鼠标离开任何目标（头像、用户名、或卡片本身），都启动隐藏程序
    
    // 1. 取消任何正在等待显示的计划
    if (showTimer.current) {
      clearTimeout(showTimer.current);
    }
    
    // 2. 启动一个计时器来隐藏卡片
    hideTimer.current = window.setTimeout(() => {
      setIsCardVisible(false);
    }, HIDE_DELAY);
  }, []);

  const handleCardMouseEnter = useCallback(() => {
    // 鼠标进入卡片本身，职责只有一个：取消隐藏计划
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
  }, []);

  return {
    isCardVisible,
    isLoading,
    previewData,
    cardPosition,
    handleMouseEnterForReply,
    handleMouseEnterForPost,
    handleMouseEnterForComment,
    handleMouseLeave,
    handleCardMouseEnter,
    handleCardMouseLeave: handleMouseLeave, // 离开卡片 = 离开目标，复用逻辑
  };
};