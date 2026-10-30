import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-paper/80">
      <ThreeDots type="ThreeDots" color="#2f6b45" height={80} width={80} />
    </div>
  );
}
