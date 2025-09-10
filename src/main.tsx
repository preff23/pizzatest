import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { CartProvider } from './store/cartContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { StatusPage } from './pages/StatusPage';
import BootLoader from './components/BootLoader';
import { Page } from './types';
import './styles/crusta-print.css';
import './styles/bottom-rail.css';

// Путь к фоновому изображению
const BG_URL = "/liquidchrome.png";

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Telegram WebApp ready – если у нас есть объект tg
    try { 
      (window as any)?.Telegram?.WebApp?.ready?.(); 
    } catch {}

    async function boot() {
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

      // 1) грузим фон
      const imgPromise = preloadImage(BG_URL);

      // 2) ждём шрифты (если поддерживаются)
      const fontsPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();

      // 3) первичные данные (если уже есть кэш – Promise.resolve())
      const dataPromise = Promise.resolve();

      // показываем лоадер не меньше 250мс, чтобы не было "мигания"
      await Promise.all([imgPromise, fontsPromise, dataPromise, wait(250)]);

      setReady(true);
    }
    boot();
  }, []);

  // Прячем лоадер когда всё готово - жёсткое удаление для iOS
  useEffect(() => {
    if (!ready) return;
    requestAnimationFrame(() => {
      const el = document.querySelector(".boot-backdrop");
      if (el && el.parentElement) el.parentElement.removeChild(el);
    });
  }, [ready]);

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
    <>
      <div className={`app-root ${ready ? "is-ready" : "is-loading"}`}>
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
      </div>
      {/* ВАЖНО: рендерить лоадер только когда !ready */}
      {!ready && <BootLoader />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
