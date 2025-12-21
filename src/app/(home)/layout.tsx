import Navbar from "@/modules/home/ui/components/Navbar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen">
      <div className="absolute inset-0 -z-10 h-full bg-background bg-[radial-gradient(#dadde2_1px,transparent_1px)] dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-size-[16px_16px]" />
      <Navbar />
      <div className="h-full flex justify-center items-center">{children}</div>
    </main>
  );
};

export default Layout;
