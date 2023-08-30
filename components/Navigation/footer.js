import React from "react";

export default function footer() {
  return (
    <footer className=" bottom-0 left-0 right-0 mt-10 text-center w-full bg-white text-black font-bold p-1">
      Made by{" "}
      <a
        href="https://jimenez.tech"
        className="text-green transition duration-300 ease-in-out hover:text-orange"
      >
        Daniel Jimenez
      </a>
    </footer>
  );
}
