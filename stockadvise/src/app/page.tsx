
"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBox from "../components/SearchBox";
import Filters from "../components/Filters";
import StockList from "../components/StockList";
import { Stock, Filter } from "../../types";

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setStocks(data.response); // Assuming FastAPI returns `response`
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const handleFilter = async (filter: Filter) => {
    // Update filter logic here or send filter options to the backend
    console.log("Filter applied:", filter);
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 space-y-4">
        <SearchBox onSearch={handleSearch} />
        <Filters onFilter={handleFilter} />
        <StockList stocks={stocks} />
      </div>
    </div>
  );
}
