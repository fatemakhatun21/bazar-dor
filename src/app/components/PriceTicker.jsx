
"use client";

import { useEffect, useState } from "react";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

const unitNames = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
};

const toBangla = (value) =>
    Number(value).toLocaleString("bn-BD");

export default function PriceTicker() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Products fetch failed");
                }

                const data = await response.json();

                setProducts(
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.products)
                            ? data.products
                            : []
                );
            } catch (error) {
                console.error("Price ticker error:", error);
            }
        }

        getProducts();
    }, []);

    if (products.length === 0) return null;

    const tickerItems = products.map((product) => {
        const direction = product.change?.dir;
        const percentage = product.change?.pct ?? 0;

        return (
            <span
                key={product.id}
                className="inline-flex shrink-0 items-center gap-2 px-5 text-sm text-gray-800"
            >
                <span>{product.image}</span>

                <span className="font-medium text-gray-900">
                    {product.nameBn}
                </span>

                <span className="text-gray-700">
                    {toBangla(product.today)}
                    {unitNames[product.unit] || product.unit}
                </span>

                <span
                    className={
                        direction === "up"
                            ? "font-semibold text-green-600"
                            : direction === "down"
                                ? "font-semibold text-red-600"
                                : "text-gray-500"
                    }
                >
                    {direction === "up"
                        ? "▲"
                        : direction === "down"
                            ? "▼"
                            : "—"}{" "}
                    {toBangla(percentage)}%
                </span>
            </span>
        );
    });

    return (
        <div className="overflow-hidden border-t border-green-100 bg-green-50 py-3">
            <div className="ticker-track flex w-max">
                <div className="flex shrink-0 items-center">
                    {tickerItems}
                </div>

                <div
                    className="flex shrink-0 items-center"
                    aria-hidden="true"
                >
                    {tickerItems}
                </div>
            </div>
        </div>
    );
}
