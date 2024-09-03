import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { con } from "./Context";
import { TrashIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "./constant";
const Watchlist = () => {
  const navigate = useNavigate();
  const value = useContext(con);

  return (
    <div>
      <p>Watchlist</p>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {value?.watchList.map((ele: any, index: any) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-semibold w-[200px] flex items-center gap-2">
                  <img src={ele.image} width={40} height={30} />
                </TableCell>
                <TableCell>{ele.name}</TableCell>
                <TableCell>{ele.symbol}</TableCell>
                <TableCell className="text-right flex items-center justify-end gap-3">
                  <Button
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await axios.delete(
                          `${BASE_URL}/api/watchlist?id=${ele.id}`
                        );
                        toast.success("Deleted succesfully");
                      } catch (err) {
                        toast.error("Not able to delete right now");
                      }
                    }}
                  >
                    <TrashIcon />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/coininfo", { state: ele });
                    }}
                  >
                    show
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Watchlist;
