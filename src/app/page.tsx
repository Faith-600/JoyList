"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { type Todo } from "@/app/types/index";
import { TodoList } from "@/app/components/TodoList";
import { TodoInput } from "@/app/components/TodoInput";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
// import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; 
import { ThemeToggle } from "./components/ThemeToggle";
import { ConfettiWrapper } from "./components/ConfettiWrapper";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';


const defaultTodos = [
  { id: nanoid(), text: "Learn Next.js", completed: true },
  { id: nanoid(), text: "Build a cute todo app ✨", completed: false },
  { id: nanoid(), text: "Take over the world", completed: false },
];

type FilterType = "all" | "today";

export default function Home() {
  const [todos, setTodos] = useLocalStorageState<Todo[]>("todos", []);
  const [initialized, setInitialized] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const activeTodosCount = todos.filter(t => !t.completed).length;


   const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

    function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const funMessages = [
    "Nice one! You're on fire! 🔥",
    "Great job! You deserve a chilled coke. 🥤",
    "That's another one down! Keep it up.",
    "Boom! Task completed. ✨",
    "You're making incredible progress!",
  ];

 useEffect(() => {
  if (todos.length === 0) {
    setTodos(defaultTodos);
  }
  setInitialized(true);
}, [todos.length, setTodos]);

  const addTodo = (text: string,dueDate?: Date,imageDataUrl?: string) => {
    const newTodo: Todo = {
      id: nanoid(),
      text,
      completed: false,
    dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
      imageUrl: imageDataUrl,
    };
    setTodos([...todos, newTodo]);
  };


  const toggleTodo = (id: string) => {
     const todoToToggle = todos.find((todo) => todo.id === id);

    if (todoToToggle && !todoToToggle.completed) {
      const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
      toast("✅ Well Done!" + randomMessage);
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

   const updateTodoText = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

   const isToday = (dateString: string) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return dateString === today;
}

  const filteredTodos = todos.filter(todo => {
    if (filter === 'today') {
      return todo.dueDate && isToday(todo.dueDate);
    }
    return true; 
  });

   console.log("Data being sent to TodoList:", filteredTodos);

  if (!initialized) return null; 

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
       <ConfettiWrapper activeTodosCount={activeTodosCount} />
       <div className="absolute top-4 right-4">
    <ThemeToggle />
  </div>
  <div className="w-full max-w-2xl"></div>
      <div className="w-full max-w-2xl ">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-white">
            JoyList
          </h1>
          <p className="mt-2 text-lg text-pink-400 dark:text-pink-300 font-semibold">
            Let&apos;s get things done! 💖
             </p>
        </div>
          {/* <UserButton/> */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Add a Task:</h2>
          <TodoInput onAddTodo={addTodo} />

           <div className="mt-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {filter === 'today' ? "Today's Tasks" : "Your List"}
            </h2>
            <div className="flex gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
              <Button variant={filter === 'today' ? 'default' : 'outline'} onClick={() => setFilter('today')}>Today</Button>
            </div>
          </div>
           
          {filter === 'all' ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} onUpdateTodoText={updateTodoText} /> 
            </DndContext>
          ) : (
            <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo}  onUpdateTodoText={updateTodoText} />
          )}

        </div>
      </div>

    </main>
  );
}
