import api from "./api";

interface SignInResponse {
  access_token: string;
}

export const authAPI = {
  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot", { email });
  },

  validateToken: async (
    token: string
  ): Promise<{ isValid: boolean; userId: string; userName: string }> => {
    try {
      const response = await api.post("/auth/validate-token", { token });
      if (!response.status) {
        throw new Error("Token inválido");
      } else {
        return { isValid: true, userId: response.data.userId, userName: response.data.userName };
      }
    } catch (error) {
      return { isValid: false, userId: "", userName: "" };
    }
  },
};
