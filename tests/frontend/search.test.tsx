import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../src/frontend/src/pages/index';
import { Header } from '../../src/frontend/src/components/Header';
import { LocaleProvider } from '../../src/frontend/src/context/LocaleContext';
import { CartProvider } from '../../src/frontend/src/context/CartContext';
import { MOCK_PRODUCTS } from './mockProducts';
import { Category } from '../../src/frontend/src/data/products';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockRouterQuery: Record<string, any> = {};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: mockRouterQuery,
      asPath: '/',
      push: mockPush,
      replace: (target: any, as?: any, options?: any) => {
        if (target && target.query) {
          mockRouterQuery = target.query;
        }
        mockReplace(target, as, options);
        return Promise.resolve(true);
      },
      isReady: true,
    };
  },
}));

const MOCK_CATEGORIES: Category[] = [
  { id: 'dacs', category_id: 'dacs', nameEn: 'DACs', nameZh: '解碼器', slug: 'dacs', descriptionEn: 'DACs', descriptionZh: '解碼器', icon: 'Cpu', display_order: 1 },
  { id: 'amplifiers', category_id: 'amplifiers', nameEn: 'Amplifiers', nameZh: '擴音機', slug: 'amplifiers', descriptionEn: 'Amps', descriptionZh: '擴音機', icon: 'Zap', display_order: 2 },
  { id: 'head-fi', category_id: 'head-fi', nameEn: 'Headphones', nameZh: '耳機', slug: 'head-fi', descriptionEn: 'Headphones', descriptionZh: '耳機', icon: 'Headphones', display_order: 3 },
  { id: 'head-fi-amp', category_id: 'head-fi-amp', nameEn: 'Headphone Amps', nameZh: '耳機擴音機', slug: 'head-fi-amp', descriptionEn: 'Headphone Amps', descriptionZh: '耳機擴音機', icon: 'Radio', display_order: 4 },
  { id: 'streamers', category_id: 'streamers', nameEn: 'Streamers', nameZh: '網絡播放器', slug: 'streamers', descriptionEn: 'Streamers', descriptionZh: '網絡播放器', icon: 'Activity', display_order: 5 },
  { id: 'loudspeakers', category_id: 'loudspeakers', nameEn: 'Loudspeakers', nameZh: '音箱', slug: 'loudspeakers', descriptionEn: 'Loudspeakers', descriptionZh: '音箱', icon: 'Volume2', display_order: 6 }
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocaleProvider>
    <CartProvider>{children}</CartProvider>
  </LocaleProvider>
);

describe('Frontend Search & Multi-Faceted Filter Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRouterQuery = {};
    process.env.NEXT_PUBLIC_BACKEND_API_URL = 'http://localhost:8080';

    (global as any).fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/search')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              products: [MOCK_PRODUCTS[0]]
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      });
    });
  });

  describe('Header Search Input', () => {
    it('renders search input with placeholder and calls onSearchChange', () => {
      const handleSearchChange = jest.fn();
      render(
        <TestWrapper>
          <Header searchQuery="" onSearchChange={handleSearchChange} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText(/搜尋/i);
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'Chord' } });
      expect(handleSearchChange).toHaveBeenCalledWith('Chord');
    });

    it('displays clear button when searchQuery is non-empty and clears input on click', () => {
      const handleSearchChange = jest.fn();
      render(
        <TestWrapper>
          <Header searchQuery="Chord" onSearchChange={handleSearchChange} />
        </TestWrapper>
      );

      const clearBtn = screen.getByRole('button', { name: '' });
      expect(clearBtn).toBeInTheDocument();

      fireEvent.click(clearBtn);
      expect(handleSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('HomePage Search & Multi-Faceted Filters', () => {
    it('renders initial products list when search query is empty', () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      expect(screen.getByText('Chord Hugo TT 2 解碼/耳擴/前級')).toBeInTheDocument();
      expect(screen.getByText('Sennheiser HD 800 S 參考級開放式頭戴耳機')).toBeInTheDocument();
    });

    it('triggers search API call and updates URL when user types query', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/搜尋/i);

      fireEvent.change(searchInput, { target: { value: 'Chord' } });

      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/',
          query: expect.objectContaining({ q: 'Chord' }),
        }),
        undefined,
        { shallow: true }
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/search'),
          expect.anything()
        );
      });
    });

    it('handles empty and whitespace query gracefully by not calling search API', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/搜尋/i);

      fireEvent.change(searchInput, { target: { value: '   ' } });

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/search'),
        expect.anything()
      );
    });

    it('filters products by selected category', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const dacCategoryButtons = screen.getAllByRole('button', { name: /解碼器/i });
      fireEvent.click(dacCategoryButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Chord Hugo TT 2 解碼/耳擴/前級')).toBeInTheDocument();
        expect(screen.queryByText('Sennheiser HD 800 S 參考級開放式頭戴耳機')).not.toBeInTheDocument();
      });
    });

    it('filters products by budget slider threshold in HKD', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '20000' } });

      await waitFor(() => {
        expect(screen.getByText('Sennheiser HD 800 S 參考級開放式頭戴耳機')).toBeInTheDocument();
        expect(screen.queryByText('Chord Hugo TT 2 解碼/耳擴/前級')).not.toBeInTheDocument();
        expect(screen.queryByText('B&W 804 D4 鑽石高音落地喇叭')).not.toBeInTheDocument();
      });
    });

    it('filters products by hardware interface tag', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const i2sBtn = screen.getByRole('button', { name: 'I2S' });
      fireEvent.click(i2sBtn);

      await waitFor(() => {
        expect(screen.getByText('Eversolo DMP-A8 網絡播放器')).toBeInTheDocument();
        expect(screen.getByText('Denafrips Venus II R-2R 解碼器')).toBeInTheDocument();
        expect(screen.queryByText('B&W 804 D4 鑽石高音落地喇叭')).not.toBeInTheDocument();
      });
    });

    it('updates search query when preset acoustic query button is clicked', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const presetBtn = screen.getByText(/300B 膽機 溫暖聲場/i);
      fireEvent.click(presetBtn);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          expect.objectContaining({
            pathname: '/',
            query: expect.objectContaining({ q: '300B 膽機 溫暖聲場' }),
          }),
          undefined,
          { shallow: true }
        );
      });
    });

    it('resets all search and filter controls when reset filters button is clicked', async () => {
      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const dacCategoryButtons = screen.getAllByRole('button', { name: /解碼器/i });
      fireEvent.click(dacCategoryButtons[0]);

      const resetBtns = screen.getAllByText(/重置篩選|resetFilters/i);
      fireEvent.click(resetBtns[0]);

      await waitFor(() => {
        expect(screen.getByText('Sennheiser HD 800 S 參考級開放式頭戴耳機')).toBeInTheDocument();
        expect(screen.getByText('B&W 804 D4 鑽石高音落地喇叭')).toBeInTheDocument();
      });
    });

    it('renders empty search results state when no products match criteria', async () => {
      (global as any).fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ products: [] }),
        })
      );

      render(
        <TestWrapper>
          <HomePage initialProducts={[]} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      expect(screen.getByText('noProductsFound')).toBeInTheDocument();
    });

    it('handles search API network error gracefully without crashing', async () => {
      (global as any).fetch = jest.fn().mockImplementation(() =>
        Promise.reject(new Error('Network error'))
      );

      render(
        <TestWrapper>
          <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/搜尋/i);
      fireEvent.change(searchInput, { target: { value: 'Chord' } });

      await waitFor(() => {
        expect(screen.getByText('noProductsFound')).toBeInTheDocument();
      });
    });

    describe('Search Engine Mode Toggle & Multi-Engine Behavior', () => {
      it('defaults to hybrid search mode with proper banner and badge', () => {
        render(
          <TestWrapper>
            <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
          </TestWrapper>
        );

        expect(
          screen.getByText(/BM25 \+ 768d Vector KNN \(Reciprocal Rank Fusion\)/i)
        ).toBeInTheDocument();
        expect(
          screen.getAllByText(/雙引擎混合搜尋 \(Hybrid RRF\)/i).length
        ).toBeGreaterThanOrEqual(1);
      });

      it('initializes to fts search mode when URL query has mode=fts', async () => {
        mockRouterQuery = { mode: 'fts' };

        render(
          <TestWrapper>
            <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(
            screen.getByText(/Cloud Spanner 3-Tier Weighted BM25 \(No Vector Embeddings\)/i)
          ).toBeInTheDocument();
        });
      });

      it('toggles mode from Hero Banner, synchronizes URL, and passes mode to search API fetch', async () => {
        render(
          <TestWrapper>
            <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
          </TestWrapper>
        );

        // Type search query
        const searchInput = screen.getByPlaceholderText(/搜尋/i);
        fireEvent.change(searchInput, { target: { value: 'Chord' } });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mode=hybrid'),
            expect.anything()
          );
        });

        // Click pure FTS toggle in Hero Banner
        const ftsButtons = screen.getAllByRole('button', { name: /純全文搜尋/i });
        fireEvent.click(ftsButtons[0]);

        expect(mockReplace).toHaveBeenCalledWith(
          expect.objectContaining({
            query: expect.objectContaining({ mode: 'fts' }),
          }),
          undefined,
          { shallow: true }
        );

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mode=fts'),
            expect.anything()
          );
        });
      });

      it('toggles mode from Sidebar selector card and updates UI state', async () => {
        render(
          <TestWrapper>
            <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
          </TestWrapper>
        );

        const ftsButtons = screen.getAllByRole('button', { name: /純全文搜尋/i });
        // The second button is in the sidebar
        const sidebarFtsBtn = ftsButtons[ftsButtons.length - 1];
        fireEvent.click(sidebarFtsBtn);

        expect(mockReplace).toHaveBeenCalledWith(
          expect.objectContaining({
            query: expect.objectContaining({ mode: 'fts' }),
          }),
          undefined,
          { shallow: true }
        );

        await waitFor(() => {
          expect(
            screen.getByText(/Cloud Spanner 3-Tier Weighted BM25 \(No Vector Embeddings\)/i)
          ).toBeInTheDocument();
        });
      });

      it('displays mode-specific loading messages during search execution', async () => {
        let resolvePromise: (val: any) => void;
        (global as any).fetch = jest.fn().mockImplementation(() =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
        );

        const { rerender } = render(
          <TestWrapper>
            <HomePage initialProducts={MOCK_PRODUCTS} categories={MOCK_CATEGORIES} />
          </TestWrapper>
        );

        const searchInput = screen.getByPlaceholderText(/搜尋/i);
        fireEvent.change(searchInput, { target: { value: 'Chord' } });

        // In hybrid mode, loading text reflects hybrid search
        expect(
          screen.getByText(/正在查詢 Cloud Spanner 雙引擎混合搜尋/i)
        ).toBeInTheDocument();

        // Switch to FTS mode
        const ftsButtons = screen.getAllByRole('button', { name: /純全文搜尋/i });
        fireEvent.click(ftsButtons[0]);

        expect(
          screen.getByText(/正在查詢 Cloud Spanner 3-Tier 加權全文搜尋/i)
        ).toBeInTheDocument();

        // Resolve pending promise
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ products: [MOCK_PRODUCTS[0]] }),
        });
      });
    });
  });
});

