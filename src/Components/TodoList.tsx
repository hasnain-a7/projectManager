import React from "react";
import TodoSingleList from "./TodoSingleList";
import { useTaskContext } from "../TaskContext/TaskContext";

interface TodoListProps {
  taskColor: string | null;
}

const TodoList: React.FC<TodoListProps> = ({ taskColor }) => {
  const { todos, filteredTasks, taskSearchInput } = useTaskContext();
  const listToRender = taskSearchInput !== "" ? filteredTasks : todos;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[100%] w-[100%]">
      {listToRender.length > 0 ? (
        listToRender.map((item) => (
          <TodoSingleList key={item.id} item={item} taskColor={taskColor} />
        ))
      ) : (
        <p className="text-white font-medium flex text-center w-full pt-20 pl-36 ml-96">
          Todo not found
        </p>
      )}
    </ul>
  );
};

export default TodoList;
