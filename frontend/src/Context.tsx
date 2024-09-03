import { createContext, useEffect, useState } from "react";

import { BASE_URL } from "./constant";
import axios from "axios";
interface hehe {
  user: {
    isLoggedIn: boolean;
    name: string;
    image: string;
    id: string;
  };
  socket: WebSocket | null;
  watchList: any[];
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<
    React.SetStateAction<{
      isLoggedIn: boolean;
      name: string;
      image: string;
      id: string;
    }>
  >;
}
export const con = createContext<hehe | null>(null);
const Context = ({ children }: any) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: "",
    image: "",
    id: "",
  });
  const [watchList, setWatchList] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [change, setChange] = useState(false);
  useEffect(() => {
    const checkLogIn = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/islogin`, {
          withCredentials: true,
        });
        console.log(res.data);
        setUser({
          isLoggedIn: true,
          name: res.data.name,
          image: res.data.image,
          id: res.data.id,
        });
      } catch (err) {
        console.log(err);
      }
    };
    checkLogIn();
  }, []);
  useEffect(() => {
    const getWatchList = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/watchlist?userId=${user.id}`
        );
        console.log("watchlist", res.data);
        setWatchList(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user.isLoggedIn) {
      getWatchList();
    }
  }, [change, user]);
  useEffect(() => {
    const sock = new WebSocket(
      "wss://streamer.cryptocompare.com/v2?api_key=86ff62f736b3f25e1fb524747046c5d9af71f6281c52385ed27e0cb6f1fe0e0f"
    );
    sock.onopen = () => {
      console.log("socket connection established:)");
      setSocket(sock);
    };
  }, []);
  return (
    <con.Provider
      value={{ user, socket, watchList, change, setChange, setUser }}
    >
      {children}
    </con.Provider>
  );
};

export default Context;
