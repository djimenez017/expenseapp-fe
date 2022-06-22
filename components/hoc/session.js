import React from "react";
import { useRouter } from "next/router";

export default function session(props) {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const item = localStorage.getItem("token");

    if (!item) router.push("/");
  }
  return <div>{props.children}</div>;
}
