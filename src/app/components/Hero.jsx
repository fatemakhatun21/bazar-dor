
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(
            new Intl.DateTimeFormat("bn-BD", {
                timeZone: "Asia/Dhaka",
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date())
        );
    }, []);

    return (
        <section className="bg-[#f3f8f4] px-4 py-6 sm:px-6">
            <div className="mx-auto grid max-w-6xl items-center gap-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 md:grid-cols-[1.6fr_1fr]">

                <div className="flex flex-col items-start">

                    <span className="mb-3 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {date || "আজকের বাজারদর"}
                    </span>

                    <h1 className="text-2xl font-bold leading-tight text-[#24342A] sm:text-3xl">
                        আজকের বাজারদর এক নজরে
                    </h1>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ
                        এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <a
                        href="#সব-পণ্য"
                        className="mt-5 inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                    >
                        সব পণ্য দেখুন
                    </a>

                </div>

                <div className="flex items-center justify-center md:justify-end">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
                        width={250}
                        height={200}
                        className="h-auto w-full max-w-[210px] object-contain sm:max-w-[240px]"
                        priority
                    />
                </div>

            </div>
        </section>
    );
}
