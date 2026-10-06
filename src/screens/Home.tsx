"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Catering from "@/components/Catering";
import Reservation from "@/components/Reservation";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { FriezeDivider } from "@/components/BrandDecor";

const Home = () => (
  <div className="grain relative">
    <Navbar />
    <CartDrawer />
    <main>
      <Hero />
      <Offers />
      <About />
      <FriezeDivider />
      <Menu />
      <FriezeDivider />
      <Reservation />
      <Catering />
      <Events />
      <FriezeDivider />
      <Contact />
    </main>
    <FriezeDivider ornate />
    <Footer />
  </div>
);

export default Home;