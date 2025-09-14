PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty (
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pizza_count INTEGER NOT NULL DEFAULT 0,   -- 0..5
  coffee_count INTEGER NOT NULL DEFAULT 0,  -- 0..5
  pizza_cycles INTEGER NOT NULL DEFAULT 0,  -- сколько раз уже подарено
  coffee_cycles INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_tg_id INTEGER,
  type TEXT NOT NULL,   -- 'pizza' | 'coffee' | 'redeem_pizza' | 'redeem_coffee' | 'adjust'
  delta INTEGER NOT NULL,  -- +1 или -1; у redeem = -5
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_tg ON users(tg_id);
CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(user_id);
