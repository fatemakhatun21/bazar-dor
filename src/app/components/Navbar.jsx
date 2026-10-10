"use client";

import { useState, useEffect } from "react";
import { Link, Button, Spinner } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import PriceTicker from "./PriceTicker";
import Image from "next/image";

const categoryNames = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  dimDudh: "ডিম-দুধ",
  mosla: "মসলা",
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");

  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories"
        );

        if (!response.ok) {
          throw new Error("Categories fetch failed");
        }

        const data = await response.json();

        setCategories(
          Array.isArray(data)
            ? data
            : Array.isArray(data.categories)
              ? data.categories
              : []
        );
      } catch (error) {
        console.error("Category error:", error);
      }
    }

    getCategories();
  }, []);

  const links = (
    <>
      {categories.map((category) => {
        const slug =
          typeof category === "string"
            ? category
            : category.slug;

        if (!slug) return null;

        const name =
          typeof category === "string"
            ? categoryNames[slug] || slug
            : category.nameBn ||
            categoryNames[slug] ||
            category.name ||
            slug;

        const isActive = pathname === `/category/${slug}`;

        return (
          <li key={slug}>
            <Link
              href={`/category/${slug}`}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                ? "bg-green-700 font-semibold text-white"
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </>
  );

  const authLinks = (
    <>
      {isPending ? (
        <Spinner size="sm" />
      ) : session?.user ? (
        <>
          <Link
            href="/profile"
            className="text-sm font-medium text-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            {session.user.name || "আমার প্রোফাইল"}
          </Link>

          <Button
            size="sm"
            variant="bordered"
            onPress={async () => {
              await signOut();
              setIsMenuOpen(false);
            }}
          >
            সাইন আউট
          </Button>
        </>
      ) : (
        <>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-700 hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            সাইন ইন
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            onClick={() => setIsMenuOpen(false)}
          >
            সাইন আপ
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg">

      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={44}
              height={44}
              className="shrink-0 object-contain"
            />

            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-lg leading-6 font-bold text-[#173B2B]">
                বাজার দর
              </span>

              <span className="text-[11px] leading-4 text-gray-500">
                {date}
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {authLinks}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      <div className="hidden border-t border-gray-100 md:block">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4">
          {links}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <ul className="flex flex-col gap-4 px-5 py-5">
            {links}
          </ul>

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-5 py-5">
            {authLinks}
          </div>
        </div>
      )}
      <PriceTicker />
    </nav>
  );
}