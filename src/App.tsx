import React, { useLayoutEffect, useRef, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { FilterType, TaskType } from "./types";
import SingleTodo from "./components/SingleTodo";

function App() {
  //  data-com.bitwarden.browser.user-edited="yes"
  const [items, setItems] = useState<TaskType[]>([]);
  const inputTodo = useRef<any>("");

  const getTodosFromApi = async () => {
    const result = await (
      await fetch("https://dummyjson.com/todos?limit=10")
    ).json();
    if (result) {
      localStorage.setItem("todos", JSON.stringify(result?.todos));
      setItems(result.todos);
      return result?.todos;
    }
    return [];
  };
  const addTodoToApi = async (todo: TaskType) => {
    const result = await (
      await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, userId: 5 }),
      })
    ).json();
    if (result) {
      console.log("Result = ", JSON.stringify(result));
      localStorage.setItem("todos", JSON.stringify(result?.todos));
      setItems(result?.todos);
    }
  };
  useLayoutEffect(() => {
    getTodosFromApi();
  }, []);
  // Sauvegarde des tâches dans le stockage local
  // function create_local_storage() {
  //   if (items && items.length > 0) {
  //     localStorage.setItem("todos", JSON.stringify(items));
  //     return;
  //   }
  //   localStorage.setItem("todos", JSON.stringify([]));
  // }
  const filterTodos = (typeOfFilter: FilterType) => {
    let reinitialedItems = JSON.parse(
      localStorage.getItem("todos") as string
    ) as TaskType[];
    let result = null;
    if (typeOfFilter === "a faire") {
      result = reinitialedItems.filter((item) => item.completed === false);
      console.log("In a faire filte items = ", items, " \nresult = ", result);
      setItems(result);
    }
    if (typeOfFilter === "toutes") {
      setItems(reinitialedItems);
    }

    if (typeOfFilter === "faites") {
      result = reinitialedItems.filter((item) => item.completed === true);
      console.log("In faites items = ", items, " \nresult = ", result);
      setItems(result);
    }
  };
  // Ajout d'une tâche
  function add_taskLocalStorage(task: TaskType) {
    let newItems = [...items, task];
    setItems(newItems);
    localStorage.setItem("todos", JSON.stringify(newItems));
    // items.push(task);
  }

  const submitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    let input_value = inputTodo.current.value;
    add_taskLocalStorage({
      id: items.length + 1,
      todo: input_value,
      completed: false,
    });
  };
  const resetTodos = (newTodos: TaskType[]) => {
    setItems(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  return (
    <section className="container pt-5" id="todolist">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Welcome to our Todo app
      </h2>
      <form className="d-flex pb-4">
        <input
          required={true}
          className="form-control"
          id="todo_input"
          type="text"
          placeholder="Acheter des patates..."
          name="todo"
          ref={inputTodo}
        />
        <button
          id="add_task"
          className="btn btn-primary"
          onClick={(event: React.FormEvent) => submitTodo(event)}
          style={{ marginLeft: 10 }}
        >
          Ajouter
        </button>
      </form>

      <main>
        <div className="btn-group mb-4 " role="group">
          <button
            type="button"
            className=" btn btn-outline-primary active"
            // data-filter="all"
            onClick={() => filterTodos("toutes")}
          >
            Toutes
          </button>
          <button
            type="button"
            className=" btn btn-outline-primary"
            // data-filter="todo"
            id=""
            onClick={() => filterTodos("a faire")}
          >
            A faire
          </button>
          <button
            type="button"
            className=" btn btn-outline-primary"
            // data-filter="done"
            id="allTaskCompleded"
            onClick={() => filterTodos("faites")}
          >
            Faites
          </button>
        </div>

        <ul className="list-group" id="tasksContainer">
          {items.map((item, index: number) => {
            return (
              <SingleTodo
                key={index}
                task={item}
                resetTodos={(newTodos: TaskType[]) => resetTodos(newTodos)}
              />
            );
          })}
        </ul>
      </main>
    </section>
  );
}

export default App;
