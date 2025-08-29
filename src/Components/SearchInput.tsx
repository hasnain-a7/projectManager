import React from "react";
interface SearchInputProps {
  taskSearchInput: string;
  handleTaskSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  taskSearchInput,
  handleTaskSearch,
}) => {
  return (
    <>
      <input
        type="search"
        className="w-[92%] h-10 p-3 mb-4 border-none text-gray-900 rounded-lg text-base bg-gray-50 outline-none placeholder:text-gray-800"
        placeholder=" Search Task here..."
        value={taskSearchInput}
        onChange={handleTaskSearch}
      />
    </>
  );
};

export default SearchInput;
