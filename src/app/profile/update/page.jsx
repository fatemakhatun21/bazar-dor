"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
    const router = useRouter();
    const { data: session, isPending, refetch } = useSession();

    const user = session?.user;
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/sign-in");
        }
    }, [isPending, user, router]);

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user?.name]);

    async function handleUpdate(e) {
        e.preventDefault();

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("আপনার নাম লিখুন");
            return;
        }

        if (updatedName === user?.name) {
            toast.error("নাম পরিবর্তন করা হয়নি");
            return;
        }

        setSaving(true);

        try {
            const { error } = await authClient.updateUser({
                name: updatedName,
            });

            if (error) {
                toast.error(error.message || "নাম আপডেট করা যায়নি");
                return;
            }

            await refetch();
            toast.success("নাম সফলভাবে আপডেট হয়েছে");
            router.push("/profile");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("কিছু একটা সমস্যা হয়েছে");
        } finally {
            setSaving(false);
        }
    }

    if (isPending || !user) {
        return (
            <section className="min-h-screen bg-[#f2f7f3] px-4 py-10">
                <div className="mx-auto max-w-2xl space-y-5">
                    <div className="skeleton h-14 w-64" />
                    <div className="skeleton h-52 rounded-2xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-2xl font-bold text-[#24342A]">
                    প্রোফাইল আপডেট
                </h1>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                    <h2 className="mb-6 text-lg font-bold text-[#24342A]">
                        তথ্য পরিবর্তন করুন
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                নাম
                            </label>

                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={100}
                                required
                                placeholder="আপনার নাম লিখুন"
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50"
                        >
                            {saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => router.push("/profile")}
                        className="mt-4 w-full rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ← প্রোফাইলে ফিরে যান 
                    </button>
                </div>
            </div>
        </section>
    );
}
