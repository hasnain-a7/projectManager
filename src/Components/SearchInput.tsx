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
        className="w-[92%] h-10 p-3 mb-4 border-none text-[#B6C2CF] rounded-lg text-base bg-[#1D2125] outline-none placeholder:text-[#B6C2CF]"
        placeholder=" Search Task here..."
        value={taskSearchInput}
        onChange={handleTaskSearch}
      />
    </>
  );
};

export default SearchInput;
