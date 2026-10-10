"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function PriceIncrease() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await fetch(
                    "https://api.api-store.workers.dev/api/bazardor/products"
                );

                if (!response.ok) {
                    throw new Error("Products fetch failed");
                }

                const data = await response.json();

                const allProducts = Array.isArray(data)
                    ? data
                    : data.products ?? [];

                const increasedProducts = allProducts
                    .filter((product) => product.change?.dir === "up")
                    .sort((a, b) => b.change.pct - a.change.pct)
                    .slice(0, 6);

                setProducts(increasedProducts);
            } catch (error) {
                console.error("Products fetch error:", error);
            }
        }

        getProducts();
    }, []);

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
                আজ দাম বেড়েছে ▲
            </h2>

            <p className="mt-2 text-gray-600">
                আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
            </p>

            <p className="mt-5 text-sm text-gray-500">
                পাওয়া গেছে: {products.length.toLocaleString("bn-BD")}টি পণ্য
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}