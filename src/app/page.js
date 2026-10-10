import Hero from "./components/Hero";
import PriceIncrease from "./components/PriceIncrease";
import PriceDecrease from "./components/PriceDecrease";
import AllProducts from "./components/AllProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <PriceIncrease />
      <PriceDecrease />
      <AllProducts />
    </>
  );
}
