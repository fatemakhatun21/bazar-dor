"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });

      if (error) {
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড ভুল!");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
        setSocialLoading(null);
      }
    } catch {
      toast.error("লগইন করতে সমস্যা হয়েছে।");
      setSocialLoading(null);
    }
  };

  return (
    <section className="min-h-[70vh] bg-[#f2f7f3] px-4 py-10 sm:py-12">

      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold text-[#1f2d24]">
          সাইন ইন
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-[#e0e8e2] bg-white p-6 shadow-sm">

        <Form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-4"
        >
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full">
            <Label className="text-sm font-medium text-[#25332a]">
              ইমেইল
            </Label>

            <Input
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#e0e8e2] bg-white px-3 py-2.5 text-sm text-gray-900"
            />

            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            className="w-full"
          >
            <Label className="text-sm font-medium text-[#25332a]">
              পাসওয়ার্ড
            </Label>

            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-[#e0e8e2] bg-white px-3 py-2.5 text-sm text-gray-900"
            />

            <FieldError />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading || !!socialLoading}
            className="mt-1 w-full rounded-lg bg-[#008A45] py-3 font-semibold text-white shadow-sm"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </Button>
        </Form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

          <Button
            type="button"
            variant="bordered"
            isDisabled={loading || !!socialLoading}
            onPress={() => handleSocialLogin("google")}
            className="w-full rounded-lg border border-[#e0e8e2] bg-white px-2 text-xs font-medium text-gray-800"
          >
            <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.83 7.18l7.73 6C44.36 38.03 46.98 31.89 46.98 24.55z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.87 23.87 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>

            {socialLoading === "google"
              ? "অপেক্ষা করুন..."
              : "Google দিয়ে চালিয়ে যান"}
          </Button>

          <Button
            type="button"
            variant="bordered"
            isDisabled={loading || !!socialLoading}
            onPress={() => handleSocialLogin("github")}
            className="w-full rounded-lg border border-[#e0e8e2] bg-white px-2 text-xs font-medium text-gray-800"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.16c-3.22.7-3.9-1.36-3.9-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.3-5.27-1.29-5.27-5.74 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.19A11.1 11.1 0 0 1 12 5.95c.98 0 1.96.13 2.88.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.06.74.81 1.19 1.84 1.19 3.11 0 4.46-2.7 5.44-5.28 5.73.42.37.79 1.1.79 2.22v3.31c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
            </svg>

            {socialLoading === "github"
              ? "অপেক্ষা করুন..."
              : "GitHub দিয়ে চালিয়ে যান"}
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-xs text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#008A45] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        <Link href="/" className="hover:underline">
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </section>
  );
}
