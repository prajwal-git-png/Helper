import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav, TabKey } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { ProductEditScreen } from './components/products/ProductEditScreen';
import { ProductDetailScreen } from './components/products/ProductDetailScreen';
import { CustomerPresentationMode } from './components/presentation/CustomerPresentationMode';
import { DimensionConverterScreen } from './components/converter/DimensionConverterScreen';
import { RecipeCatalogScreen } from './components/recipes/RecipeCatalogScreen';
import { UserGuideScreen } from './components/guide/UserGuideScreen';
import { ProductCompareScreen } from './components/compare/ProductCompareScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { LoginModal } from './components/auth/LoginModal';
import { Product } from './types/index';

const AppContent: React.FC = () => {
  const {
    presentationProduct,
    isPresentationMode,
    exitPresentation,
    theme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Customer Showroom Presentation Mode takes over the full viewport!
  if (isPresentationMode && presentationProduct) {
    return (
      <CustomerPresentationMode
        product={presentationProduct}
        onExit={exitPresentation}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-black text-[#F5EFEB] flex flex-col font-sans selection:bg-amber-500 selection:text-black relative theme-${theme}`}>
      {/* Ambient Lighting Glow Background Elements (Gold & Warm Cream - No Blue) */}
      <div className="ambient-glow-container pointer-events-none">
        <div className="ambient-glow-amber opacity-60" />
        <div className="ambient-glow-cream opacity-50" />
      </div>

      {/* Modern Minimalist iOS Header */}
      <Header
        onOpenAddProduct={() => {
          setSelectedProduct(null);
          setEditingProductId('new');
          setActiveTab('edit');
        }}
        onOpenGuide={() => {
          setSelectedProduct(null);
          setActiveTab('guide');
        }}
        onOpenProfile={() => {
          setSelectedProduct(null);
          setActiveTab('profile');
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Screen Body */}
      <main className="flex-1 overflow-x-hidden relative z-10 pb-10">
        {selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onEdit={(p) => {
              setSelectedProduct(null);
              setEditingProductId(p.id);
              setActiveTab('edit');
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                onNavigateTab={(tab) => {
                  setSelectedProduct(null);
                  setActiveTab(tab);
                }}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onEditProduct={(p) => {
                  setEditingProductId(p.id);
                  setActiveTab('edit');
                }}
              />
            )}

            {activeTab === 'edit' && (
              <ProductEditScreen
                initialProductId={editingProductId}
                onSaved={() => {
                  setEditingProductId(undefined);
                  setActiveTab('home');
                }}
                onCancel={() => {
                  setEditingProductId(undefined);
                  setActiveTab('home');
                }}
              />
            )}

            {activeTab === 'dimensions' && <DimensionConverterScreen />}

            {activeTab === 'recipes' && <RecipeCatalogScreen />}

            {activeTab === 'profile' && <ProfileScreen />}

            {activeTab === 'guide' && (
              <UserGuideScreen
                onNavigateTab={(tab) => {
                  setSelectedProduct(null);
                  setActiveTab(tab);
                }}
              />
            )}

            {activeTab === 'compare' && <ProductCompareScreen />}
          </>
        )}
      </main>

      {/* Mobile-First Floating Glass Bottom Dock */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedProduct(null);
          if (tab === 'edit') {
            setEditingProductId('new');
          }
          setActiveTab(tab);
        }}
      />

      {/* Simple iOS Glassy Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
