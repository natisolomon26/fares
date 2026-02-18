// app/dashboard/members/types/index.ts
export interface Child {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
}

export interface Member {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  isFamily: boolean
  children: Child[]
  createdAt: string
  updatedAt: string
}

export interface NewMemberForm {
  firstName: string
  middleName: string
  lastName: string
  phone: string
  isFamily: boolean
  children: Array<{
    firstName: string
    middleName: string
    lastName: string
  }>
}