import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="h-[60dvh] flex flex-col gap-4 items-center justify-center">
      <p className="text-[20px]">
        <span className="text-[30px] font-semibold">Oops!</span> something went
        wrong 🥲
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/enter"
          className="py-2 px-5 border rounded hover:bg-green-700"
        >
          Try Again
        </Link>
        <Link to="/" className="py-2 px-5 border rounded hover:bg-red-700">
          Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
