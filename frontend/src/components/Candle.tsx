import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const Candle = ({ data, socket, interval, symbol }: any) => {
  const chartContainerRef = useRef(null);
  const [candleChart, setCandleChart] = useState<any | null>(null);
  useEffect(() => {
    const formattedData = data.map((item: any) => ({
      time: item.time, // Unix timestamp
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
    if (candleChart) {
      candleChart.setData(formattedData);
    }
  }, [data, candleChart]);

  useEffect(() => {
    let time;
    if (interval == "Minute") {
      time = "m";
    } else if (interval == "Hour") {
      time = "h";
    } else {
      time = "d";
    }
    if (socket) {
      const data = {
        action: "SubAdd",
        subs: [`24~Coinbase~${symbol.toUpperCase()}~USD~${time}`],
      };
      socket.send(JSON.stringify(data));
      let dd: any = null;
      socket.onmessage = function (message: any) {
        const ff = JSON.parse(message.data);
        console.log(ff);

        if (ff.TYPE == "24") {
          console.log(ff.TS);
          if (!dd) {
            dd = {
              time: ff.TS,
              open: parseFloat(ff.OPEN),
              high: parseFloat(ff.HIGH),
              low: parseFloat(ff.LOW),
              close: parseFloat(ff.CLOSE),
            };
          } else {
            const fff = {
              time: ff.TS,
              open: parseFloat(ff.OPEN),
              high:
                parseFloat(ff.HIGH) > dd?.high ? parseFloat(ff.HIGH) : dd?.high,
              low: parseFloat(ff.LOW) < dd?.low ? parseFloat(ff.LOW) : dd?.low,
              close: parseFloat(ff.CLOSE),
            };
            dd = fff;
          }
        }
      };
      if (candleChart) {
        setInterval(() => {
          console.log("updating", dd);
          if (candleChart && dd) {
            console.log(dd);
            candleChart?.update(dd);
          }
        }, 10000);
      }
    }
    return () => {
      if (socket) {
        const data = {
          action: "SubRemove",
          subs: [`24~Coinbase~${symbol.toUpperCase()}~USD~${time}`],
        };
        socket.send(JSON.stringify(data));
      }
    };
  }, [socket, candleChart]);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      //@ts-ignore
      width: chartContainerRef.current.clientWidth,
      //@ts-ignore
      height: chartContainerRef.current.clientHeight,
      layout: {
        // Set background color to black
        //@ts-ignore
        background: "black",
        textColor: "#FFFFFF", // Set text color to white for visibility
      },
      grid: {
        vertLines: {
          color: "#404040", // Color for vertical grid lines
        },
        horzLines: {
          color: "#404040", // Color for horizontal grid lines
        },
      },
      crossHair: {
        mode: 1, // Set crosshair mode
      },
      priceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        mode: 3,
      },
    });

    // Create the candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#4FFF00",
      downColor: "#FF4976",
      borderUpColor: "#4FFF00",
      borderDownColor: "#FF4976",
      wickUpColor: "#4FFF00",
      wickDownColor: "#FF4976",
    });
    setCandleChart(candlestickSeries);
    // Set the data for the candlestick series

    // Cleanup the chart on component unmount
    return () => chart.remove();
  }, [data]);
  return (
    <div
      ref={chartContainerRef}
      className="py-2 px-4 rounded-xl border"
      style={{ position: "relative", width: "100%", height: "500px" }}
    />
  );
};

export default Candle;
