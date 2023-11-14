import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex items-center justify-center">
      <ThreeDots type="ThreeDots" color="#72b01dff" height={80} width={80} />
    </div>
  );
}
