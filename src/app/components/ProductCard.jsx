
"use client";

import Link from "next/link";

const units = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
};

const toBn = (number) =>
    Number(number).toLocaleString("bn-BD");

export default function ProductCard({ product }) {
    const { change } = product;

    const badgeStyle =
        change?.dir === "up"
            ? "bg-green-50 text-green-700"
            : change?.dir === "down"
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-500";

    return (
        <Link
            href={`/product/${product.slug}`}
            className="block h-full"
        >
            <div className="card h-full rounded-xl border border-gray-200 bg-white shadow-none transition-all hover:border-green-200 hover:shadow-md">
                <div className="card-body gap-0 p-4">

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f3] text-3xl">
                            {product.image}
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                {product.nameBn}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                প্রতি {units[product.unit] || product.unit}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-500">
                            আজকের দাম
                        </p>

                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-lg font-bold text-gray-900">
                                {toBn(product.today)} টাকা
                            </span>

                            <span
                                className={`badge border-0 px-3 py-3 text-xs font-semibold ${badgeStyle}`}
                            >
                                {change?.dir === "up"
                                    ? "▲"
                                    : change?.dir === "down"
                                        ? "▼"
                                        : "—"}{" "}
                                {toBn(change?.pct ?? 0)}%
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
}
