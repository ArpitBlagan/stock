import { FacebookIcon, Mail } from "lucide-react";
import { BASE_URL } from "./constant";

const Enter = () => {
  return (
    <div className="h-[70dvh] flex flex-col items-center justify-center gap-5   ">
      <div className="flex fle-col items-center justify-center">
        <p className="flex flex-col gap-2">
          <span className="text-[20px] md:text-[30px] font-semibold">
            Market app that allows users to get started using Google or Facebook
            for authentication
          </span>
          <span className=" text-sm font-semibold">
            Easily create an account or log in using your existing Google or
            Facebook credentials.
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={`${BASE_URL}/auth/facebook`}
          className="flex items-center gap-2 border rounded-xl py-2 px-5 hover:bg-blue-600"
        >
          <FacebookIcon /> using Facebook
        </a>
        <a
          href={`${BASE_URL}/auth/google`}
          className="flex items-center gap-2 border rounded-xl py-2 px-5 hover:bg-red-600"
        >
          <Mail /> using Google
        </a>
      </div>
    </div>
  );
};

export default Enter;
