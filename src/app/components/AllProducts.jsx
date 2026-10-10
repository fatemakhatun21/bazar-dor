
"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();

        setProducts(
          Array.isArray(data) ? data : data.products ?? []
        );
      } catch (error) {
        console.error("Products error:", error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  return (
    <section
      id="সব-পণ্য"
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        সব পণ্য
      </h2>

      <p className="mt-2 text-gray-600">
        নিত্যপ্রয়োজনীয় সকল পণ্যের আজকের বাজারদর
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="skeleton h-64 w-full"
              />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="py-10 text-center text-gray-500">
          কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}
