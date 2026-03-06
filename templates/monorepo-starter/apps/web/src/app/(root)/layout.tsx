import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
