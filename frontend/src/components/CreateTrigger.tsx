import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant";
const CreateTrigger = ({ state, userId }: any) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const handleCreate = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/triggers`,
        {
          name: state.name,
          image: state.image,
          symbol: state.symbol,
          triggerName: name,
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice),
          userId,
        },
        { withCredentials: true }
      );
      toast.success("Trigger created successfully");
      setName("");
      setMaxPrice("");
      setMinPrice("");
      setOpen(false);
    } catch (err) {
      toast.error("something went wrong while creating new trigger:(");
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Trigger</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Trigger</DialogTitle>
            <DialogDescription className="flex flex-col gap-3 ">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <img src={state.image} width={40} height={40} />
                  <p>{state.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p>{state.price}</p>
                </div>
                <div className="flex-1 flex items-center justify-end flex-wrap gap-3">
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-gray-600">24H Change</p>
                    <p>{state.price_change_24h}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-gray-600">24H High</p>
                    <p>{state.high_24h}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-gray-600">24H Low</p>
                    <p>{state.low_24h}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <label>Name</label>
                  <Input
                    type="string"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label>Notify me when price drop upto </label>
                  <Input
                    type="nuber"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label>Notify me when price goes upto </label>
                  <Input
                    type="nuber"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrigger;
