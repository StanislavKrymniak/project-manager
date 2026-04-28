import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateTaskModal } from '@/components/create-task-modal'

vi.mock('@/app/actions/tasks', () => ({
    createTask: vi.fn().mockResolvedValue({ success: true })
}))

beforeEach(() => {
    vi.clearAllMocks()
})

describe('CreateTaskModal Custom Component', () => {

    it('opens the modal when the trigger button is clicked', () => {
        render(<CreateTaskModal projectId="fake-id-123" />)

        expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()

        const triggerBtn = screen.getByRole('button', { name: /create task/i })
        fireEvent.click(triggerBtn)

        expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    it('shows a Zod validation error if the user tries to save an empty task', async () => {
        render(<CreateTaskModal projectId="fake-id-123" />)

        fireEvent.click(screen.getByRole('button', { name: /create task/i }))

        const saveBtn = screen.getByRole('button', { name: /save task/i })
        fireEvent.click(saveBtn)

        await waitFor(() => {
            expect(screen.getByText('Task title is required')).toBeInTheDocument()
        })
    })
})