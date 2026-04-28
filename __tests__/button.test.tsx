import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Shadcn Button Component', () => {

    it('renders the correct text', () => {
        render(<Button>BUTTON</Button>)

        const button = screen.getByText('BUTTON')

        expect(button).toBeInTheDocument()
    })

    it('fires an event when clicked', () => {
        const handleClick = vi.fn()

        render(<Button onClick={handleClick}>Submit</Button>)

        const button = screen.getByText('Submit')
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })
})