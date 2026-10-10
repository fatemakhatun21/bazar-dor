"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending, refetch } = useSession();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const user = session?.user;

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
        } catch (error) {
            console.error(error);
            toast.error("কিছু একটা সমস্যা হয়েছে");
        } finally {
            setSaving(false);
        }
    }

    async function handleSignOut() {
        setSigningOut(true);

        try {
            const { error } = await signOut();

            if (error) {
                toast.error(error.message || "সাইন আউট করা যায়নি");
                return;
            }

            toast.success("সফলভাবে সাইন আউট হয়েছে");
            router.replace("/");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("সাইন আউট করতে সমস্যা হয়েছে");
        } finally {
            setSigningOut(false);
        }
    }

    if (isPending || !user) {
        return (
            <section className="min-h-screen bg-[#f2f7f3] px-4 py-10">
                <div className="mx-auto max-w-6xl space-y-5">
                    <div className="skeleton h-14 w-64" />
                    <div className="skeleton h-28 max-w-2xl rounded-2xl" />
                    <div className="skeleton h-52 max-w-2xl rounded-2xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f2f7f3] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-6xl">

                <div className="mx-auto mb-6 max-w-2xl">
                    <h1 className="text-2xl font-bold text-[#24342A]">
                        আমার প্রোফাইল
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                <div className="mx-auto max-w-2xl space-y-5">

                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-100">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt="প্রোফাইল ছবি"
                                            width={64}
                                            height={64}
                                            unoptimized
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-green-700">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="break-words text-lg font-bold text-gray-900">
                                        {user.name}
                                    </h2>

                                    <p className="break-all text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={signingOut}
                                className="self-start rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:self-auto"
                            >
                                {signingOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
                            </button>

                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                        <h2 className="mb-6 text-lg font-bold text-[#24342A]">
                        আপডেট
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
                                {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
