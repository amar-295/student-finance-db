import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple sanity test to verify RTL and Vitest are working
describe('Sanity Test', () => {
    it('should render a simple component', () => {
        render(<div>Hello Vitest</div>);
        expect(screen.getByText(/Hello Vitest/i)).toBeInTheDocument();
    });
});
