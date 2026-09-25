import os

path = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-frontend\app\superadmin\Dashboard\page.tsx"
content = '''"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/superadmin/Admins");
  }, [router]);
  return null;
}
'''
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
