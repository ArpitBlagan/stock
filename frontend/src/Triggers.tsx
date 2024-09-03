import { useContext, useEffect, useState } from "react";
import { con } from "./Context";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "./constant";
import { Button } from "./components/ui/button";

const Triggers = () => {
  const [triggers, setTriggers] = useState<any[]>([]);
  const [refetch, setRefetch] = useState(false);
  const value = useContext(con);
  const handleDelete = async (id: any) => {
    toast("Deleting Trigger");
    try {
      await axios.delete(`${BASE_URL}/api/triggers?id=${id}`);
      setRefetch(!refetch);
      toast.success("Trigger deleted");
    } catch (err) {
      toast.error("not able to delete the trigger");
    }
  };
  useEffect(() => {
    const getTriggers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/triggers?userId=${value?.user.id}`,
          { withCredentials: true }
        );
        console.log(res.data);
        setTriggers(res.data);
      } catch (err) {
        toast.error("not able to fetch triggers:(");
      }
    };
    getTriggers();
  }, [value?.user, refetch]);
  return (
    <div className="flex flex-col gap-4">
      <p>Triggers</p>
      <div className="grid grid-cols-3 gap-3">
        {triggers.map((ele, index) => {
          return (
            <div
              key={index}
              className="border rounded-xl py-3 px-5 flex flex-col gap-3"
            >
              <div>
                <p className="font-semibold text-xl">{ele.triggerName}</p>
              </div>
              <div className="flex items-center gap-2">
                <p>About </p>
                <img
                  src={ele.image}
                  height={40}
                  width={40}
                  className="rounded-xl"
                />
                <p>{ele.name}</p>
              </div>
              <div className="flex items-center gap-3 justify-around">
                <p>
                  Min price: <span>{ele.minPrice}</span>
                </p>
                <p>
                  Min price: <span>{ele.maxPrice}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(ele.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Triggers;
