import api from "./api";

export interface Contributor {
  id: string;
  name: string;
  userId: string;
}

export type CreateContributor = Omit<Contributor, "id">;
export type UpdateContributor = Partial<Omit<Contributor, "id">>;

export const contributorsAPI = {
  getContributors: async (accessToken: string): Promise<Contributor[]> => {
    const response = await api.get(`/contributors/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getContributor: async (id: string, accessToken: string): Promise<Contributor> => {
    const response = await api.get(`/contributors/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  createContributor: async (
    contributor: CreateContributor,
    accessToken: string
  ): Promise<Contributor> => {
    const response = await api.post("/contributors", contributor, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateContributor: async (
    id: string,
    update: UpdateContributor,
    accessToken: string
  ): Promise<Contributor> => {
    const response = await api.put(`/contributors/${id}`, update, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteContributor: async (id: string, accessToken: string): Promise<void> => {
    await api.delete(`/contributors/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
