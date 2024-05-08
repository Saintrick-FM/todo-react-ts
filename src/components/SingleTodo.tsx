import React, { useEffect, useState } from "react";
import { TaskType } from "../types";

function SingleTodo({
  task,
  resetTodos,
}: {
  task: TaskType;
  resetTodos: (newItems: TaskType[]) => void;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isTaskCompleted, setIstaskCompleted] = useState<boolean>(
    task.completed
  );
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlecompleted = () => {
    if (isTaskCompleted) {
      return {
        fontStyle: "italic",
        color: "red",
        textDecoration: "line-through",
      };
    }
    return {};
  };

  const togglecompleted = () => {
    let currentTodos = JSON.parse(
      localStorage.getItem("todos") as string
    ) as TaskType[];
    setIstaskCompleted(!isTaskCompleted);
    let newTodos = currentTodos.map((todo: TaskType) => {
      if (task.id === todo.id) {
        return { ...todo, completed: !isTaskCompleted };
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
    resetTodos(newTodos);
  };
  function delete_taskLocalStorage(taskId: number) {
    let currentTodos = JSON.parse(
      localStorage.getItem("todos") as string
    ) as TaskType[];
    let newItems = currentTodos.filter((todo: TaskType) => todo.id !== taskId);
    console.log("newItems =  " + JSON.stringify(newItems));

    resetTodos(newItems);
  }

  return (
    <li className="todo list-group-item d-flex align-items-center">
      <input
        type="checkbox"
        className="form-check-input"
        onClick={togglecompleted}
      />
      <label
        className="ms-2 form-check-label"
        style={mounted ? handlecompleted() : {}}
      >
        {task.todo}
      </label>

      <label className="btn btn-danger btn-sm ms-2 ms-auto">
        <i
          className="bi bi-trash"
          onClick={() => delete_taskLocalStorage(task.id)}
        ></i>
      </label>
      <label className="btn btn-primary btn-sm ms-2">
        <i className="bi bi-pencil"></i>
      </label>
    </li>
  );
}

export default SingleTodo;
