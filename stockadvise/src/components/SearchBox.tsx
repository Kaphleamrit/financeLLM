// components/SearchBox.tsx
import { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md p-2 flex-grow"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;
