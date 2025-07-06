"use client";

import {  useState } from "react";
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
import { Sidebar } from "./components/Sidebar";
import { type Project} from '@/app/types/index'
import { KarmaDisplay} from './components/KarmaDisplay'
import { ThemeSelector } from "./components/ThemeSelector";
import { themes } from "@/config/themes";
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


// const defaultTodos = [
//   { id: nanoid(), text: "Learn Next.js", completed: true },
//   { id: nanoid(), text: "Build a cute todo app ✨", completed: false },
//   { id: nanoid(), text: "Take over the world", completed: false },
// ];

type FilterType = "all" | "today";

const DEFAULT_PROJECT_ID = "inbox";


export default function Home() {
   const [projects, setProjects] = useLocalStorageState<Project[]>("projects", [
    { id: DEFAULT_PROJECT_ID, name: "Inbox" },
    { id: nanoid(), name: "Groceries 🍎" },
  ]);

    const [todos, setTodos] = useLocalStorageState<Todo[]>("todos", [
    { id: nanoid(), text: "Welcome to your new Todo App!", completed: false, projectId: DEFAULT_PROJECT_ID },
    { id: nanoid(), text: "Add a task to the Groceries project", completed: false, projectId: projects[1]?.id || nanoid() },
  ]);

  const [filter, setFilter] = useState<FilterType>("all");
  const activeTodosCount = todos.filter(t => !t.completed).length;
  const [selectedProjectId, setSelectedProjectId] = useState<string>(DEFAULT_PROJECT_ID);
//  const [hasMounted, setHasMounted] = useState(false);
 const [karma, setKarma] = useLocalStorageState<number>("karma", 0);

 const availableThemes = themes.filter(theme => karma >= theme.karmaRequired);

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);
   

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




  const addProject = (name: string) => {
    if (!name.trim()) return;

    const newProject: Project = {
      id: nanoid(),
      name: name.trim(),
    };

    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id); 
    toast.success(`Project "${newProject.name}" created!`); 
  };

  const updateProjectName = (projectId: string, newName: string) => {
    if (!newName.trim()) return;
    setProjects(
      projects.map((p) => (p.id === projectId ? { ...p, name: newName.trim() } : p))
    );
    toast.success("Project renamed!");
  };

  const deleteProject = (projectId: string) => {
    if (projectId === DEFAULT_PROJECT_ID) {
      toast.error("The Inbox project cannot be deleted.");
      return;
    }
   const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;
   setProjects(projects.filter((p) => p.id !== projectId));
    setTodos(todos.filter((t) => t.projectId !== projectId));
    setSelectedProjectId(DEFAULT_PROJECT_ID);
    toast.success(`Project "${projectToDelete.name}" deleted.`);
  };

  const addTodo = (text: string,dueDate?: Date,imageDataUrl?: string) => {
    const newTodo: Todo = {
      id: nanoid(),
      text,
      completed: false,
    dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
      imageUrl: imageDataUrl,
        projectId: selectedProjectId, 
    };
    setTodos([...todos, newTodo]);
  };


 const toggleTodo = (id: string) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (todoToToggle && !todoToToggle.completed) {
      const pointsEarned = 10; 
      const newKarma = karma + pointsEarned;
      
      setKarma(newKarma); 

      const currentLevel = Math.floor(karma / 100);
      const newLevel = Math.floor(newKarma / 100);

      if (newLevel > currentLevel) {
        toast.success(`🎉 LEVEL UP! You've reached Level ${newLevel}!`);
      }

       const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
      toast("✅ Well Done! " + randomMessage, {
        description: `+${pointsEarned} Karma`,
      });
    }
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
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
    if (todo.projectId !== selectedProjectId) return false;
    if (filter === 'today') return todo.dueDate && isToday(todo.dueDate);
    return true;
  });

  

  return (
     <div className="flex flex-col md:flex-row h-screen bg-background transition-colors duration-300">
      <div className="p-4 w-full md:w-72">
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
           onAddProject={addProject} 
            onUpdateProject={updateProjectName}
            onDeleteProject={deleteProject}
        />
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
          <div className="absolute top-4 right-4 flex items-center gap-2">
             <ThemeSelector
              availableThemes={availableThemes}
              allThemes={themes}
              currentKarma={karma}
            />
            <ThemeToggle />
          </div>
          <ConfettiWrapper activeTodosCount={activeTodosCount} />
 <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 dark:text-white">
              {projects.find(p => p.id === selectedProjectId)?.name || "Project"}
            </h1>
            <p className="mt-2 text-lg text-pink-400 dark:text-pink-300 font-semibold">
            Let&apos;s get things done! 💖
             </p>
        </div>
          <KarmaDisplay score={karma} />

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
    </div>
  );
}
