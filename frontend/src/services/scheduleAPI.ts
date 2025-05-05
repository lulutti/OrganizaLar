import api from "./api"; // Importa a instância do Axios
import { Task } from "./tasksApi";

export enum CleaningScheduleStatus {
  IN_PROGRESS = "in_progress",
  CANCELLED = "cancelled",
  DONE = "done",
}

export enum ScheduleTaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export interface CleaningSchedule {
    id: string;
    title: string;
    status: CleaningScheduleStatus;
    tasks: CleaningScheduleTask[];
}

export interface CleaningScheduleTask {
  id: string;
  status: ScheduleTaskStatus;
  completedAt: string | null;
  task: Task;
  assigned_to?: {
    id: string;
    name: string;
  } | null;
}

export interface CreateCleaningSchedule {
  userId: string;
  taskIds: string[];
  title: string;
}

export interface UpdateCleaningScheduleTaskDto {
  cleaningScheduleId?: string;
  taskId: string;
  newStatus: ScheduleTaskStatus;
}

export const scheduleAPI = {
  create: async (
    createCleaningSchedule: CreateCleaningSchedule,
    accessToken: string
  ): Promise<CleaningSchedule> => {
    const response = await api.post("/cleaning-schedule", createCleaningSchedule, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  findActiveByUser: async (
    userId: string,
    accessToken: string
  ): Promise<CleaningSchedule> => {
    const response = await api.get(`/cleaning-schedule/active/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: CleaningScheduleStatus,
    accessToken: string
  ): Promise<CleaningSchedule> => {
    const response = await api.patch(
      `/cleaning-schedule/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  updateTaskStatus: async (
    updateDto: UpdateCleaningScheduleTaskDto,
    accessToken: string
  ): Promise<CleaningSchedule> => {
    const response = await api.patch("/cleaning-schedule/tasks", updateDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};