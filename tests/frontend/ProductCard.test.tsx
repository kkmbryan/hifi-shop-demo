import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ProductCard } from "../../src/frontend/src/components/ProductCard";
import { CartProvider } from "../../src/frontend/src/context/CartContext";
import { LocaleProvider } from "../../src/frontend/src/context/LocaleContext";
import { Product } from "../../src/frontend/src/data/products";
import { MOCK_PRODUCTS } from "./mockProducts";

const sampleProduct: Product = MOCK_PRODUCTS[0];

const TestHarness: React.FC<{
  product: Product;
  priority?: boolean;
  onSelect?: (p: Product) => void;
}> = ({ product, priority = false, onSelect }) => (
  <LocaleProvider>
    <CartProvider>
      <ProductCard product={product} priority={priority} onSelectProduct={onSelect} />
    </CartProvider>
  </LocaleProvider>
);

describe("ProductCard Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders product details and HKD price correctly", () => {
    render(<TestHarness product={sampleProduct} />);
    expect(screen.getByText(sampleProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.nameZh)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(sampleProduct.priceHkd.toLocaleString())).length).toBeGreaterThan(0);
    expect(screen.getByText(new RegExp(sampleProduct.acousticSignatureZh))).toBeInTheDocument();
  });

  it("triggers onSelectProduct when title is clicked", () => {
    const handleSelect = jest.fn();
    render(<TestHarness product={sampleProduct} onSelect={handleSelect} />);
    const title = screen.getByText(sampleProduct.nameZh);
    fireEvent.click(title);
    expect(handleSelect).toHaveBeenCalledWith(sampleProduct);
  });

  it("renders next/image with fill and sizes when imageUrl is valid", () => {
    render(<TestHarness product={sampleProduct} />);
    const img = screen.getByAltText(sampleProduct.nameZh);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain(encodeURIComponent(sampleProduct.imageUrl));
    expect(img).toHaveAttribute("data-nimg", "fill");
    expect(img).toHaveAttribute("sizes", "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw");
  });

  it("passes priority prop to next/image for LCP optimization", () => {
    const { rerender } = render(<TestHarness product={sampleProduct} priority={false} />);
    let img = screen.getByAltText(sampleProduct.nameZh);
    expect(img).toHaveAttribute("loading", "lazy");

    rerender(<TestHarness product={sampleProduct} priority={true} />);
    img = screen.getByAltText(sampleProduct.nameZh);
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("displays skeleton equalizer shimmer while loading and reveals image on load", async () => {
    const { container } = render(<TestHarness product={sampleProduct} />);
    const img = screen.getByAltText(sampleProduct.nameZh);
    expect(img).toHaveClass("opacity-0");

    // Before load: skeleton pulse container exists
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();

    // Trigger load event inside act
    act(() => {
      fireEvent.load(img);
    });

    await waitFor(() => {
      expect(img).toHaveClass("opacity-100");
    });
    expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
  });

  it("renders fallback placeholder when imageUrl is empty", () => {
    const productNoImg: Product = { ...sampleProduct, imageUrl: "" };
    render(<TestHarness product={productNoImg} />);
    const fallback = screen.getByRole("img", { name: new RegExp(sampleProduct.brand + " " + sampleProduct.model) });
    expect(fallback).toBeInTheDocument();
    expect(screen.queryByAltText(sampleProduct.nameZh)).not.toBeInTheDocument();
  });

  it("displays fallback placeholder when image loading fails with error event", async () => {
    render(<TestHarness product={sampleProduct} />);
    const img = screen.getByAltText(sampleProduct.nameZh);
    
    act(() => {
      fireEvent.error(img);
    });

    await waitFor(() => {
      const fallback = screen.getByRole("img", { name: new RegExp(sampleProduct.brand + " " + sampleProduct.model) });
      expect(fallback).toBeInTheDocument();
    });
  });

  it("adds product to cart when Add to Cart button is clicked and shows inCart state", async () => {
    render(<TestHarness product={sampleProduct} />);
    const addBtn = screen.getByRole("button", { name: /加入系統配置|加入購物車|addToCart/i });
    expect(addBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addBtn);
    });

    await waitFor(() => {
      const inCartBtn = screen.getByRole("button", { name: /已加入購物車|已在購物車|inCart/i });
      expect(inCartBtn).toBeInTheDocument();
    });
  });
});
