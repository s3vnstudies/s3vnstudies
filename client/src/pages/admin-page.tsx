import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin Dashboard - S3vn Studies";
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p>Admin functionality will be implemented here.</p>
      </div>
    </PageLayout>
  );
}