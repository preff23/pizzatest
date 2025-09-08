# 🔄 Backup настроек фона для отката

## Текущие настройки фона (до изменения на PHON.PNG):

### Основной фон:
```css
body {
  background: #d9d9d9;  /* серый цвет */
}
```

### Фоновое изображение (body::before):
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  right: -25%;
  width: 80%;
  height: 100vh;
  background: url('/liquidchrome.png') no-repeat right top;
  background-size: 80% auto;
  background-position: right calc(var(--headerH, 56px) + 10px);
  filter: blur(2px);
  opacity: 0.18;
  z-index: -1;
  pointer-events: none;
}
```

### Мобильная версия:
```css
@media (max-width: 768px) {
  body::before {
    right: -20%;
    width: 72%;
  }
}
```

## Для отката:
1. Заменить `url('/PHON.PNG')` обратно на `url('/liquidchrome.png')` в файле `src/styles/crusta-print.css`
2. Удалить файл `public/PHON.PNG` если нужно
3. Пересобрать проект: `npm run build`

## Дата создания backup: $(date)
