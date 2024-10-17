export interface DayTodo {
  day: string,
  date: string,
  tasks: Array<Todo>
}

export interface Todo {
  id: number,
  title: string,
  description: string,
  date: string,
  todoOrder: number
  IsCHE: boolean,
  checked: boolean,
  deleted?: boolean
}

export interface newTodoRequirements {
  title: string,
  description: string,
  date?: string
}


//Category
export interface Category {
  id: number,
  term: string,
  color: string,
}


// Appointments
export interface NewAppointment {
  title: string,
  description: string,
  date: string,
  enddate: string,
  isAllDay: boolean,
  starttime: string,
  endtime: string,
  location: string,
  category: { id: number, term: string }
}

export interface Appointment {
  id: number,
  userid: number,
  title: string,
  description: string,
  date: string,
  enddate: string,
  isAllDay: boolean,
  starttime: string,
  endtime: string,
  location: string,
  category: Category,
  ics_import_id: number,
  width?: number,
  left?: number,
}


export interface appointmentCategory{
  id: number,
  term: string,
  color: string,
  userid?: number
  isdefault: boolean
}

export interface backup{
  userid: number,
  username: string,
  email: string,
  timecreated: string,
  templatev: number,
  todos: Array<Todo>,
  appointments: Array<Appointment>,
  categories: Array<appointmentCategory>
}

export interface ICS_import {
  id: number,
  ics_url: string,
  ics_last_synced_at: string
}

export interface UserData {
  username: string,
  email: string,
  ics_imports: Array<ICS_import>
}
