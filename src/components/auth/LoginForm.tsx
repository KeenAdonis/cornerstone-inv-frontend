"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";

import { useLogin } from "@/src/hooks/useLogin";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] =
        useState(false);

    const {
        handleLogin,
        loading,
        error,
    } = useLogin();

    async function onSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const response = await handleLogin({
            email,
            password,
        });

        if (!response) {
            return;
        }

        switch (response.user.role) {
            case "admin":
                router.replace("/admin/dashboard");
                break;

            case "warehouse_coordinator":
                router.replace(
                    "/warehouse-coordinator/dashboard"
                );
                break;

            case "branch_coordinator":
                router.replace(
                    "/branch-coordinator/dashboard"
                );
                break;

            default:
                router.replace("/dashboard");
                break;
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
            <section className="w-full max-w-md">
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">

                    {/* ------------------------------------------------ */}
                    {/* Branding */}
                    {/* ------------------------------------------------ */}
                    <div className="mb-8">

                        <div className="flex items-center justify-center gap-4 sm:gap-5">

                            {/* Cornerstone Logo */}
                            <div className="flex min-w-0 flex-1 items-center justify-end">
                                <img
                                    src="/business-logo/cornerstone-logo.png"
                                    alt="Cornerstone Multi Sales"
                                    className="h-auto max-h-16 w-auto max-w-full object-contain sm:max-h-20"
                                />
                            </div>

                            {/* Subtle Divider */}
                            <div
                                className="h-12 w-px shrink-0 bg-slate-200/70 sm:h-14"
                                aria-hidden="true"
                            />

                            {/* CandyMix Logo */}
                            <div className="flex min-w-0 flex-1 items-center justify-start">
                                <img
                                    src="/business-logo/candymix-logo.jpg"
                                    alt="CandyMix"
                                    className="h-auto max-h-16 w-auto max-w-full object-contain sm:max-h-20"
                                />
                            </div>

                        </div>

                        {/* Login Description */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Sign in to access the inventory system
                        </p>

                    </div>

                    {/* ------------------------------------------------ */}
                    {/* Login Form */}
                    {/* ------------------------------------------------ */}
                    <form
                        onSubmit={onSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    required
                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* Copyright */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 Cornerstone Inventory System
                </p>
            </section>
        </main>
    );
}