"use client";

import {  useState,useMemo } from "react";
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
import { format,subDays } from "date-fns";
import { Sidebar } from "./components/Sidebar";
import { type Project} from '@/app/types/index'
import { KarmaDisplay} from './components/KarmaDisplay'
import { ThemeSelector } from "./components/ThemeSelector";
import { themes } from "@/config/themes";
import { StreakDisplay } from "./components/StreakDisplay";
import { TodoCalendar } from "./components/TodoCalender";
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
 const [streakCount, setStreakCount] = useLocalStorageState<number>("streak", 0);
const [lastCompletedDate, setLastCompletedDate] = useLocalStorageState<string | null>("lastCompletedDate", null);
 const [view, setView] = useState<'list' | 'calendar'>('list');


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
          karmaAwarded: false,
    };
    setTodos([...todos, newTodo]);
  };

const toggleTodo = (id: string) => {
  const todoToToggle = todos.find((todo) => todo.id === id);
  if (!todoToToggle) return; 

  if (!todoToToggle.completed && !todoToToggle.karmaAwarded) {
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

    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    if (lastCompletedDate === yesterday) {
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      toast.info(`🔥 Streak extended to ${newStreak} days!`);
    } else if (lastCompletedDate !== today) {
      setStreakCount(1);
      toast.info(`🔥 A new streak has begun!`);
    }
    setLastCompletedDate(today);


  setTodos((currentTodos) =>
    currentTodos.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        if (updatedTodo.completed) {
          updatedTodo.karmaAwarded = true;
        }
        
        return updatedTodo;
      }
      return todo;
    })
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
    if (todo.projectId !== selectedProjectId) return false;
    if (filter === 'today') return todo.dueDate && isToday(todo.dueDate);
    return true;
  });


const calendarEvents = useMemo(() => {
  return todos
    .filter(todo => todo.projectId === selectedProjectId && todo.dueDate) 
    .map(todo => ({
      id: todo.id,
      title: todo.text,
      date: todo.dueDate,
      allDay: true, 
      backgroundColor: todo.completed ? '#16a34a' : 'hsl(var(--primary))',
      borderColor: todo.completed ? '#16a34a' : 'hsl(var(--primary))',
    }));
}, [todos, selectedProjectId]);
  




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
      <main className="flex-1 p-4 sm:p-6 md:p-8">
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
      <StreakDisplay count={streakCount} />

        <div className="mt-12 p-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Add a Task:</h2>
          <TodoInput onAddTodo={addTodo} />

<div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
        {view === 'list' ? (filter === 'today' ? "Today's Tasks" : "Your List") : "Calendar View"}
    </h2>

    <div className="flex items-center gap-4">
        
        {view === 'list' && (
            <div className="flex gap-1 rounded-lg bg-muted p-1">
                <Button variant={filter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>
                    All
                </Button>
                <Button variant={filter === 'today' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('today')}>
                    Today
                </Button>
            </div>
        )}

        <div className="flex gap-1 rounded-lg bg-muted p-1">
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>
                List
            </Button>
            <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('calendar')}>
                Calendar
            </Button>
        </div>

    </div>


          </div>
           
         {view === 'list' ? (
  filter === 'all' ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} onUpdateTodoText={updateTodoText} /> 
    </DndContext>
  ) : (
    <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} onUpdateTodoText={updateTodoText} />
  )
) : (
  <TodoCalendar events={calendarEvents} />
)}

        </div>
      </div>

    </main>
    </div>
  );
}
