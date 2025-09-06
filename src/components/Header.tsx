import React from 'react';

export const Header: React.FC = () => {
  // Получаем информацию о пользователе из Telegram WebApp
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : '';

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="brand">CRUSTA MIA</h1>
        <p className="subtitle">Neopolitan Pizza • Espresso Bar</p>
        {userName && (
          <p className="welcome">Добро пожаловать, {userName}!</p>
        )}
      </div>
    </header>
  );
};
