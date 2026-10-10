
"use client";

import Image from "next/image";
import { Button } from "@heroui/react";

export default function Hero() {
    return (
        <section className="bg-[#f3f8f4]">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">

                <div className="space-y-5">
                    <p className="text-sm font-semibold text-green-700">
                        🟢 আজকের বাজারদর এক নজরে
                    </p>

                    <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                        বাজারের সঠিক দাম,
                        <br />
                        আপনার হাতের মুঠোয়
                    </h1>

                    <p className="text-gray-600">
                        চাল, ডাল, তেল, মাছ, মাংসসহ নিত্যপ্রয়োজনীয়
                        পণ্যের সর্বশেষ বাজারদর জানুন সহজেই।
                    </p>

                    <Button
                        as="a"
                        href="#সব-পণ্য"
                        size="lg"
                        className="bg-green-700 text-white"
                    >
                        সব পণ্যের দাম দেখুন →
                    </Button>
                </div>

                <div className="flex justify-center">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
                        width={500}
                        height={400}
                        className="h-auto w-full max-w-[450px] object-contain"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
