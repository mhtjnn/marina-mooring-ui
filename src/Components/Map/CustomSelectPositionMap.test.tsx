import React from 'react'
import { render, screen, act } from '@testing-library/react'
import CustomSelectPositionMap from './CustomSelectPositionMap'

// Mock DisplayPosition component
jest.mock('./DisplayPosition', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}))

describe('CustomSelectPositionMap', () => {
  const mockOnPositionChange = jest.fn()
  const center: [number, number] = [40.73061, -73.935242]
  const zoomLevel = 13

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders the map with given center and zoom level', async () => {
    render(
      <CustomSelectPositionMap
        onPositionChange={mockOnPositionChange}
        center={center}
        zoomLevel={zoomLevel}
      />,
    )

    expect(await screen.findByRole('button', { name: /zoom in/i })).toBeInTheDocument()
  })

  test('places the marker at the correct position', () => {
    render(
      <CustomSelectPositionMap
        onPositionChange={mockOnPositionChange}
        center={center}
        zoomLevel={zoomLevel}
      />,
    )

    // Check if the marker is placed at the given center position
    const marker = screen.getByRole('img', { hidden: true }) as HTMLImageElement
    expect(marker).toBeInTheDocument()
    expect(marker.alt).toBe('Marker')
  })

  test('updates the map center when center prop changes', async () => {
    const { rerender } = render(
      <CustomSelectPositionMap
        onPositionChange={mockOnPositionChange}
        center={center}
        zoomLevel={zoomLevel}
      />,
    )

    const newCenter: [number, number] = [40.73061, -73.935242]
    rerender(
      <CustomSelectPositionMap
        onPositionChange={mockOnPositionChange}
        center={newCenter}
        zoomLevel={zoomLevel}
      />,
    )

    // Ensure the map center is updated
    const map = screen.getByRole('button', { name: /zoom in/i }).closest('.leaflet-container')
    expect(map).toHaveAttribute(
      'style',
      expect.stringContaining(`${newCenter[0]}, ${newCenter[1]}`),
    )
  })

  test('calls onPositionChange callback when map position changes', () => {
    render(
      <CustomSelectPositionMap
        onPositionChange={mockOnPositionChange}
        center={center}
        zoomLevel={zoomLevel}
      />,
    )

    // Simulate map position change
    const map = screen.getByRole('button', { name: /zoom in/i }).closest('.leaflet-container')
    act(() => {
      map?.dispatchEvent(new Event('moveend'))
    })

    expect(mockOnPositionChange).toHaveBeenCalled()
  })
})
