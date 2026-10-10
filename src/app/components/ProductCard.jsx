
"use client";

import Link from "next/link";

const units = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
};

export default function ProductCard({ product }) {
    const { change } = product;

    const toBn = (number) => Number(number).toLocaleString("bn-BD");

    return (
        <Link href={`/product/${product.slug}`}>
            <div className="card h-full border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="card-body gap-3 p-5">
                    <div className="text-5xl">{product.image}</div>

                    <h3 className="text-lg font-bold text-gray-900">
                        {product.nameBn}
                    </h3>

                    <p className="text-sm text-gray-500">
                        প্রতি {units[product.unit] || product.unit}
                    </p>

                    <div className="mt-2 border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-500">আজকের দাম</p>

                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xl font-bold text-gray-900">
                                {toBn(product.today)} টাকা
                            </span>

                            <span
                                className={`badge ${change?.dir === "up"
                                        ? "badge-success"
                                        : change?.dir === "down"
                                            ? "badge-error"
                                            : "badge-ghost"
                                    }`}
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
