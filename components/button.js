import Link from "next/link";

export default function Button(props) {
  return (
    <Link
      href={props.to}
      onClick={props.click}
      className="bg-green block w-full p-2 text-center text-white text-xl font-bold hover:bg-orange transition duration-300 ease-in-out"
      style={{ maxWidth: "750px" }}
    >
      {props.children}
    </Link>
  );
}
