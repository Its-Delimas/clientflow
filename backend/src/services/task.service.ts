import pool from '../config/db'
import { createTaskInput, updateTaskInput } from '../validators/task.validator'

const verifyProjectOwnership = async (
  userId: number,
  clientId: number,
  projectId: number
) => {
  const result = await pool.query(
    `SELECT projects.id FROM projects
         JOIN clients ON projects.client_id = clients.id
         WHERE projects.id = $1 AND clients.id = $2 AND clients.user_id = $3`,
    [projectId, clientId, userId]
  )

  if (result.rows.length == 0) {
    throw new Error('Project not found')
  }
}

export const getAllTasks = async (
  userId: number,
  clientId: number,
  projectId: number
) => {
  await verifyProjectOwnership(userId, clientId, projectId)

  const result = await pool.query(
    `SELECT * FROM tasks WHERE project_id = $1 ORDER BY id DESC`,
    [projectId]
  )
  return result.rows
}

export const getTaskById = async (
  userId: number,
  clientId: number,
  projectId: number,
  taskId: number
) => {
  await verifyProjectOwnership(userId, clientId, projectId)

  const result = await pool.query(
    `SELECT * FROM tasks WHERE id = $1 AND project_id = $2`,
    [taskId, projectId]
  )

  if (result.rows.length === 0) {
    throw new Error('Task not found')
  }

  return result.rows[0]
}

export const createTask = async (
  userId: number,
  clientId: number,
  projectId: number,
  input: createTaskInput
) => {
  await verifyProjectOwnership(userId, clientId, projectId)

  const { title, status, priority, due_date } = input

  const result = await pool.query(
    `INSERT INTO tasks (project_id,title,status,priority,due_date)
    VALUES ($1,$2,COALESCE($3,'todo'),COALESCE($4,'medium'),$5)
      RETURNING *`,
    [projectId, title, status, priority, due_date]
  )

  return result.rows[0]
}

export const updateTask = async (
  userId: number,
  clientId: number,
  projectId: number,
  taskId: number,
  input: updateTaskInput
) => {
  const existing: any = await getTaskById(userId, clientId, projectId, taskId)

  const updated = { ...existing, ...input }
  const result = await pool.query(
    `UPDATE tasks 
      SET title=$1, status=$2, priority=$3, due_date=$4
      WHERE id = $5 AND project_Id = $6
      RETURNING *`,
    [
      updated.title,
      updated.status,
      updated.priority,
      updated.due_date,
      taskId,
      projectId,
    ]
  )
  return result.rows[0]
}

export const deleteTask = async (
  userId: number,
  clientId: number,
  projectId: number,
  taskId: number
) => {
  await verifyProjectOwnership(userId, clientId, projectId)
  const result = await pool.query(
    `DELETE FROM tasks WHERE id=$1 AND project_Id = $2 RETURNING id`,
    [taskId, projectId]
  )
  if (result.rows.length === 0) {
    throw new Error('Task not found')
  }
  return { id: result.rows[0].id }
}
