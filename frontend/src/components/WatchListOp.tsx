import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { con } from "../Context";
import { toast } from "sonner";
import { BASE_URL } from "@/constant";
import axios from "axios";
const WatchListOp = ({ symbol, image, name }: any) => {
  const value = useContext(con);
  const [item, setItem] = useState<any>(null);
  const [alreadyThere, setAlreadyThere] = useState(false);
  useEffect(() => {
    if (value?.watchList) {
      const itemm = value?.watchList.find((ele) => {
        return ele.symbol == symbol;
      });
      if (itemm) {
        setAlreadyThere(true);
        setItem(itemm);
      }
    }
  }, [value?.watchList]);
  const handleRemoveWatchList = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/watchlist?id=${item.id}`, {
        withCredentials: true,
      });
      toast.success("removed successfully");
      value?.setChange(!value.change);
    } catch (err) {
      toast.error("Not able to remove coin from the watchlist");
    }
  };
  const handleAddWatchList = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/watchlist?userId=${value?.user.id}`,
        { symbol, name, image, userId: value?.user.id },
        { withCredentials: true }
      );
      toast.success("added successfully");
      value?.setChange(!value.change);
    } catch (err) {
      toast.error("Not able to add coin  to watchlist");
    }
  };
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          if (alreadyThere) {
            handleRemoveWatchList();
          } else {
            handleAddWatchList();
          }
        }}
      >
        {!alreadyThere ? "Add ➡️ Watchlist" : "Remove ⬅️ Watchlist"}
      </Button>
    </div>
  );
};

export default WatchListOp;
