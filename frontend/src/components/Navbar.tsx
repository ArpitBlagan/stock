import { con } from "../Context";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { BASE_URL } from "@/constant";
import axios from "axios";
const Navbar = () => {
  const value = useContext(con);
  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/logout`, { withCredentials: true });
      value?.setUser({
        isLoggedIn: false,
        name: "",
        image: "",
        id: "",
      });
    } catch (err) {
      toast.error("something went wrong while logging out:(");
    }
  };
  return (
    <div className="flex items-center px-2 gap-2 mb-5">
      <Link to="/" className="text-[30px] font-custom">
        Me
      </Link>
      <Link to="/" className="text-[30px] font-custom">
        Market
      </Link>

      <div className="flex-1 flex items-center justify-end  gap-3">
        {value?.user.isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link to="/watchlist">Watch List</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Profile</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <img
                    src={value.user.image}
                    height={40}
                    width={40}
                    className="rounded-xl"
                  />{" "}
                  <p>{value.user.name}</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link
            to="/enter"
            className="bg-green-600 py-2 px-5 rounded-xl border hover:bg-green-700"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
