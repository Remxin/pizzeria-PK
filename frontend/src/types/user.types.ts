export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
  address?: string
}
