"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Todo } from "@/app/types/index";
import { TodoItem } from "./TodoItem";
import { SortableContext,verticalListSortingStrategy } from "@dnd-kit/sortable";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
   onUpdateTodoText: (id: string, newText: string) => void;
}

export const TodoList = ({ todos, onToggleTodo, onDeleteTodo,onUpdateTodoText }: TodoListProps) => {
    const todoIds = todos.map(todo => todo.id);
   return (
   <motion.div layout className="mt-4 space-y-2">
          <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>

       <AnimatePresence> 
          {todos.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          All done! Nothing to see here. 🎉
        </p>
      )}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodoText={onUpdateTodoText}
        />
      ))}
      </AnimatePresence>
      </SortableContext>
    </motion.div>
  );
};