import { HomePageWrapper } from "Contexts/HomepageContext";
import HomeBody from "./components/Layout/HomeBody";
import HomeNavbar from "./components/Layout/HomeNavbar";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

function App() {

  return (
    <HomePageWrapper>
      <HomeNavbar />
      <HomeBody />
    </HomePageWrapper>
  );
}

export default App;
