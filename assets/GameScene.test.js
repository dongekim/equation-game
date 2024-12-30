const { render, screen } = require('@testing-library/react');
const GameScene = require('./GameScene');

test('renders GameScene component', () => {
	render(<GameScene />);
	const linkElement = screen.getByText(/Game Scene/i);
	expect(linkElement).toBeInTheDocument();
});