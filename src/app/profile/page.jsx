
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session?.user, router]);

  if (isPending || !session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  const user = session.user;

  return (
    <section className="min-h-screen bg-[#f2f7f3] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          আমার প্রোফাইল
        </h1>

        <div className="card border border-gray-200 bg-white shadow-sm">
          <div className="card-body items-center text-center">

            <div className="avatar">
              <div className="w-24 rounded-full bg-green-100">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="প্রোফাইল ছবি"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-green-700">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {user.name}
            </h2>

            <p className="text-gray-500">{user.email}</p>

            <div className="divider my-6 w-full" />

            <div className="w-full space-y-4 text-left">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">পূর্ণ নাম</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">ইমেইল ঠিকানা</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href="/profile/update"
              className="btn btn-success mt-6 text-white"
            >
              তথ্য পরিবর্তন করুন
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
