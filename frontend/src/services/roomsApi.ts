import api from "./api"; // Importa a instância do Axios

export interface Room {
    id: string;
    name: string;
    description?: string;
}


export type CreateRoom = Omit<Room, "id">


export const roomsAPI = {
    getRoomsByUser: async (userId: string, accessToken: string): Promise<Room[]> => {
        const response = await api.get(`/rooms/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    getRoom: async (id: string, accessToken: string): Promise<Room> => {
        const response = await api.get(`/rooms/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    createRoom: async (createRoom: CreateRoom, accessToken: string, userId: string): Promise<Room> => {
        const response = await api.post("/rooms", { ...createRoom, userId: userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    updateRoom: async (updateRoom: Room, accessToken: string): Promise<Room> => {
        const response = await api.patch(`/rooms/${updateRoom.id}`, updateRoom, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },

    deleteRoom: async (id: string, accessToken: string): Promise<void> => {
        await api.delete(`/rooms/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },
};
