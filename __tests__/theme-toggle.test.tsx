import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeToggle } from '@/components/theme-toggle'
import * as nextThemes from 'next-themes'

vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}))

describe('ThemeToggle Component', () => {
    it('switches the theme to dark when clicked in light mode', () => {
        const setThemeMock = vi.fn()

        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'light',
            setTheme: setThemeMock,
            themes: ['light', 'dark', 'system'],
            systemTheme: 'light'
        })

        render(<ThemeToggle />)

        const button = screen.getByRole('button', { name: /toggle theme/i })
        fireEvent.click(button)

        expect(setThemeMock).toHaveBeenCalledWith('dark')
    })
})