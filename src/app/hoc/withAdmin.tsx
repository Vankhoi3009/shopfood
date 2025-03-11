"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAdmin<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function ProtectedAdmin(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        router.replace("/");
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) return <p>Đang tải...</p>;

    return <Component {...props} />;
  };
}
