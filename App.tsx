
import React, { useState, useEffect, useMemo } from 'react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  const [settings, setSettings] = useState<AdminSettings>({
    whatsappNumber: '595994318655',
    whatsappContacts: [],
    companyName: 'Accesorios Coquetas',
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: ''
  });

  // Cargar Carrito desde LocalStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('coquetas_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error cargando carrito persistente", e);
      }
    }
  }, []);

  // Guardar Carrito en LocalStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('coquetas_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchCategories();
    
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

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) {
      const mappedProducts: Product[] = data.map(p => ({
        id: p.id,
        name: p.nombre,
        price: p.precio,
        stock: p.stock,
        description: p.descripcion,
        images: p.imagenes || [],
        category: p.categoria || 'Sin Categoría',
        order_index: p.order_index
      }));
      setProducts(mappedProducts);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      if (data) {
        setSettings({
          whatsappNumber: data.whatsapp_number || '595994318655',
          whatsappContacts: data.whatsapp_contacts || [],
          companyName: data.nombre_empresa || 'Accesorios Coquetas',
          instagramUrl: data.instagram_url || '',
          facebookUrl: data.facebook_url || '',
          tiktokUrl: data.tiktok_url || ''
        });
      }
    } catch (e) {}
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const handleSaveProduct = async (productData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const isNew = !productData.id;
    const dbData = {
      nombre: productData.name,
      precio: productData.price,
      stock: productData.stock,
      descripcion: productData.description,
      imagenes: productData.images || [],
      categoria: productData.category
    };

    try {
      if (isNew) {
        const maxIndex = products.reduce((max, p) => Math.max(max, p.order_index), -1);
        const { error } = await supabase.from('productos').insert([{ ...dbData, order_index: maxIndex + 1 }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('productos').update(dbData).eq('id', productData.id);
        if (error) throw error;
      }
      fetchProducts();
      setEditingProduct(null);
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const processedProducts = useMemo(() => {
    let p = [...products];
    if (selectedCategory !== 'Todos') {
      p = p.filter(prod => prod.category === selectedCategory);
    }
    if (sortBy === 'price-asc') return p.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return p.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-az') return p.sort((a, b) => a.name.localeCompare(b.name));
    return p;
  }, [products, sortBy, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        mode={mode} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsSidebarOpen(true)}
        isAdmin={isLoggedIn}
        onOpenSettings={() => setShowSettingsModal(true)}
        onLogout={async () => { await supabase.auth.signOut(); setIsLoggedIn(false); setMode(UserMode.CLIENT); }}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif text-pink-900 leading-tight">
              {selectedCategory === 'Todos' ? 'Nuestras Joyas' : selectedCategory}
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-lg">
              Descubre accesorios exclusivos diseñados para realzar tu belleza en cada ocasión.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <div className="flex flex-col">
              <label className="text-[9px] uppercase font-black text-gray-400 mb-1 tracking-tighter">Ordenar por</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)} 
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="default">Personalizado</option>
                <option value="price-asc">Menor Precio</option>
                <option value="price-desc">Mayor Precio</option>
                <option value="name-az">A-Z</option>
              </select>
            </div>
            {isLoggedIn && mode === UserMode.ADMIN && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-pink-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-md"
              >
                + Agregar
              </button>
            )}
          </div>
        </div>

        <ProductGrid 
          products={processedProducts}
          mode={mode}
          onAddToCart={handleAddToCart}
          onEdit={setEditingProduct}
          onDelete={async (id) => { if(confirm('¿Deseas eliminar este producto permanentemente?')) { await supabase.from('productos').delete().eq('id', id); fetchProducts(); } }}
          onReorder={async (id, dir) => { /* logic */ }}
          isSortingByDefault={sortBy === 'default' && selectedCategory === 'Todos'}
        />

        <SocialSection settings={settings} />
      </main>

      <AdminLogin isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={() => setShowLoginModal(false)} />

      <AdminSettingsModal
        isOpen={showSettingsModal}
        settings={settings}
        categories={categories}
        onClose={() => setShowSettingsModal(false)}
        onRefreshCategories={fetchCategories}
        onSave={async (s) => {
          // Aseguramos que whatsapp_contacts se guarde en la BD
          const { error } = await supabase.from('configuracion').update({ 
            whatsapp_number: s.whatsappNumber,
            whatsapp_contacts: s.whatsappContacts,
            instagram_url: s.instagramUrl,
            facebook_url: s.facebookUrl,
            tiktok_url: s.tiktokUrl,
            nombre_empresa: s.companyName
          }).eq('id', 1);
          
          if (error) {
            console.error("Error guardando configuracion", error);
            alert("No se pudo guardar la configuración en la base de datos.");
          } else {
            setSettings(s);
            setShowSettingsModal(false);
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={handleUpdateCartQuantity} settings={settings} />

      <footer className="bg-white py-20 border-t border-pink-50 text-center">
        <h2 className="text-3xl font-serif text-pink-900 mb-2">{settings.companyName}</h2>
        <p className="text-pink-300 text-sm mb-8 italic">Hecho con amor para resaltar tu belleza.</p>
        <button onClick={() => isLoggedIn ? setMode(UserMode.ADMIN) : setShowLoginModal(true)} className="px-6 py-2 rounded-full border border-pink-50 text-[10px] text-pink-200 hover:text-pink-500 uppercase tracking-widest font-bold transition-all">Panel Administrativo</button>
      </footer>
    </div>
  );
};

export default App;
