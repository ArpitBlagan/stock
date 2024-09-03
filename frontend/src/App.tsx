import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Coins from "./Coins";
import { Toaster } from "sonner";
import CoinInfo from "./CoinInfo";
import Enter from "./Enter";
import Error from "./Error";
import Watchlist from "./Watchlist";
import Triggers from "./Triggers";
function App() {
  return (
    <Router>
      <Toaster position="bottom-right" expand={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/coininfo" element={<CoinInfo />} />
        <Route path="/enter" element={<Enter />} />
        <Route path="error" element={<Error />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/triggers" element={<Triggers />} />
      </Routes>
    </Router>
  );
}

export default App;
