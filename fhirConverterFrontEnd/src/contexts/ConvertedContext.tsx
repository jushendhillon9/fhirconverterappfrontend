import * as React from "react";

export type ConvertedContextValue = {
  isConverted: boolean;
  setIsConverted: (v: boolean) => void;
};

export const ConvertedContext =
  React.createContext<ConvertedContextValue | undefined>(undefined);

export function ConvertedProvider({ children }: { children: React.ReactNode }) {
  const [isConverted, setIsConverted] = React.useState(false);
  const value = React.useMemo(() => ({ isConverted, setIsConverted }), [isConverted]);
  return <ConvertedContext.Provider value={value}>{children}</ConvertedContext.Provider>;
}

export function useConverted() {
  const ctx = React.useContext(ConvertedContext);
  if (!ctx) throw new Error("useConverted must be used within <ConvertedProvider>");
  return ctx;
}
