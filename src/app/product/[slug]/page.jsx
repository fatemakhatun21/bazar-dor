"use client";

import { use, useEffect, useState, useRef } from "react";
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
    const redirectToastShown = useRef(false);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user) {
            if (!redirectToastShown.current) {
                redirectToastShown.current = true;

                toast.error("বিস্তারিত দাম দেখতে আগে সাইন ইন করুন", {
                    id: "product-login-required",
                });
            }

            router.replace("/sign-in");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (isPending || !session?.user) return;

        async function getProduct() {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch(`${API}/products/${slug}`);

                if (!response.ok) throw new Error("Fetch failed");

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        getProduct();
    }, [slug, isPending, session?.user?.id]);

    if (isPending || !session?.user || loading) {
        return (
            <div className="mx-auto max-w-6xl space-y-5 px-6 py-10">
                <div className="skeleton h-40 rounded-2xl" />
                <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-28 rounded-xl" />
                    ))}
                </div>
                <div className="skeleton h-64 rounded-xl" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    পণ্যের তথ্য পাওয়া যায়নি
                </h1>
                <Link href="/" className="btn btn-success mt-6 text-white">
                    হোম পেজে ফিরে যান
                </Link>
            </div>
        );
    }

    const markets = product.markets ?? [];
    const minPrice = markets.length
        ? Math.min(...markets.map((m) => m.min))
        : product.today;
    const maxPrice = markets.length
        ? Math.max(...markets.map((m) => m.max))
        : product.today;
    const avgPrice = markets.length
        ? markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) /
        markets.length
        : product.today;

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-8">
            <div className="mx-auto max-w-6xl space-y-6">

                <div className="card border border-gray-200 bg-white">
                    <div className="card-body">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">{product.image}</span>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {product.nameBn}
                                </h1>
                                <p className="mt-2 text-sm text-gray-500">
                                    আজকের বাজারদরের বিস্তারিত তথ্য
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <span className="badge badge-success">
                                        {product.categoryNameBn}
                                    </span>
                                    <span className="badge badge-ghost">
                                        প্রতি {units[product.unit] || product.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { title: "সর্বনিম্ন দাম", value: minPrice },
                        { title: "সর্বোচ্চ দাম", value: maxPrice },
                        { title: "গড় দাম", value: avgPrice },
                    ].map((item) => (
                        <div key={item.title} className="card bg-white shadow-sm">
                            <div className="card-body gap-2">
                                <p className="text-sm text-gray-500">{item.title}</p>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {toBn(Math.round(item.value))} টাকা
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Market Prices */}
                <div className="card bg-white shadow-sm">
                    <div className="card-body">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            বাজারভিত্তিক আজকের দাম
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
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
                                            <td>{toBn(market.min)} টাকা</td>
                                            <td>{toBn(market.max)} টাকা</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
