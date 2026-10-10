
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";

const API = "https://api.abcz.workers.dev/api/bazardor";

export default function CategoryPage({ params }) {
    const { slug } = use(params);

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sort, setSort] = useState("default");

    useEffect(() => {
        async function getCategoryProducts() {
            setLoading(true);
            setError(false);
            setCategory(null);
            setProducts([]);

            try {
                const response = await fetch(
                    `${API}/products?category=${encodeURIComponent(slug)}`
                );

                if (!response.ok) {
                    throw new Error("Products fetch failed");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid API response");
                }

                setProducts(data);

                if (data.length > 0) {
                    setCategory({
                        nameBn: data[0].categoryNameBn,
                        icon: data[0].categoryIcon,
                    });
                }
            } catch (err) {
                console.error("Category API Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        getCategoryProducts();
    }, [slug]);

    const sortedProducts = [...products].sort((a, b) => {
        const priceA = Number(a.today);
        const priceB = Number(b.today);

        if (sort === "low") return priceA - priceB;
        if (sort === "high") return priceB - priceA;

        return 0;
    });

    if (loading) {
        return (
            <section className="min-h-screen bg-[#f2f7f3] px-4 py-8">
                <div className="mx-auto max-w-6xl">
                    <div className="skeleton mb-5 h-24 w-full rounded-2xl" />
                    <div className="skeleton mb-6 h-16 w-full rounded-2xl" />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="skeleton h-64 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto max-w-6xl px-6 py-24 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    সার্ভার সাময়িকভাবে অনুপলব্ধ
                </h1>

                <p className="mt-3 text-gray-500">
                    পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="btn btn-success mt-6 text-white"
                >
                    আবার চেষ্টা করুন
                </button>
            </section>
        );
    }

    if (!category) {
        return (
            <section className="mx-auto max-w-6xl px-6 py-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    ৪০৪ — ক্যাটাগরি পাওয়া যায়নি
                </h1>

                <p className="mt-3 text-gray-500">
                    আপনি যে ক্যাটাগরি খুঁজছেন সেটি পাওয়া যায়নি।
                </p>

                <Link href="/" className="btn btn-success mt-6 text-white">
                    হোম পেজে ফিরে যান
                </Link>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-6xl">

                <div className="mb-5 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                    <span className="text-4xl">
                        {category.icon || "🛒"}
                    </span>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {category.nameBn || slug}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <label
                        htmlFor="category-sort"
                        className="text-sm text-gray-600"
                    >
                        সাজান
                    </label>

                    <select
                        id="category-sort"
                        className="h-10 w-44 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-green-600"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low">দাম: কম থেকে বেশি</option>
                        <option value="high">দাম: বেশি থেকে কম</option>
                    </select>
                </div>

                <p className="mb-4 text-sm text-gray-500">
                    মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
