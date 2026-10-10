
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#f2f7f3] px-4 py-16">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-extrabold text-green-700">
          404
        </h1>

        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h2>

        <p className="mt-4 text-gray-600">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
          অনুগ্রহ করে হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="btn btn-success mt-8 text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
