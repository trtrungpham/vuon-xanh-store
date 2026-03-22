import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const lightOptions = [
  { value: "direct", label: "Nắng trực tiếp" },
  { value: "indirect", label: "Ánh sáng tán xạ" },
  { value: "shade", label: "Chịu bóng râm" },
];

const careOptions = [
  { value: "easy", label: "Dễ chăm sóc" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Nâng cao" },
];

const benefitOptions = [
  { value: "air", label: "Lọc không khí" },
  { value: "decor", label: "Trang trí" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialElement = searchParams.get("element") || "";

  // Sử dụng hook lấy dữ liệu từ Supabase 
  const { data: products = [], isLoading, error } = useProducts();

  const [category, setCategory] = useState(initialCategory);
  const [light, setLight] = useState("");
  const [care, setCare] = useState("");
  const [benefit, setBenefit] = useState("");
  const [element, setElement] = useState(initialElement);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (light && p.light !== light) return false;
      if (care && p.care !== care) return false;
      if (benefit && p.benefit !== benefit) return false;
      if (element && p.element !== element) return false;
      return true;
    });
  }, [category, light, care, benefit, element]);

  const clearFilters = () => {
    setCategory("");
    setLight("");
    setCare("");
    setBenefit("");
    setElement("");
  };

  const hasFilters = category || light || care || benefit || element;

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
      >
        <option value="">Tất cả</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  const filtersContent = (
    <div className="space-y-4">
      <FilterSelect label="Danh mục" value={category} onChange={setCategory} options={[
        { value: "desk", label: "Cây để bàn" },
        { value: "lobby", label: "Cây đại sảnh" },
        { value: "succulent", label: "Sen đá" },
      ]} />
      <FilterSelect label="Ánh sáng" value={light} onChange={setLight} options={lightOptions} />
      <FilterSelect label="Mức độ chăm sóc" value={care} onChange={setCare} options={careOptions} />
      <FilterSelect label="Lợi ích" value={benefit} onChange={setBenefit} options={benefitOptions} />
      <FilterSelect label="Mệnh phong thủy" value={element} onChange={setElement} options={[
        { value: "kim", label: "Kim" },
        { value: "moc", label: "Mộc" },
        { value: "thuy", label: "Thủy" },
        { value: "hoa", label: "Hỏa" },
        { value: "tho", label: "Thổ" },
      ]} />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Cây cảnh</h1>
            <p className="text-muted-foreground mt-1">{filtered.length} sản phẩm</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setView("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setView("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="md:hidden mb-6 p-4 bg-card rounded-xl shadow-soft">
            {filtersContent}
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl p-5 shadow-soft">
              <h3 className="font-display font-semibold text-foreground mb-4">Bộ lọc</h3>
              {filtersContent}
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground mt-4">Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-medium">Lỗi kết nối máy chủ</p>
                <p className="text-muted-foreground mt-2 text-sm">{error instanceof Error ? error.message : "Vui lòng kiểm tra lại file .env và cấu hình URL/Key."}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Thử lại</Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm phù hợp</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((p) => (
                  <div key={p.id} className="flex gap-4 bg-card rounded-xl p-4 shadow-soft">
                    <img src={p.image} alt={p.name} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{p.shortDesc}</p>
                      <p className="text-primary font-bold mt-2">{new Intl.NumberFormat("vi-VN").format(p.price)}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ChatButton />
    </div>
  );
};

export default Products;
