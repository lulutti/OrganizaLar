import api from "./api"; // Importa a instância do Axios
import { Room } from "./roomsApi";
import { ScheduleTaskStatus } from "./scheduleAPI";

export interface Task {
    id: string;
    name: string;
    description?: string;
    roomId?: string;
    lastTimeDone?: Date;
    planned?: boolean;
    status?: ScheduleTaskStatus;
    room?: Room;
}


export type CreateTask = Omit<Task, "id">


export const tasksAPI = {
    getTasksByUser: async (userId: string, accessToken: string): Promise<Task[]> => {
        const response = await api.get(`/tasks/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    createTask: async (createTask: CreateTask, accessToken: string, userId: string): Promise<Task> => {
        const response = await api.post("/tasks", { ...createTask, userId: userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    updateTask: async (updateTask: Task, accessToken: string): Promise<Task> => {
        const response = await api.patch(`/tasks/${updateTask.id}`, updateTask, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    deleteTask: async (id: string, accessToken: string): Promise<void> => {
        await api.delete(`/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },
};
