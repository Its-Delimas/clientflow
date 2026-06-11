export interface User {
    id:number
    email:string
    password_hash: string
    created_at: Date
}

export interface Client {
    id:number
    user_id:number
    name:string
    email:string
    company:string
    status:string
}

export interface Project {
    id:number
    client_id: number
    title: string
    description:string
    status:string
    deadline:Date
}

export interface Task {
    id:number
    project_id:number
    title:string
    status:string
    priority:string
    due_date:Date
}

export interface AuthRequest extends Request {
    user?:{id:number;email:string}
}