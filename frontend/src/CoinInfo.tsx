import { useLocation } from "react-router-dom";
import Depth from "./components/Depth";
import Trade from "./components/Trade";
import { useContext, useState } from "react";
import Chart from "./components/Chart";
import { con } from "./Context";
import CreateTrigger from "./components/CreateTrigger";

const CoinInfo = () => {
  const { state } = useLocation();
  const [curr, setCurr] = useState("depth");
  const [interval, setInterval] = useState("Minute");
  const value = useContext(con);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <img src={state.image} width={40} height={40} />
          <p>{state.name}</p>
        </div>
        <div>{}</div>
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
      <div className="flex justify-end gap-2 items-center">
        {value?.user.isLoggedIn && (
          <CreateTrigger state={state} userId={value?.user.id} />
        )}
      </div>
      <div>
        <Chart
          symbol={state.symbol}
          interval={interval}
          setInterval={setInterval}
          socket={value?.socket}
          name={state.name}
          image={state.image}
          isLoggedIn={value?.user.isLoggedIn}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <p
            className={`cursor-pointer ${
              curr == "depth" ? "underline text-green-600" : ""
            }`}
            onClick={() => {
              setCurr("depth");
            }}
          >
            Depth
          </p>
          <p
            className={`cursor-pointer ${
              curr == "trades" ? "underline text-green-600" : ""
            }`}
            onClick={() => {
              setCurr("trades");
            }}
          >
            Trades
          </p>
        </div>
        {curr == "trades" ? (
          <Trade symbol={state.symbol} />
        ) : (
          <Depth symbol={state.symbol} />
        )}
      </div>
    </div>
  );
};

export default CoinInfo;
