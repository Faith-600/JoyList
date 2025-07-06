"use client";

import { useState,useRef } from "react";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon,XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ImagePlus } from "lucide-react";
import Image from "next/image";


interface TodoInputProps {
  onAddTodo: (text: string,dueDate?: Date,imageUrl?: string) => void;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);


    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

     if (dueDate && dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
  toast.error("Invalid Date", {
    description: "You cannot select a date in the past.",
  });
  return;
}
  if (text.trim()) {
      onAddTodo(text,dueDate,imageDataUrl || undefined);
      setText("");
      setDueDate(undefined); 
      setImageDataUrl(null);

       if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("✅ Task added!", {
        description: `"${text}" is on the list. You got this!`,
      });
    } else {
      toast.error("Whoops!", {
        description: "You can't add an empty task.",
      });
    }
  };

   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { 
      toast( "Whoa, that's a big image!"+  "Please choose an image smaller than 1MB.");
      return;
    }
      const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const clearImage = () => {
      setImageDataUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
  <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
  <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
    <Input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="e.g., Water the plants 🪴"
      className="flex-1"
    />

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dueDate}
          onSelect={setDueDate}
          initialFocus
          disabled={(date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0))
          }
        />
      </PopoverContent>
    </Popover>

    <Button type="submit" className="w-fit">
      Add Task
    </Button>
  </div>

  <div className="flex flex-col gap-2">
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleImageSelect}
      accept="image/*"
      className="hidden"
    />

    {!imageDataUrl && (
      <Button
        type="button"
        variant="outline"
        onClick={triggerFileSelect}
        className="w-fit"
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Add Image (Optional)
      </Button>
    )}

    {imageDataUrl && (
      <div className="relative w-32 h-32 rounded-md overflow-hidden">
        <Image
          src={imageDataUrl}
          alt="Preview"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6"
          onClick={clearImage}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    )}
  </div>
</form>

  );
};
