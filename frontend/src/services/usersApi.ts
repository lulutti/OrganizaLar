import api from "./api"; // Importa a instância do Axios

interface User {
    id: string;
    name: string;
    email: string;
}

interface CreateUser {
    name: string;
    email: string;
    password: string;
    secretQuestion: string;
    secretAnswer: string;
}

export const usersAPI = {
    createUser: async (createUser: CreateUser): Promise<User> => {
        const response = await api.post("/users", createUser);
        return response.data;
    },

    resetPassword: async (id: string, newPassword: string): Promise<void> => {
        await api.patch("/users/reset", { id, password: newPassword });
    },

    getUser: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
};
