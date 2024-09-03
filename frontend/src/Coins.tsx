import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_URL } from "./constant";
import axios from "axios";
import { toast } from "sonner";
import { Triangle } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import SearchInput from "./components/SearchInput";

const Coins = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      if (stocks.length == 0) {
        setFirstLoading(true);
      }
      try {
        const res = await axios.get(`${BASE_URL}/stocks`);
        setStocks(res.data);
        console.log("data", res.data);
        setFirstLoading(false);
      } catch (err) {
        console.log(err);
        toast.error(
          "something went wrong while fetching  active list of stocks 🥲"
        );
        setFirstLoading(false);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="relative h-[40dvh] rounded-xl">
        <img
          src="https://backpack.exchange/_next/image?url=%2Fhome-banner-refer.png&w=1200&q=75"
          className="absolute w-full "
        />
        <div className="z-10 absolute bottom-0 left-10">
          <p className="text-[40px] font-semibold">Trending Cryptos</p>
          <p className="text-[20px] text-red-700">
            Used Backpack's and Cryptocomparse's APIs
          </p>
        </div>
      </div>
      <SearchInput text={text} setText={setText} />
      {/* <p className="text-[25px] font-semibold text-center">Coins</p> */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>⬇️ Market Cap</TableHead>
            <TableHead className="text-right">24 h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!firstLoading &&
            stocks.map((ele: any, index: any) => {
              if (
                text.length &&
                !ele.name.startsWith(text) &&
                !ele.symbol.startsWith(text)
              ) {
                return;
              }
              return (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/coininfo", { state: ele });
                  }}
                >
                  <TableCell className="font-semibold w-[200px] flex items-center gap-2">
                    <img src={ele.image} width={40} height={30} />
                    {ele.name}
                  </TableCell>
                  <TableCell>${ele.current_price}</TableCell>
                  <TableCell>{ele.market_cap}</TableCell>
                  <TableCell className="text-right">
                    {ele.price_change_24h}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {firstLoading && (
        <div className="h-[50dvh] flex items-center justify-center w-full">
          <Triangle />
        </div>
      )}
    </div>
  );
};

export default Coins;
