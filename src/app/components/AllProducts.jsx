"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/products"
                );

                if (!response.ok) throw new Error("API Error");

                const data = await response.json();

                setProducts(
                    Array.isArray(data) ? data : data.products ?? []
                );
            } catch (error) {
                console.error("Products error:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    const sortedProducts = useMemo(() => {
        const result = [...products];

        if (sortBy === "low") {
            result.sort((a, b) => Number(a.today) - Number(b.today));
        }

        if (sortBy === "high") {
            result.sort((a, b) => Number(b.today) - Number(a.today));
        }

        return result;
    }, [products, sortBy]);

    return (
        <section
            id="সব-পণ্য"
            className="mx-auto max-w-6xl scroll-mt-48 px-6 py-12"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        সব পণ্য
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {loading
                            ? "পণ্য লোড হচ্ছে..."
                            : `মোট ${products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে`}
                    </p>
                </div>


                <div className="flex items-center gap-2">
                    <label
                        htmlFor="product-sort"
                        className="whitespace-nowrap text-xs font-medium text-gray-500"
                    >
                        সাজান
                    </label>

                    <select
                        id="product-sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pr-8 text-xs font-medium text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low">দাম: কম থেকে বেশি</option>
                        <option value="high">দাম: বেশি থেকে কম</option>
                    </select>
                </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="skeleton h-64 w-full"
                        />
                    ))
                    : sortedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
            </div>

            {!loading && error && (
                <p className="py-10 text-center text-red-600">
                    পণ্যের তথ্য লোড করা যায়নি।
                </p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="py-10 text-center text-gray-500">
                    কোনো পণ্য পাওয়া যায়নি।
                </p>
            )}
        </section>
    );
}
