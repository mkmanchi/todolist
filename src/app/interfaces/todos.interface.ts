export interface TODOS {
  name: string;
  status: string;
}

export interface TODOList {
  username: string;
  todos: TODOS[];
}
