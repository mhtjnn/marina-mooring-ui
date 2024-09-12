
import { render, fireEvent } from '@testing-library/react';
import InputTextWithHeader from './InputTextWithHeader';

describe('InputTextWithHeader Component', () => {
  it('renders the header correctly', () => {
    const { getByText } = render(
      <InputTextWithHeader
        header="Boatyards Detail"
        placeholder="Search by name, ID,address..."
        inputTextStyle={{ width: '80vh', fontSize: '0.65rem', color: '#A4A4A4', border: '1px solid #9F9F9F', borderRadius: 'md', paddingLeft: '10px' }}
      />
    );
    const headerElement = getByText('Boatyards Detail');
    expect(headerElement).toBeInTheDocument();
  });

  it('renders the input field correctly', () => {
    const { getByPlaceholderText } = render(
      <InputTextWithHeader
        header="Boatyards Detail"
        placeholder="Search by name, ID,address..."
        inputTextStyle={{ width: '80vh', fontSize: '0.65rem', color: '#A4A4A4', border: '1px solid #9F9F9F', borderRadius: 'md', paddingLeft: '10px' }}
      />
    );
    const inputElement = getByPlaceholderText('Search by name, ID,address...');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onChange callback when input value changes', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <InputTextWithHeader
        header="Boatyards Detail"
        placeholder="Search by name, ID,address..."
        inputTextStyle={{ width: '80vh', fontSize: '0.65rem', color: '#A4A4A4', border: '1px solid #9F9F9F', borderRadius: 'md', paddingLeft: '10px' }}
        onChange={mockOnChange}
      />
    );
    const inputElement = getByPlaceholderText('Search by name, ID,address...');
    fireEvent.change(inputElement, { target: { value: 'Test' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
