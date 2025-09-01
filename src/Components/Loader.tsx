import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="w-12 h-12 border-4 border-[#1a202c] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
