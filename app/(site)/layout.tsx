import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Breadcrumb />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}

