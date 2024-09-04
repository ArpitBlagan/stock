import { BASE_URL } from "@/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WatchListOp from "./WatchListOp";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Candle from "./Candle";
const intervals = ["Minute", "Hour", "Day"];
const Chart = ({
  symbol,
  image,
  name,
  interval,
  setInterval,
  socket,
  isLoggedIn,
}: any) => {
  const [time, setTime] = useState<any | null>(null);
  const [klines, setKLines] = useState<any[]>([]);
  const [change, setChange] = useState("interval");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getKLines = async () => {
      try {
        setLoading(true);
        let startTime, endTime;
        if (time && change != "interval") {
          endTime = Math.floor(time.getTime() / 1000);
          const twentyDaysBack = new Date(
            time?.getTime() - 20 * 24 * 60 * 60 * 1000
          );
          setTime(twentyDaysBack);
          startTime = Math.floor(twentyDaysBack.getTime() / 1000);
        } else {
          const today = new Date();
          const twentyDaysBack = new Date(
            today.getTime() - 20 * 24 * 60 * 60 * 1000
          );
          setTime(twentyDaysBack);
          startTime = Math.floor(twentyDaysBack.getTime() / 1000);
        }
        const res = await axios.get(
          `${BASE_URL}/api/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
        );
        console.log(res.data.Data.Data);
        setKLines(res.data.Data.Data);
        setLoading(false);
      } catch (err) {
        toast.error(`Not able fetch klines for symbol ${symbol}`);
        setLoading(false);
      }
    };
    getKLines();
  }, [change]);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[20px] font-semibold text-center ">Chart</p>
      <div className="flex items-center justify-end gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Interval: {interval} ⬇️</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Avaliable Intervals</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {intervals.map((ele, index) => {
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setInterval(ele);
                    setChange("interval");
                  }}
                >
                  {ele}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {isLoggedIn && (
          <WatchListOp symbol={symbol} image={image} name={name} />
        )}
      </div>
      {loading ? (
        <div className="h-[50dvh] flex items-center justify-center">
          <Triangle />
        </div>
      ) : (
        <div>
          <Candle
            data={klines}
            socket={socket}
            interval={interval}
            symbol={symbol}
          />
        </div>
      )}
    </div>
  );
};

export default Chart;
