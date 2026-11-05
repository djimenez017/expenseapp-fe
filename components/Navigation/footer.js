import React from "react";

export default function footer() {
  return (
    <footer className="mx-auto max-w-[1440px] px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 text-center text-sm text-muted sm:px-6 lg:px-8">
      Made by{" "}
      <a href="https://jimenez.tech" className="font-bold text-green hover:text-clay">
        Daniel Jimenez
      </a>
    </footer>
  );
}
