import React from "react";

const DetailPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-20">
      <header className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow fe">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Task Information
          </h2>
          <p className="mb-2">
            <span className="font-medium">Title:</span> Example Task Title
          </p>
          <p className="mb-2">
            <span className="font-medium">Description:</span> This is a sample
            description for the task.
          </p>
          <p className="mb-2">
            <span className="font-medium">Due Date:</span> 10th Sept, 2025
          </p>
          <p className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            <span className="text-yellow-600 font-semibold">Pending</span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Priority:</span>{" "}
            <span className="text-red-600 font-semibold">High</span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Tags:</span> Work, Urgent
          </p>
        </section>
      </main>
    </div>
  );
};

export default DetailPage;
