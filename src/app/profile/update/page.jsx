
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        setName(session.user.name || "");
    }, [isPending, session?.user?.id, session?.user?.name, router]);

    async function handleUpdate(e) {
        e.preventDefault();

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("নাম লিখুন");
            return;
        }

        setSaving(true);

        try {
            const { error } = await authClient.updateUser({
                name: updatedName,
            });

            if (error) {
                toast.error(error.message || "নাম পরিবর্তন করা যায়নি");
                return;
            }

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");
            router.push("/profile");
            router.refresh();
        } catch {
            toast.error("কিছু একটা সমস্যা হয়েছে");
        } finally {
            setSaving(false);
        }
    }

    if (isPending || !session?.user) {
        return (
            <div className="mx-auto max-w-xl px-4 py-16">
                <div className="skeleton h-80 rounded-2xl" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-12">
            <div className="mx-auto max-w-xl">
                <div className="card border border-gray-200 bg-white shadow-sm">
                    <div className="card-body">
                        <h1 className="text-2xl font-bold text-gray-900">
                            প্রোফাইল আপডেট করুন
                        </h1>

                        <p className="text-sm text-gray-500">
                            এখানে আপনার নাম পরিবর্তন করতে পারবেন।
                        </p>

                        <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block font-medium text-gray-900"
                                >
                                    পূর্ণ নাম
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    maxLength={100}
                                    className="input w-full border border-gray-300 bg-white text-gray-900"
                                    placeholder="আপনার নাম লিখুন"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-900">
                                    ইমেইল
                                </label>

                                <input
                                    type="email"
                                    value={session.user.email}
                                    disabled
                                    className="input w-full border border-gray-300 bg-gray-100 text-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-success w-full text-white"
                            >
                                {saving ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
                            </button>

                            <Link
                                href="/profile"
                                className="btn btn-ghost w-full"
                            >
                                বাতিল করুন
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
