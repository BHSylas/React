export interface Player {
  id: number;
  name: string;
  body: string;
  type: string;
  team: string;
  mediaUrl: string | null;   // nullable
  awards: string[];
}