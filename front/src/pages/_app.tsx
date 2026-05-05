import { AuthProvider, useAuth } from "@/context/auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

// 認証不要なページ
const PUBLIC_PAGES = ["/login", "/signup"];

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 認証不要ページは通過
        if (PUBLIC_PAGES.includes(router.pathname)) return;

        // tokenが無ければloginへリダイレクト
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router.pathname]);

    // 認証不要ページはそのまま表示
    if (PUBLIC_PAGES.includes(router.pathname)) {
        return <>{children}</>;
    }

    // 認証済みのみ表示
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <AuthGuard>
                <Component {...pageProps} />
            </AuthGuard>
        </AuthProvider>
    );
}
