import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sun*Merce",
  description: "This is Home for Sun*Merce",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
