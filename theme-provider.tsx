import { ThemeProvider as ThemeProviderHook } from "@/hooks/use-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeProviderHook defaultTheme="light" storageKey="socialsphere-theme">
      {children}
    </ThemeProviderHook>
  );
}
