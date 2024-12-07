// components/Filters.tsx
import { Filter } from "../types";

interface FiltersProps {
  onFilter: (filter: Filter) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        className="border border-gray-300 rounded-md p-2"
        onChange={(e) => onFilter({ sector: e.target.value })}
      >
        <option value="">Select Sector</option>
        <option value="Technology">Technology</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Finance">Finance</option>
      </select>

      <select
        className="border border-gray-300 rounded-md p-2"
        onChange={(e) => onFilter({ marketCap: e.target.value })}
      >
        <option value="">Market Cap</option>
        <option value="Small">Small</option>
        <option value="Mid">Mid</option>
        <option value="Large">Large</option>
      </select>

      <input
        type="number"
        placeholder="Volume"
        className="border border-gray-300 rounded-md p-2"
        onChange={(e) =>
          onFilter({ volume: Number(e.target.value) || undefined })
        }
      />
    </div>
  );
};

export default Filters;
