import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
 it('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
 })

 it('applies variant classes correctly', () => {
  render(<Button variant="destructive">Delete</Button>)
  const button = screen.getByRole('button', { name: 'Delete' })
  expect(button).toHaveClass('bg-destructive')
 })

 it('handles click events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  const button = screen.getByRole('button', { name: 'Click me' })
  button.click()

  expect(handleClick).toHaveBeenCalledTimes(1)
 })
})
