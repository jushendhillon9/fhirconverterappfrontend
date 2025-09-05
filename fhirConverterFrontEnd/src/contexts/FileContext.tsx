import * as React from "react";

export type FileContextValue = {
  file: Blob | File | null;                 // accept Blob or File
  setFile: (f: Blob | File | null) => void; // setter typed accordingly
};

export const FileContext =
  React.createContext<FileContextValue | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = React.useState<Blob | File | null>(null);
  const value = React.useMemo(() => ({ file, setFile }), [file]);
  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFile() {
  const ctx = React.useContext(FileContext);
  if (!ctx) throw new Error("useFile must be used within <FileProvider>");
  return ctx;
}
