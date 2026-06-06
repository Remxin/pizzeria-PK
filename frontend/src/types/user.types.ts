export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'ADMIN'

export interface User {
  id: number
  email: string
  role: UserRole
  fullName?: string | null
  phone?: string | null
  address?: string | null
}
