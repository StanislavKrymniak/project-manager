"use client";

import { useState, useEffect, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {CreateTaskModal} from "@/components/create-task-modal";
import { Button } from "@/components/ui/button";
import { updateTaskStatus, deleteTask} from "@/app/actions/tasks";
import { Loader2, Trash2 } from "lucide-react";
import {getPriorityColor} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

const columns = ["TODO", "IN_PROGRESS", "DONE"];

export default function KanbanBoard({
                                        initialTasks,
                                        projectId,
                                    }: {
    initialTasks: { id: string; title: string; status: string; priority: string}[],
    projectId: string,
}) {
    // State to hold our tasks
    const [tasks, setTasks] = useState(initialTasks);
    const [isMounted, setIsMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Fix for Next.js hydration issues with drag and drop
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newTasks = [...tasks];
        const taskIndex = newTasks.findIndex((t) => t.id === draggableId);
        if (taskIndex === -1) return;

        newTasks[taskIndex].status = destination.droppableId;
        setTasks(newTasks);

        // 2. Background Database Update (Send to MongoDB)
        await updateTaskStatus(draggableId, destination.droppableId, projectId);
    };



    if (!isMounted) return null;

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center ">
                <CreateTaskModal projectId={projectId} />
            </div>

            {/* Kanban Board Container */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex overflow-x-auto h-full pb-4 gap-6 snap-x snap-mandatory hide-scrollbar lg:justify-center">
                    {columns.map((column) => (
                        <div key={column} className="flex flex-col bg-muted/30 rounded-xl p-4 min-w-[85vw] md:min-w-[320px] shrink-0 snap-center border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-sm text-muted-foreground">
                                    {column.replace("_", " ")}
                                </h3>
                                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                    {tasks.filter((t) => t.status === column).length}
                                </span>
                            </div>

                            <Droppable droppableId={column}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-col gap-3 min-h-[150px] h-full"
                                    >
                                        {tasks
                                            .filter((task) => task.status === column)
                                            .map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Card className="cursor-grab hover:border-primary/50 transition-colors shadow-sm bg-card group">
                                                                <CardHeader className=" pb-2">
                                                                    <div className="flex justify-between items-center ">
                                                                        <CardTitle className="text-sm font-medium leading-none">
                                                                            {task.title}
                                                                        </CardTitle>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-muted-foreground opacity-0 cursor:pointer; group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                                            onClick={() => {
                                                                                startTransition(async () => {
                                                                                    await deleteTask(task.id, projectId);
                                                                                });
                                                                            }}
                                                                            disabled={isPending}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                </CardHeader>
                                                                <CardContent className="pt-0 text-xs text-muted-foreground mt-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>Status: <span className="font-semibold text-foreground/70">{task.status}</span></div>
                                                                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                                                            {task.priority} Priority
                                                                        </Badge>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}