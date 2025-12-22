import Navbar from "@/modules/home/ui/components/Navbar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 -z-10 bg-background bg-[radial-gradient(#dadde2_1px,transparent_1px)] dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-size-[16px_16px]" />
      <div className="pb-16">
        <Navbar />
        {children}
      </div>
    </main>
  );
};

export default Layout;
