import React, { useState, useEffect } from 'react';
import { CatalogFragrance, CATALOG } from './data/fraganzaCatalog';
import { SmartQuiz } from './components/SmartQuiz';
import { AdvancedSearch } from './components/AdvancedSearch';
import { FamilyExplorer } from './components/FamilyExplorer';
import { FragranceModal } from './components/FragranceModal';
import { OfficialCatalogView } from './components/OfficialCatalogView';
import { SupabaseDrawer } from './components/SupabaseDrawer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { getPerfumeBottlePhoto } from './data/fragranceVisuals';
import {
  Sparkles,
  Search,
  Compass,
  Heart,
  Layers,
  Database,
  Flame,
  ChevronRight,
  Droplet,
  ArrowRight,
  Star,
  Lock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'search' | 'families' | 'catalog' | 'favorites'>('quiz');
  const [selectedFragrance, setSelectedFragrance] = useState<CatalogFragrance | null>(null);
  const [isSupabaseDrawerOpen, setIsSupabaseDrawerOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fraganza_admin_logged') === 'true';
    } catch {
      return false;
    }
  });

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fraganza_fav_codes');
      return saved ? JSON.parse(saved) : ['u-002', 'c-015', 'd-008'];
    } catch {
      return ['u-002', 'c-015', 'd-008'];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('fraganza_fav_codes', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fId) => fId !== id));
      showToast('Eliminada de tus favoritos');
    } else {
      setFavorites([...favorites, id]);
      showToast('Añadida a tus favoritos ❤️');
    }
  };

  const savedFragrances = CATALOG.filter((f) => favorites.includes(f.id));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-100 flex flex-col selection:bg-[#C9A84C] selection:text-stone-950 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] border border-[#C9A84C]/50 text-stone-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Administrator Top Banner (Only visible when admin is logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#A07830] text-stone-950 text-xs py-1.5 px-4 font-bold flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-950" />
            <span>Panel Administrador Fraganza (mariacamila.jaimes@unet.edu.ve)</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSupabaseDrawerOpen(true)}
              className="px-3 py-1 rounded-lg bg-stone-950 text-[#F0D080] text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5 shadow"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Gestor Supabase & Agregar Perfume</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('fraganza_admin_logged');
                setIsAdmin(false);
                showToast('Sesión de administrador cerrada');
              }}
              className="text-stone-950 hover:underline text-xs"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Header with Official Fraganza Logo */}
      <header className={`sticky ${isAdmin ? 'top-8' : 'top-0'} z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-stone-800/90 shadow-xl transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Brand */}
            <div
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <img
                src="/assets/aistudio/fraganza_logo_d0313cc4.png"
                alt="Fraganza Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(201,168,76,0.35)] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold font-serif-luxury tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F0D080] via-[#C9A84C] to-[#A07830] block leading-tight">
                  FRAGANZA
                </span>
                <span className="text-[10px] tracking-widest text-stone-400 uppercase font-medium">
                  Alta Perfumería · 207 Fragancias
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Test Inteligente
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'search'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Buscador por Notas
              </button>

              <button
                onClick={() => setActiveTab('families')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'families'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Familias Olfativas
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Catálogo (207)
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all relative ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-stone-950' : 'text-rose-400'}`} />
                Favoritos
                {favorites.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    activeTab === 'favorites' ? 'bg-stone-950 text-[#F0D080]' : 'bg-rose-500 text-white'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Admin quick access button if logged in */}
              {isAdmin && (
                <button
                  onClick={() => setIsSupabaseDrawerOpen(true)}
                  title="Acceso Administrador a Supabase"
                  className="p-2 rounded-xl text-[#F0D080] bg-[#C9A84C]/20 border border-[#C9A84C] ml-1.5 hover:bg-[#C9A84C]/30 transition-colors"
                >
                  <Database className="w-4 h-4" />
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 px-1 bg-[#0d0d0d] border-t border-stone-800 text-[11px] overflow-x-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 ${
              activeTab === 'quiz' ? 'text-[#F0D080] font-bold' : 'text-stone-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Test</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 ${
              activeTab === 'search' ? 'text-[#F0D080] font-bold' : 'text-stone-400'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Notas</span>
          </button>
          <button
            onClick={() => setActiveTab('families')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 ${
              activeTab === 'families' ? 'text-[#F0D080] font-bold' : 'text-stone-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Familias</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 ${
              activeTab === 'catalog' ? 'text-[#F0D080] font-bold' : 'text-stone-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catálogo</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 relative ${
              activeTab === 'favorites' ? 'text-[#F0D080] font-bold' : 'text-stone-400'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favoritos</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsSupabaseDrawerOpen(true)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg shrink-0 text-[#F0D080]"
            >
              <Database className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'quiz' && (
          <SmartQuiz
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'search' && (
          <AdvancedSearch
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'families' && (
          <FamilyExplorer
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Catalog Tab (All 207 perfumes with Gender filtering and authentic bottle photos) */}
        {activeTab === 'catalog' && (
          <OfficialCatalogView
            onSelectFragrance={(perfume) => setSelectedFragrance(perfume)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold block mb-1">
                Tu Selección Exclusiva
              </span>
              <h2 className="text-3xl font-bold font-serif-luxury text-stone-100">
                Fragancias Favoritas Guardadas
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Tus perfumes favoritos para consulta inmediata o adquisición.
              </p>
            </div>

            {savedFragrances.length === 0 ? (
              <div className="bg-[#0e0e0e] border border-stone-800 rounded-3xl p-12 text-center space-y-4">
                <Heart className="w-12 h-12 text-rose-500/40 mx-auto" />
                <h3 className="text-lg font-bold font-serif-luxury text-stone-200">
                  Aún no has guardado ninguna fragancia
                </h3>
                <p className="text-stone-400 text-xs max-w-md mx-auto">
                  Explora el test inteligente o el catálogo y pulsa el corazón para guardar tus fragancias predilectas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFragrances.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => setSelectedFragrance(perfume)}
                    className="bg-[#0e0e0e] rounded-2xl border border-stone-800 hover:border-[#C9A84C]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer group"
                  >
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-black border border-stone-800 p-2 flex items-center justify-center">
                      <img
                        src={getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code)}
                        alt={perfume.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-[#F0D080]">
                        {perfume.code}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(perfume.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/80 border border-stone-700 text-rose-500"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold block">
                        {perfume.brand}
                      </span>
                      <h4 className="text-base font-bold font-serif-luxury text-stone-100 truncate group-hover:text-[#F0D080]">
                        {perfume.name}
                      </h4>
                      <span className="text-xs text-stone-400 block mt-0.5">{perfume.family}</span>
                    </div>

                    <button className="w-full py-2 rounded-xl bg-[#181818] group-hover:bg-[#C9A84C] group-hover:text-stone-950 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-stone-800">
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fragrance Modal (with exact same info as winner + always-visible similars) */}
      <FragranceModal
        fragrance={selectedFragrance}
        onClose={() => setSelectedFragrance(null)}
        isFavorite={selectedFragrance ? favorites.includes(selectedFragrance.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onSelectAnother={(f) => setSelectedFragrance(f)}
      />

      {/* Supabase Drawer (Protected for Administrator only) */}
      <SupabaseDrawer
        isOpen={isSupabaseDrawerOpen}
        onClose={() => setIsSupabaseDrawerOpen(false)}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthenticated={() => {
          setIsAdmin(true);
          setIsSupabaseDrawerOpen(true);
          showToast('👑 Bienvenido al Panel de Administrador Fraganza');
        }}
      />

      {/* Luxury Footer */}
      <footer className="bg-[#080808] border-t border-stone-800/80 py-12 mt-16 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-5">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/assets/aistudio/fraganza_logo_d0313cc4.png"
              alt="Fraganza"
              className="h-10 w-auto object-contain opacity-80"
            />
            <span className="font-serif-luxury text-stone-300 font-bold tracking-widest text-base">
              FRAGANZA
            </span>
          </div>

          <p className="max-w-xl mx-auto text-stone-400 leading-relaxed text-xs">
            Experiencia digital de recomendación olfativa para perfumería fina. Algoritmo inteligente con pirámides olfativas de salida, corazón y fondo, medidores de intensidad y compatibilidad dérmica.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] text-stone-400 pt-2">
            <span>Damas: 105 Fragancias (D-001 ... D-105)</span>
            <span>•</span>
            <span>Caballeros: 74 Fragancias (C-001 ... C-074)</span>
            <span>•</span>
            <span>Unisex: 28 Fragancias (U-001 ... U-028)</span>
          </div>

          {/* Discreet Admin Lock Link (Only accessible by site administrator) */}
          <div className="pt-3 border-t border-stone-900/80 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (isAdmin) {
                  setIsSupabaseDrawerOpen(true);
                } else {
                  setIsAdminModalOpen(true);
                }
              }}
              className="text-stone-600 hover:text-[#C9A84C] text-[11px] inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#C9A84C]" />
              <span>{isAdmin ? '👑 Modo Administrador Activo (Abrir Supabase)' : 'Acceso Privado Administrador'}</span>
            </button>
          </div>

          <div className="text-[10px] text-stone-600 pt-1">
            © {new Date().getFullYear()} Fraganza · Todos los derechos reservados · Proyecto Oficial de Perfumería
          </div>
        </div>
      </footer>
    </div>
  );
}
