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
        className="search-input"
        placeholder=" Search Task here..."
        value={taskSearchInput}
        onChange={handleTaskSearch}
      />
    </>
  );
};

export default SearchInput;
