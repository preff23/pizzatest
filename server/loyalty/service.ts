import { db } from './db';

export type LoyaCard = {
  user_id: number;
  pizza_count: number;
  coffee_count: number;
  pizza_cycles: number;
  coffee_cycles: number;
};

export function upsertUser(from: { id: number; username?: string; first_name?: string; last_name?: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    const insert = `
      INSERT INTO users (tg_id, username, first_name, last_name)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(tg_id) DO UPDATE SET
        username=excluded.username,
        first_name=excluded.first_name,
        last_name=excluded.last_name
    `;
    
    db.run(insert, [from.id, from.username || null, from.first_name || null, from.last_name || null], function(err) {
      if (err) return reject(err);
      
      db.get('SELECT * FROM users WHERE tg_id=?', [from.id], (err, user) => {
        if (err) return reject(err);
        
        const ensureLoya = 'INSERT INTO loyalty (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING';
        db.run(ensureLoya, [user.id], (err) => {
          if (err) return reject(err);
          resolve(user);
        });
      });
    });
  });
}

export function getCardByTgId(tgId: number): Promise<{ user: any; card: LoyaCard } | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE tg_id=?', [tgId], (err, user) => {
      if (err) return reject(err);
      if (!user) return resolve(null);
      
      db.get('SELECT * FROM loyalty WHERE user_id=?', [user.id], (err, card) => {
        if (err) return reject(err);
        resolve({ user, card });
      });
    });
  });
}

export function addStamp(tgId: number, kind: 'pizza'|'coffee', admin_tg_id: number): Promise<{ user: any; card: LoyaCard }> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getCardByTgId(tgId);
      if (!data) throw new Error('NO_USER');

      const col = kind === 'pizza' ? 'pizza_count' : 'coffee_count';
      const cyc = kind === 'pizza' ? 'pizza_cycles' : 'coffee_cycles';

      const current = data.card[col as keyof LoyaCard] as number;
      const next = current + 1;

      db.serialize(() => {
        if (next < 5) {
          db.run(`UPDATE loyalty SET ${col}=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`, [next, data.user.id]);
          db.run(`INSERT INTO transactions(user_id, admin_tg_id, type, delta) VALUES(?,?,?,?)`, [data.user.id, admin_tg_id, kind, +1]);
        } else {
          // Redeem: сбросить до 0 и увеличить циклы
          db.run(`UPDATE loyalty SET ${col}=0, ${cyc}=${cyc}+1, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`, [data.user.id]);
          db.run(`INSERT INTO transactions(user_id, admin_tg_id, type, delta) VALUES(?,?,?,?)`, [data.user.id, admin_tg_id, kind === 'pizza' ? 'redeem_pizza' : 'redeem_coffee', -5]);
        }
        
        getCardByTgId(tgId).then(resolve).catch(reject);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function adjustStamp(tgId: number, kind: 'pizza'|'coffee', delta: number, admin_tg_id: number): Promise<{ user: any; card: LoyaCard }> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getCardByTgId(tgId);
      if (!data) throw new Error('NO_USER');
      
      const col = kind === 'pizza' ? 'pizza_count' : 'coffee_count';
      const current = data.card[col as keyof LoyaCard] as number;
      const next = Math.max(0, Math.min(5, current + delta));
      
      db.serialize(() => {
        db.run(`UPDATE loyalty SET ${col}=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`, [next, data.user.id]);
        db.run(`INSERT INTO transactions(user_id, admin_tg_id, type, delta) VALUES(?,?,?,?)`, [data.user.id, admin_tg_id, 'adjust', delta]);
        
        getCardByTgId(tgId).then(resolve).catch(reject);
      });
    } catch (error) {
      reject(error);
    }
  });
}
