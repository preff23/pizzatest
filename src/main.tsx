import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { CartProvider } from './store/cartContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { StatusPage } from './pages/StatusPage';
import { Page } from './types';
import './styles/crusta-print.css';
import './styles/bottom-rail.css';

// Расширяем Window интерфейс для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          chat_instance?: string;
          chat_type?: string;
          auth_date?: number;
          hash?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('menu');

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Расширяем на весь экран
      tg.expand();
      
      // Устанавливаем цвет заголовка
      tg.setHeaderColor('secondary_bg_color');
      
      // Логируем информацию о пользователе и приложении
      console.log('Telegram WebApp initialized');
      console.log('User:', tg.initDataUnsafe?.user);
      console.log('Platform:', tg.platform);
      console.log('Version:', tg.version);
      console.log('Color scheme:', tg.colorScheme);
      console.log('Theme params:', tg.themeParams);
      
      // Настраиваем тактильную обратную связь для кнопок
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          tg.HapticFeedback?.selectionChanged();
        });
      });
      
    } else {
      console.log('Telegram WebApp not available - running in browser mode');
    }

    // Scroll effect for header
    const handleScroll = () => {
      const scrolled = window.scrollY > 16;
      document.body.classList.toggle('scrolled', scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'status':
        return <StatusPage />;
      default:
        return <MenuPage />;
    }
  };

  return (
    <CartProvider>
      <div className="app">
        <Header />
        <main className="container">
          {renderCurrentPage()}
        </main>
        <BottomNav 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </CartProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
