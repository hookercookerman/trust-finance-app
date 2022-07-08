import Advantages from "components/Home/Advantages";
import Features from "components/Home/Features";
import Hero from "components/Home/Hero";
import Pricing from "components/Home/Pricing";
import HomepageContext from "Contexts/HomepageContext";
import { useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HomeBody() {
  const { isBusinessMode } = useContext(HomepageContext);

  return (
    <>
      <Hero isBusinessMode={isBusinessMode} />
      <Advantages />
      <Features isBusinessMode={isBusinessMode} />
      <Pricing />
    </>
  );
}
