"use client";

import { useState, useEffect, useRef } from 'react';
import { type Todo } from "@/app/types/index";
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import { Trash2 } from "lucide-react"; 
import { motion } from 'framer-motion'
import { format, isToday, isPast,parse } from 'date-fns';
import Image from "next/image";
import { GripVertical,Paperclip } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
   onUpdateTodoText: (id: string, newText: string) => void;
}

export const TodoItem = ({ todo, onToggleTodo, onDeleteTodo,onUpdateTodoText }: TodoItemProps) => {

     const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null)
   
  
   useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select(); 
    }
  }, [isEditing]);

    const handleSave = () => {
    if (editText.trim()) {
      onUpdateTodoText(todo.id, editText.trim());
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text); 
      setIsEditing(false);
    }
  }
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


   const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
  };



  return (
  <motion.div
    layout="position"
    style={style}
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    ref={setNodeRef}
    className="flex items-center p-2 bg-card rounded-lg shadow-sm my-2"
  >
    <div {...attributes} {...listeners} className="p-2 cursor-grab touch-none">
      <GripVertical className="h-5 w-5 text-gray-400" />
    </div>

    <Checkbox
      id={`todo-${todo.id}`}
      checked={todo.completed}
      onCheckedChange={() => onToggleTodo(todo.id)}
      className="h-6 w-6"
    />

    <div className="ml-4 flex-1 flex justify-between items-center min-w-0">
      <div className="flex flex-col min-w-0"> 

        {isEditing ? (
            <Input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave} 
              onKeyDown={handleKeyDown}
              className="text-lg h-9"
            />
          ) : (
            <label
              htmlFor={`todo-${todo.id}`}
              onDoubleClick={() => setIsEditing(true)} 
              className={`text-lg cursor-pointer truncate ...`}
            >
              {todo.text}
            </label>
          )}
        {todo.dueDate && (
          <p className={`text-sm ${ isPast(parse(todo.dueDate, 'yyyy-MM-dd', new Date())) && !isToday(parse(todo.dueDate, 'yyyy-MM-dd', new Date())) ? 'text-red-500' : 'text-gray-500'}`}>
            {format(parse(todo.dueDate, 'yyyy-MM-dd', new Date()), "MMM d")}
          </p>
        )}
      </div>

      {todo.imageUrl && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2 flex-shrink-0">
              <Paperclip className="h-5 w-5 text-pink-500" />
              <span className="sr-only">View Attached Image</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Attached Image</DialogTitle>
              </DialogHeader>
              <div className="mt-4 relative aspect-video"> 
                <Image
                  src={todo.imageUrl}
                  alt={`Image for ${todo.text}`}
                  fill
                  className="object-contain rounded-md" 
                />
              </div>
          </DialogContent>
        </Dialog>
      )}
    </div>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDeleteTodo(todo.id)}
      aria-label="Delete todo"
      className="ml-2" 
    >
      <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
    </Button>
  </motion.div>
  );
};