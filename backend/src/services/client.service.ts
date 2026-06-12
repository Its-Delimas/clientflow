import pool from '../config/db'
import {
  CreateClientInput,
  updateClientSchema,
} from '../validators/client.validator'

export const getAllClients = async (userId: number) => {
  const result = await pool.query(
    'SELECT * FROM clients WHERE user_id = $1 ORDER BY id DESC',
    [userId]
  )
  return result.rows
}

export const getClientsById = async (userId: number, clientId: number) => {
  const result = await pool.query(
    'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
    [clientId, userId]
  )

  if (result.rows.length === 0) {
    throw new Error('Client not found')
  }

  return result.rows[0]
}

export const createClient = async (
  userId: number,
  input: CreateClientInput
) => {
  const { name, email, company, status } = input

  const result = await pool.query(
    `INSERT INTO clients (user_id,name,email,company,status)
            VALUES ($1 ,$2, $3,$4, COALESCE($5,'active'))
            RETURNING * `,
    [userId, name, email, company, status]
  )
  return result.rows[0]
}

export const updateClient = async (
  userId: number,
  clientId: number,
  input: updateClientSchema
) => {
  const existing: any = await getClientsById(userId, clientId)
  const updated = { ...existing, ...input }
  const result = await pool.query(
    `UPDATE clients
        SET name=$1, email=$2,company=$3,status=$4
        WHERE id = $5 AND user_id = $6
        RETURNING *`,
    [
      updated.name,
      updated.email,
      updated.company,
      updated.status,
      clientId,
      userId,
    ]
  )
  return result.rows[0]
}

export const deleteClient = async (userId: number, clientId: number) => {
  const result = await pool.query(
    `DELET FROM clients WHERE id = $1 AND user_id = $2 RETURNING id`,
    [clientId, userId]
  )
  if (result.rows.length === 0) {
    throw new Error('Client not found')
  }
  return { id: result.rows[0].id }
}
