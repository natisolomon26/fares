// app/dashboard/leaving/types/index.ts
export interface Member {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  isFamily?: boolean
  children?: any[]
}

export interface LeavingCertificate {
  _id: string
  certificateNumber: string
  memberId: {
    _id: string
    firstName: string
    middleName?: string
    lastName: string
    phone: string
  }
  reason: 'transfer' | 'relocation' | 'personal' | 'other'
  transferChurch?: string
  status: 'active' | 'revoked' | 'archived'
  leavingDate: string
  issueDate: string
  notes?: string
  churchId?: {
    _id: string
    name: string
    address?: string
    phone?: string
    email?: string
  }
  pastorId?: {
    _id: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface Summary {
  totalLeavings: number
  recentLeavings: number
  totalMembers: number
  leavingRate: number
  statuses: {
    active: number
    revoked: number
    archived: number
  }
  reasons: {
    transfer: number
    relocation: number
    personal: number
    other: number
  }
}