// components/StockList.tsx
import { Stock } from "../types";

interface StockListProps {
  stocks: Stock[];
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stocks.map((stock) => (
        <div
          key={stock.ticker}
          className="border border-gray-300 rounded-md p-4"
        >
          <h3 className="text-lg font-bold">{stock.ticker}</h3>
          <p>{stock.explanation}</p>
          <p>Sentiment: {stock.sentiment}</p>
        </div>
      ))}
    </div>
  );
};

export default StockList;
