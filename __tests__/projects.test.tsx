import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProject } from '@/app/actions/projects'
import { db } from '@/lib/db'
import { auth } from '@/auth'

vi.mock('@/lib/db', () => ({
    db: {
        project: { create: vi.fn() },
    },
}))

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

describe('Project Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects project creation if the user is not logged in', async () => {
        ;(vi.mocked(auth) as any).mockResolvedValue(null)

        const result = await createProject({ name: 'Hacked Project' })

        expect(result).toBeInstanceOf(Error)
        expect(db.project.create).not.toHaveBeenCalled()
    })

    it('successfully saves a project to the database for an authenticated user', async () => {
        ;(vi.mocked(auth) as any).mockResolvedValue({ user: { id: 'user-123', name: 'Stanislav' } })
        vi.mocked(db.project.create).mockResolvedValue({ id: 'proj-789', name: 'My New App' } as any)

        const result = await createProject({ name: 'My New App' })
        
        if (result instanceof Error) {
            throw new Error('Expected successful response, got Error')
        }

        expect(db.project.create).toHaveBeenCalledWith({
            data: { name: 'My New App', userId: 'user-123' }
        })
        expect(result.success).toBe(true)
        if ('projectId' in result) {
            expect(result.projectId).toBe('proj-789')
        }
    })
})