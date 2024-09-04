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
const Depth = ({ symbol }: any) => {
  const [asks, setAsks] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/depth?symbol=${symbol}_USDC`
        );
        console.log(res.data);
        setAsks(res.data.asks);
        setBids(res.data.bids.reverse());
        setLoading(false);
      } catch (err) {
        toast.error("something went wrong while fetching markets info");
        setLoading(false);
      }
    };
    getData();
    const interval = setInterval(() => {
      getData();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <p className="text-[20px] font-semibold text-center ">Depth</p>
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
            {asks.map((ele, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="w-[100px] text-red-800">
                    {ele[0]}
                  </TableCell>
                  <TableCell className="text-right">{ele[1]}</TableCell>
                </TableRow>
              );
            })}
            {bids.map((ele, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="w-[100px] text-green-800">
                    {ele[0]}
                  </TableCell>
                  <TableCell className="text-right">{ele[1]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Depth;
