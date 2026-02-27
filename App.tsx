
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, UserMode, SortOption, AdminSettings, Category } from './types';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminLogin from './components/AdminLogin';
import AdminSettingsModal from './components/AdminSettingsModal';
import SocialSection from './components/SocialSection';
import ProductDetailView from './components/ProductDetailView';
import Carousel from './components/Carousel';
import ProductCard from './components/ProductCard';
import { CarouselImage } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<UserMode>(UserMode.CLIENT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const ITEMS_PER_PAGE = 16;
  
  const [settings, setSettings] = useState<AdminSettings>({
    whatsappNumber: '595994318655',
    whatsappContacts: [],
    companyName: 'Accesorios Coquetas',
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('coquetas_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error cargando carrito", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coquetas_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchCategories();
    fetchCarouselImages();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setMode(UserMode.ADMIN);
      } else {
        setIsLoggedIn(false);
        setMode(UserMode.CLIENT);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCarouselImages = async () => {
    const { data } = await supabase.from('carrusel').select('*').order('orden', { ascending: true });
    if (data) setCarouselImages(data);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*');
      
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      if (data) {
        // Ordenar manualmente por order_index si existe, si no, mantener el orden de la DB
        const sortedData = [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        
        setProducts(sortedData.map(p => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          stock: p.stock,
          description: p.descripcion,
          images: p.imagenes || [],
          category: p.categoria || 'Sin Categoría',
          order_index: p.order_index || 0,
          isOffer: p.es_oferta || false,
          originalPrice: p.precio_original || 0
        })));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      const { data: contactsData } = await supabase.from('vendedores').select('*').order('nombre', { ascending: true });
      
      if (data) {
        setSettings({
          whatsappNumber: data.whatsapp_number || '595994318655',
          whatsappContacts: contactsData?.map(c => ({ id: c.id, name: c.nombre, number: c.numero })) || [],
          companyName: data.nombre_empresa || 'Accesorios Coquetas',
          instagramUrl: data.instagram_url || '',
          facebookUrl: data.facebook_url || '',
          tiktokUrl: data.tiktok_url || '',
          carouselInterval: data.carrusel_intervalo || 5
        });
      }
    } catch (e) {}
  };

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleSaveProduct = async (productData: any) => {
    const isNew = !productData.id;
    const dbData = {
      nombre: productData.name,
      precio: productData.price,
      stock: productData.stock,
      descripcion: productData.description,
      imagenes: productData.images || [],
      categoria: productData.category,
      es_oferta: productData.isOffer,
      precio_original: productData.originalPrice
    };

    try {
      if (isNew) {
        const maxIndex = products.reduce((max, p) => Math.max(max, p.order_index), -1);
        await supabase.from('productos').insert([{ ...dbData, order_index: maxIndex + 1 }]);
      } else {
        await supabase.from('productos').update(dbData).eq('id', productData.id);
      }
      fetchProducts();
      setEditingProduct(null);
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  const processedProducts = useMemo(() => {
    let p = [...products];
    if (selectedCategory === 'Ofertas') {
      p = p.filter(prod => prod.isOffer);
    } else if (selectedCategory !== 'Todos') {
      p = p.filter(prod => prod.category === selectedCategory);
    }
    if (sortBy === 'price-asc') return p.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return p.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-az') return p.sort((a, b) => a.name.localeCompare(b.name));
    return p;
  }, [products, sortBy, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);

  const offerProducts = useMemo(() => products.filter(p => p.isOffer), [products]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
      <div className="fixed top-20 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      <div className="fixed -bottom-20 left-40 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>

      <Header 
        mode={mode} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsSidebarOpen(true)}
        isAdmin={isLoggedIn}
        onOpenSettings={() => setShowSettingsModal(true)}
        onLogout={async () => { await supabase.auth.signOut(); setIsLoggedIn(false); setMode(UserMode.CLIENT); }}
        products={products}
        onSelectProduct={setViewingProduct}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        hasOffers={offerProducts.length > 0}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        <Carousel images={carouselImages} interval={settings.carouselInterval || 5} />

        {offerProducts.length > 0 && (
          <section className="mb-16 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-pink-900 font-bold flex items-center gap-2">
                <span className="text-3xl">✨</span> Ofertas Especiales
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
            </div>
            
            <div className="overflow-x-auto pb-8 -mx-6 px-6 custom-scrollbar flex gap-6 snap-x snap-mandatory">
              {offerProducts.map(product => (
                <div key={product.id} className="min-w-[200px] w-[200px] snap-center">
                  <ProductCard 
                    product={product}
                    mode={mode}
                    onAddToCart={handleAddToCart}
                    onEdit={setEditingProduct}
                    onView={setViewingProduct}
                    onDelete={async (id) => { if(confirm('¿Eliminar producto?')) { await supabase.from('productos').delete().eq('id', id); fetchProducts(); } }}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif text-pink-900 leading-tight drop-shadow-sm tracking-tight">
              {selectedCategory === 'Todos' ? 'Productos Disponibles' : selectedCategory}
            </h1>
            <p className="text-pink-400 text-lg font-medium max-w-lg leading-relaxed">
              La vida es una sola; Ponte coQuet@
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end mb-12 mt-8">
          <div className="flex items-center gap-4 glass-panel px-6 py-3 rounded-full">
            <div className="flex flex-col">
              <label className="text-[9px] uppercase font-black text-pink-400 mb-0.5 tracking-widest">Ordenar por</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)} 
                className="bg-transparent text-sm font-bold text-pink-900 outline-none cursor-pointer border-none p-0 focus:ring-0 w-32"
              >
                <option value="default">Recomendados</option>
                <option value="price-asc">Menor Precio</option>
                <option value="price-desc">Mayor Precio</option>
                <option value="name-az">Nombre A-Z</option>
              </select>
            </div>
            {isLoggedIn && mode === UserMode.ADMIN && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="ml-4 bg-pink-500/90 backdrop-blur-sm text-white px-5 py-2 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg"
              >
                + Nuevo
              </button>
            )}
          </div>
        </div>

        <ProductGrid 
          products={paginatedProducts}
          mode={mode}
          onAddToCart={handleAddToCart}
          onEdit={setEditingProduct}
          onView={setViewingProduct}
          onDelete={async (id) => { if(confirm('¿Eliminar producto?')) { await supabase.from('productos').delete().eq('id', id); fetchProducts(); } }}
          onReorder={() => {}}
          isSortingByDefault={sortBy === 'default' && selectedCategory === 'Todos'}
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentPage === page 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              &gt;
            </button>
          </div>
        )}
      </main>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[100] p-4 glass-panel rounded-full text-pink-600 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Volver arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <AdminLogin isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={() => setShowLoginModal(false)} />

      <AdminSettingsModal
        isOpen={showSettingsModal}
        settings={settings}
        categories={categories}
        onClose={() => setShowSettingsModal(false)}
        onRefreshCategories={fetchCategories}
        onSave={async (s) => {
          // Update config
          const { error } = await supabase.from('configuracion').update({ 
            whatsapp_number: s.whatsappNumber,
            // whatsapp_contacts is no longer used in configuracion table for active contacts, but we keep the field for legacy if needed or remove it. 
            // We are now using 'vendedores' table for contacts.
            instagram_url: s.instagramUrl,
            facebook_url: s.facebookUrl,
            tiktok_url: s.tiktokUrl,
            nombre_empresa: s.companyName,
            carrusel_intervalo: (s.carouselInterval > 0 && s.carouselInterval < 3) ? 3 : s.carouselInterval
          }).eq('id', 1);
          
          if (!error) { 
            setSettings(s); 
            setShowSettingsModal(false); 
            fetchSettings(); // Refresh to get latest data including contacts
            fetchCarouselImages(); // Refresh carousel too
          }
        }}
      />

      {(editingProduct || isAddModalOpen) && (
        <ProductModal 
          product={editingProduct || undefined}
          categories={categories}
          isOpen={true}
          onClose={() => { setEditingProduct(null); setIsAddModalOpen(false); }}
          onSave={handleSaveProduct}
        />
      )}

      {viewingProduct && (
        <ProductDetailView 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={handleUpdateCartQuantity} 
        onClearCart={handleClearCart}
        settings={settings} 
      />

      <footer className="relative z-10 py-12 text-center mt-20 border-t border-white/40 bg-white/20 backdrop-blur-lg">
        <div className="mb-12">
          <SocialSection settings={settings} />
        </div>
        <h2 className="text-3xl font-serif text-pink-900 mb-2">{settings.companyName}</h2>
        <p className="text-pink-400 text-sm mb-8 font-medium">Hecho con amor.</p>
        <button onClick={() => isLoggedIn ? setMode(UserMode.ADMIN) : setShowLoginModal(true)} className="px-6 py-2 rounded-full border border-pink-200 text-[10px] text-pink-400 hover:text-pink-600 uppercase tracking-widest font-bold transition-all">Panel Administrativo</button>
      </footer>
    </div>
  );
};

export default App;
