/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Footer from './Footer';

// Mock useWindowSize hook following FSD pattern
const { mockUseWindowSize } = vi.hoisted(() => ({
  mockUseWindowSize: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
}));

vi.mock('@shared/lib/hooks/useWindowSize', () => ({
  useWindowSize: mockUseWindowSize,
}));

afterEach(() => cleanup());

describe('Footer Component', () => {
  it('renders footer with Keeptrip brand name', () => {
    render(<Footer />);
    const keeptrip = screen.getByText('Keeptrip');
    expect(keeptrip).toBeInTheDocument();
  });

  it('renders footer with navigation links', () => {
    render(<Footer />);
    // Links use i18n keys which are returned as-is by the mock
    // Use getAllByRole since we have 3 links 
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    
    expect(links[0]).toHaveTextContent('footer.terms');
    expect(links[1]).toHaveTextContent('footer.privacy');
    expect(links[2]).toHaveTextContent('footer.contact');
  });

  it('renders links with correct href attributes', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    
    expect(links[0]).toHaveAttribute('href', '#terms');
    expect(links[1]).toHaveAttribute('href', '#privacy');
    expect(links[2]).toHaveAttribute('href', '#contact');
  });

  it('renders dynamic copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    const copyrightElement = screen.getByText(new RegExp(`© ${currentYear}.*Keeptrip`));
    expect(copyrightElement).toBeInTheDocument();
  });

  it('renders copyright text using i18n', () => {
    render(<Footer />);
    // i18n mock returns keys as-is
    const paragraphs = screen.getAllByText(/© \d{4}/);
    const copyrightPara = paragraphs[0];
    expect(copyrightPara).toBeInTheDocument();
  });

  it('has correct semantic footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders footer content within proper wrapper structure', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const wrapper = footer?.querySelector('div');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders three navigation links total', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('responds to mobile/desktop breakpoint using useWindowSize hook', () => {
    render(<Footer />);
    expect(mockUseWindowSize).toHaveBeenCalled();
  });
});
