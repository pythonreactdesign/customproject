import { createContext, ReactNode, useState, useEffect, useMemo } from 'react';

interface Props {
  children: ReactNode;
}

interface Context {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const MobileContext = createContext<Context>({
  isMobile: false,
  setIsMobile: () => null,
});

export const MobileProvider: React.FC<Props> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(typeof ontouchstart !== 'undefined');

  useEffect(() => {
    setIsMobile(typeof ontouchstart !== 'undefined');
  }, [typeof ontouchstart]);

  const contextValue = useMemo(() => ({ isMobile, setIsMobile }), [isMobile]);

  return <MobileContext.Provider value={contextValue}>{children}</MobileContext.Provider>;
};
