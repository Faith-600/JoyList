"use client";

import { useState } from "react";
import { type Project } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, Trash2, Pencil } from "lucide-react";

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (name: string) => void;
  onUpdateProject: (id: string, newName: string) => void; 
  onDeleteProject: (id: string) => void;                
}

export const Sidebar = ({ projects, selectedProjectId, onSelectProject, onAddProject, onUpdateProject, onDeleteProject }: SidebarProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const [renameText, setRenameText] = useState("");
  

  const handleAddProject = () => {
    onAddProject(newProjectName);
    setNewProjectName("");
    setIsAddDialogOpen(false);
  };
  const openRenameDialog = (project: Project) => {
    setProjectToRename(project);
    setRenameText(project.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameProject = () => {
    if (projectToRename) {
      onUpdateProject(projectToRename.id, renameText);
    }
    setIsRenameDialogOpen(false);
    setProjectToRename(null);
    setRenameText("");
  };

  return (
    <aside className="w-64 p-4 space-y-4 bg-secondary rounded-lg h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Project Name (e.g., House Chores)"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleAddProject} disabled={!newProjectName.trim()}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
     </div>
      <nav>
        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project.id} className="group flex items-center w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <Button
                variant={project.id === selectedProjectId ? "secondary" : "ghost"}
                className="w-full justify-start flex-1"
                onClick={() => onSelectProject(project.id)}
              >
                {project.name}
              </Button>
              {project.id !== "inbox" && ( 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => openRenameDialog(project)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the &quot;{project.name}&quot; project and all of its tasks. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteProject(project.id)} className="bg-red-500 hover:bg-red-600">
                            Yes, delete it
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Project</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input value={renameText} onChange={(e) => setRenameText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRenameProject()} />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleRenameProject} disabled={!renameText.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};