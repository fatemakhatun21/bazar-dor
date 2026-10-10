
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import PriceTicker from "./PriceTicker";

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

const categoryIcons = {
  chal: "🍚",
  dal: "🫘",
  tel: "🛢️",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍗",
  dimDudh: "🥛",
  mosla: "🌶️",
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

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
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        if (!response.ok) {
          throw new Error("Categories fetch failed");
        }

        const data = await response.json();

        setCategories(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.categories)
              ? data.categories
              : []
        );
      } catch (error) {
        console.error("Category error:", error);
      }
    }

    getCategories();
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        console.error("Sign out error:", error);
        return;
      }

      setIsProfileOpen(false);
      setIsMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setSigningOut(false);
    }
  }

  const avatar = (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-bold text-green-700">
      {user?.image ? (
        <Image
          src={user.image}
          alt="প্রোফাইল ছবি"
          width={36}
          height={36}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        user?.name?.charAt(0).toUpperCase() || "U"
      )}
    </span>
  );

  const links = categories.map((category) => {
    const slug =
      typeof category === "string" ? category : category.slug;

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
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
            ? "bg-green-700 font-semibold text-white"
            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
        >
          <span>{categoryIcons[slug]}</span>
          <span>{name}</span>
        </Link>
      </li>
    );
  });

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">

      <header className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >

          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#008A45]">
            <div className="relative h-5 w-5">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={20}
                height={20}
                priority
                className="h-5 w-5 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold leading-6 text-[#173B2B]">
              বাজার দর
            </span>

            <span className="text-[11px] leading-4 text-gray-500">
              {date}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                aria-controls="profile-dropdown"
                className="flex max-w-[230px] items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
              >
                {avatar}

                <span className="max-w-[140px] truncate text-sm font-medium text-gray-800">
                  {user.name || "আমার প্রোফাইল"}
                </span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                    }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  id="profile-dropdown"
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
                >
                  <div className="border-b border-gray-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>

                    আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 17l5-5-5-5" />
                      <path d="M15 12H3" />
                      <path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" />
                    </svg>

                    {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-green-700"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
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
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-start gap-x-1 gap-y-2 px-4 py-3 sm:px-6">
          {links}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <ul className="flex flex-col gap-2 px-5 py-4">
            {links}
          </ul>

          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4">
            {isPending ? (
              <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
            ) : user ? (
              <>
                <div className="flex items-center gap-3">
                  {avatar}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  আমার প্রোফাইল
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-gray-700"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-fit rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <PriceTicker />
    </nav>
  );
}
