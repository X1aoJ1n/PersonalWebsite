import React, { createContext, useContext } from 'react';

export type ConfirmSetter = (config: {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  confirmColor?: 'primary' | 'danger';
}) => void;

interface PostPageContextType {
  setConfirm: ConfirmSetter;
}
const PostPageContext = createContext<PostPageContextType | undefined>(undefined);

export const usePostPage = () => {
  const context = useContext(PostPageContext);
  if (context === undefined) {
    throw new Error('usePostPage 必须在 PostPageProvider 内部使用');
  }
  return context;
};

export const PostPageProvider = PostPageContext.Provider;