import React from 'react';

export const Header: React.FC = () => {
  // Получаем информацию о пользователе из Telegram WebApp
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : '';

  return (
    <header className="header">
      <h1 className="header__title">CRUSTA MIA</h1>
      <p className="header__subtitle">Neopolitan Pizza • Espresso Bar</p>
      {userName && (
        <p className="header__welcome">Добро пожаловать, {userName}!</p>
      )}
    </header>
  );
};
