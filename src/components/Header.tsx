import React from 'react';

export const Header: React.FC = () => {
  // Получаем информацию о пользователе из Telegram WebApp
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : '';

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">CRUSTA MIA</div>
        <div className="subtitle">Neopolitan Pizza • Espresso Bar</div>
        {userName && (
          <div className="welcome">Добро пожаловать, {userName}!</div>
        )}
      </div>
    </header>
  );
};
