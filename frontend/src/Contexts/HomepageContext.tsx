import { createContext, useCallback, useState } from "react";

interface HomePageContext {
  theme: string;
  isBusinessMode: boolean;
  changeTheme: () => void;
}

const HomepageContext = createContext<HomePageContext | null>(null);

export function HomePageWrapper({ children }) {
  const [theme, setTheme] = useState("business");

  const isBusinessMode = theme === "business";

  const changeTheme = useCallback(() => {
    if (isBusinessMode) {
      setTheme("personal");
    } else {
      setTheme("business");
    }
  }, [setTheme, isBusinessMode]);

  return (
    <HomepageContext.Provider value={{ theme, isBusinessMode, changeTheme }}>
      {children}
    </HomepageContext.Provider>
  );
}

export default HomepageContext;
