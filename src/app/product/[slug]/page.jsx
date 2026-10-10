
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API = "https://api.abcz.workers.dev/api/bazardor";

const units = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
};

const toBn = (value) =>
    Number(value).toLocaleString("bn-BD");

export default function ProductDetails({ params }) {
    const { slug } = use(params);
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user) {
            toast.error("বিস্তারিত দাম দেখতে আগে সাইন ইন করুন", {
                id: "product-login-required",
            });

            router.replace("/sign-in");
        }
    }, [isPending, session?.user, router]);

    useEffect(() => {
        if (isPending || !session?.user) return;

        const controller = new AbortController();

        async function getProduct() {
            setLoading(true);
            setError(false);
            setProduct(null);

            try {
                const response = await fetch(`${API}/products/${slug}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Product fetch failed");
                }

                const data = await response.json();
                if (!data || Array.isArray(data)) {
                    throw new Error("Invalid product");
                }

                setProduct(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        getProduct();

        return () => controller.abort();
    }, [slug, isPending, session?.user?.id]);

    if (isPending || !session?.user || loading) {
        return (
            <section className="min-h-screen bg-[#f2f7f3] px-4 py-8">
                <div className="mx-auto max-w-6xl space-y-5">
                    <div className="skeleton h-5 w-56" />
                    <div className="skeleton h-36 rounded-2xl" />
                    <div className="skeleton h-80 rounded-2xl" />
                </div>
            </section>
        );
    }

    if (error || !product) {
        return (
            <section className="min-h-[60vh] bg-[#f2f7f3] px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    পণ্যের তথ্য পাওয়া যায়নি
                </h1>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-white"
                >
                    হোম পেজে ফিরে যান
                </Link>
            </section>
        );
    }

    const markets = Array.isArray(product.markets)
        ? product.markets
        : [];

    const today = Number(product.today) || 0;
    const yesterday = Number(product.yesterday) || 0;

    const minPrice = markets.length
        ? Math.min(...markets.map((market) => Number(market.min)))
        : today;

    const maxPrice = markets.length
        ? Math.max(...markets.map((market) => Number(market.max)))
        : today;

    const avgPrice = markets.length
        ? markets.reduce(
            (sum, market) =>
                sum + (Number(market.min) + Number(market.max)) / 2,
            0
        ) / markets.length
        : today;

    const changeDir = product.change?.dir;
    const changePct = Number(product.change?.pct) || 0;

    const isUp = changeDir === "up";
    const isDown = changeDir === "down";

    const changeColor = isUp
        ? "text-red-600"
        : isDown
            ? "text-green-600"
            : "text-gray-500";

    const arrow = isUp ? "▲" : isDown ? "▼" : "—";

    const unit = units[product.unit] || product.unit;

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-6xl space-y-5">

                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-xs text-gray-600"
                >
                    <Link href="/" className="hover:text-green-700">
                        হোম
                    </Link>

                    <span>›</span>

                    <Link
                        href={`/category/${product.category}`}
                        className="hover:text-green-700"
                    >
                        {product.categoryNameBn || product.category}
                    </Link>

                    <span>›</span>

                    <span className="font-medium text-gray-800">
                        {product.nameBn}
                    </span>
                </nav>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f3] text-4xl">
                                {product.image}
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {product.nameBn}
                                </h1>

                                <p className="mt-1 text-xs text-gray-500">
                                    প্রতি {unit} · {product.categoryNameBn}
                                </p>

                                <p className="mt-2 text-xs text-gray-600">
                                    গতকালের তুলনায় আজ দাম{" "}
                                    {isUp
                                        ? "বেড়েছে"
                                        : isDown
                                            ? "কমেছে"
                                            : "অপরিবর্তিত রয়েছে"}
                                    {yesterday > 0 && (
                                        <> · {toBn(Math.abs(today - yesterday))} টাকা</>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="w-fit min-w-28 rounded-xl bg-[#f2f7f3] px-4 py-3 text-center sm:ml-auto">
                            <p className="text-xs text-gray-500">আজকের দাম</p>

                            <p className="mt-1 text-3xl font-bold text-gray-900">
                                {toBn(today)}
                            </p>

                            <p className="text-xs text-gray-500">
                                টাকা / {unit}
                            </p>

                            <p className={`mt-1 text-xs font-semibold ${changeColor}`}>
                                {arrow} {toBn(changePct)}%
                            </p>
                        </div>

                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">

                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            {
                                title: "সর্বনিম্ন দাম",
                                value: minPrice,
                                color: "text-green-700",
                                description: "সবচেয়ে কম দামের বাজার",
                            },
                            {
                                title: "সর্বোচ্চ দাম",
                                value: maxPrice,
                                color: "text-red-600",
                                description: "সবচেয়ে বেশি দামের বাজার",
                            },
                            {
                                title: "গড় দাম",
                                value: avgPrice,
                                color: "text-green-700",
                                description: "প্রতি কেজি/ইউনিটের হিসাবে",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-gray-200 p-4"
                            >
                                <p className="text-xs text-gray-600">
                                    {item.title}
                                </p>

                                <p
                                    className={`mt-1 text-xl font-bold ${item.color}`}
                                >
                                    {toBn(Math.round(item.value))} টাকা
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <h2 className="mb-4 mt-6 text-lg font-bold text-gray-900">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="table w-full">
                            <thead className="bg-[#f2f7f3]">
                                <tr className="text-gray-700">
                                    <th>বাজার</th>
                                    <th>বিভাগ</th>
                                    <th>সর্বনিম্ন</th>
                                    <th>সর্বোচ্চ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {markets.map((market, index) => (
                                    <tr key={index} className="text-gray-700">
                                        <td>{market.market}</td>
                                        <td>{market.division}</td>
                                        <td className="font-medium text-green-700">
                                            {toBn(market.min)} টাকা
                                        </td>
                                        <td className="font-medium text-red-600">
                                            {toBn(market.max)} টাকা
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {markets.length === 0 && (
                            <p className="py-8 text-center text-sm text-gray-500">
                                বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
