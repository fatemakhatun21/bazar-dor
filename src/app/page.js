import Hero from "./components/Hero";
import PriceIncrease from "./components/PriceIncrease";
import PriceDecrease from "./components/PriceDecrease";

export default function Home() {
  return (
    <>
      <Hero />
      <PriceIncrease />
      <PriceDecrease />
      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          সব পণ্য
        </h2>
      </section>
    </>
  );
}
