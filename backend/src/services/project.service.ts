import pool from '../config/db'
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../validators/project.validator'

const verifyClientOwnerhip = async (userId: number, clientId: number) => {
  const result = await pool.query(
    `SELECT id FROM clients WHERE id=$1 AND user_id =$2`,
    [clientId, userId]
  )
  if (result.rows.length === 0) {
    throw new Error('Client not found')
  }
}

export const getAllProjects = async (userId: number, clientId: number) => {
  await verifyClientOwnerhip(userId, clientId)

  const result = await pool.query(
    `SELECT * FROM projects WHERE client_id = $1 ORDER BY id DESC`,
    [clientId]
  )
  return result.rows
}

export const getProjectById = async (
  userId: number,
  clientId: number,
  projectId: number
) => {
  await verifyClientOwnerhip(userId, clientId)

  const result = await pool.query(
    'SELECT * FROM projects WHERE id=$1 AND client_id=$2 ',
    [projectId, clientId]
  )
  if (result.rows.length === 0) {
    throw new Error('Project not found')
  }
  result.rows[0]
}

export const createProject = async (
  userId: number,
  clientId: number,
  input: CreateProjectInput
) => {
  await verifyClientOwnerhip(userId, clientId)

  const { title, description, status, deadline } = input

  const result = await pool.query(
    `INSERT INTO projects (client_id,title,description,status,deadline)
    VALUES ($1,$2,$3,COALESCE($4,'active),$5)
    RETURNING *`,
    [clientId, title, description, status, deadline]
  )
  return result.rows[0]
}

export const updateProject = async (
  userId: number,
  clientId: number,
  projectId: number,
  input: UpdateProjectInput
) => {
  const existing: any = await getProjectById(userId, clientId, projectId)

  const updated = { ...existing, ...input }

  const result = await pool.query(
    `UPDATE projects
     SET title = $1, description = $2, status = $3, deadline = $4
     WHERE id = $5 AND client_id = $6
     RETURNING *`,
    [
      updated.title,
      updated.description,
      updated.status,
      updated.deadline,
      projectId,
      clientId,
    ]
  )

  return result.rows[0]
}

export const deleteProject = async (
  userId: number,
  clientId: number,
  projectId: number
) => {
  await verifyClientOwnerhip(userId, clientId)

  const result = await pool.query(
    `DELET FROM projects WHERE id = $1 AND client_id=$2 RETURNING id`,
    [projectId, clientId]
  )

  if (result.rows.length === 0) {
    throw new Error('Project not found')
  }

  return { id: result.rows[0].id }
}
