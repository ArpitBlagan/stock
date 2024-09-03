import { BASE_URL } from "@/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Triangle } from "react-loader-spinner";

const Trade = ({ symbol }: any) => {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getTrades = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/trades?symbol=${symbol}_USDC`
        );
        console.log(res.data);
        setLoading(false);
        setTrades(res.data);
      } catch (err) {
        toast.error(`Not able to fetch trades for ${symbol}`);
        setLoading(false);
      }
    };

    getTrades();

    // Set up the interval to make the API request every 60 seconds
    const intervalId = setInterval(getTrades, 60000);
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <p className="text-[20px] font-semibold text-center">Trades</p>
      {loading ? (
        <div className="flex items-center justify-center h-[30dvh]">
          <Triangle />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="text-right">
                QTY ({symbol.toUpperCase() + "_USDC"})
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((ele, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    className={`w-[100px] ${
                      ele.isBuyerMaker ? "text-green-800" : "text-red-700"
                    }`}
                  >
                    {ele.price}
                  </TableCell>
                  <TableCell className="text-right">{ele.quantity} </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Trade;
