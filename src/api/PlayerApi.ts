import { api } from "./axiosInstance";
import { type Player } from "../types/Player";

const API = "/players";

export const fetchAllPlayers = async (): Promise<Player[]> => {
  const res = await api.get<Player[]>(API);
  return res.data;
};

export const fetchPlayerById = async (id: number): Promise<Player> => {
  const res = await api.get<Player>(`${API}/${id}`);
  return res.data;
};