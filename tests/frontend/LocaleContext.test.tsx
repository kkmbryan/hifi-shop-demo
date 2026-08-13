import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider, useLocale } from '../../src/frontend/src/context/LocaleContext';

const TestComponent: React.FC = () => {
  const { locale, setLocale, t, terms } = useLocale();

  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="term-dacs">{terms.dacs}</span>
      <span data-testid="term-amplifiers">{terms.amplifiers}</span>
      <span data-testid="term-tubeAmps">{terms.tubeAmps}</span>
      <span data-testid="term-streamers">{terms.streamers}</span>
      <span data-testid="translated-title">{t('siteTitle')}</span>
      <span data-testid="translated-param">{t('resultsCount', { count: 12 })}</span>
      <button onClick={() => setLocale('en-US')}>Switch to English</button>
      <button onClick={() => setLocale('zh-HK')}>Switch to Chinese</button>
    </div>
  );
};

describe('LocaleContext Unit & Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default to Traditional Chinese (zh-HK) and verify Hong Kong audio terms', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('zh-HK');
    expect(screen.getByTestId('term-dacs')).toHaveTextContent('解碼器');
    expect(screen.getByTestId('term-amplifiers')).toHaveTextContent('擴音機');
    expect(screen.getByTestId('term-tubeAmps')).toHaveTextContent('膽機');
    expect(screen.getByTestId('term-streamers')).toHaveTextContent('網絡播放器');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('雅詠音響 Aria Audio | 頂級發燒音響專門店');
    expect(screen.getByTestId('translated-param')).toHaveTextContent('共找到 12 款極品音響器材');
  });

  it('should switch language to English (en-US) and verify English audio terms', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Switch to English' }));

    expect(screen.getByTestId('current-locale')).toHaveTextContent('en-US');
    expect(screen.getByTestId('term-dacs')).toHaveTextContent('DACs');
    expect(screen.getByTestId('term-amplifiers')).toHaveTextContent('Amplifiers');
    expect(screen.getByTestId('term-tubeAmps')).toHaveTextContent('Vacuum Tube Amps');
    expect(screen.getByTestId('term-streamers')).toHaveTextContent('Network Streamers');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('Aria Audio | Flagship Audiophile Store');
    expect(screen.getByTestId('translated-param')).toHaveTextContent('Found 12 flagship audio components');

    // Verify localStorage update
    expect(localStorage.getItem('hifi_locale')).toBe('en-US');
  });

  it('should restore saved locale from localStorage on initialization', () => {
    localStorage.setItem('hifi_locale', 'en-US');

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('en-US');
    expect(screen.getByTestId('term-tubeAmps')).toHaveTextContent('Vacuum Tube Amps');
  });

  it('should throw error if useLocale is used outside of LocaleProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useLocale must be used within a LocaleProvider');

    consoleSpy.mockRestore();
  });
});
