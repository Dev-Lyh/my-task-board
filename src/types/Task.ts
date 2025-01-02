export interface Task {
  _id?: string;
  board: string;
  description: string;
  icon: string;
  name: string;
  status: "IN_PROGRESS" | "COMPLETED" | "WONT_DO" | "NONE"
}