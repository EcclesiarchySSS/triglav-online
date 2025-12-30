// Data Types
export interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

export interface Faction {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  image: string;
  iconName: 'Leaf' | 'Cpu' | 'Skull';
}

export interface GameData {
  name: string;
  slogan: string;
  tagline: string;
  description: string;
  fullDescription: string;
  features: FeatureItem[];
  factions: Faction[];
  screenshots: string[];
  serverStatus: 'online' | 'offline' | 'maintenance';
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  preview: string;
  image: string;
}

export interface Character {
  id: string;
  name: string;
  class: 'warrior' | 'archer' | 'mage' | 'cavalry';
  level: number;
  created: string;
}

export interface User {
  email: string;
  nickname: string;
  password?: string;
  role: 'user' | 'admin';
  registeredAt: string;
  characters: Character[];
}

// Default Data (Factory Settings)
const DEFAULT_GAME_DATA: GameData = {
  name: "TRIGLAV ONLINE",
  slogan: "Командуй. Сражайся. Побеждай.",
  tagline: "Стратегическая MMORPG в сеттинге славянского фэнтези",
  description: "Управляйте героем, ведущим за собой отряд воинов. Исследуйте три мира славянской мифологии. Выберите свою фракцию и участвуйте в глобальном противостоянии.",
  fullDescription: "Станьте воином, ремесленником или торговцем. Вся экономика создаётся игроками.",
  features: [
    {
      title: "Экономика игроков",
      description: "Создавайте ресурсы и торгуйте на глобальном рынке. Вся экономика контролируется действиями игроков.",
      image: "https://placehold.co/800x600/171717/737373?text=Economy"
    },
    {
      title: "Чёрные зоны",
      description: "Опасные территории с механикой полного выпадения вещей (Full Loot). Рискните всем ради великой награды.",
      image: "https://placehold.co/800x600/171717/737373?text=PvP+Zone"
    },
    {
      title: "Осады замков",
      description: "Масштабные сражения за контроль территорий и налогов. Объединяйтесь в гильдии и доминируйте.",
      image: "https://placehold.co/800x600/171717/737373?text=Siege"
    }
  ],
  factions: [
    {
      id: 'arkon',
      name: "Империя Аркон",
      subtitle: "Традиции и Вера",
      iconName: 'Leaf',
      description: "Защитники древних устоев и порядка. Сочетают тяжелую сталь и непоколебимую веру в светлое будущее.",
      color: "from-emerald-600 to-emerald-800",
      borderColor: "border-emerald-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-950/30",
      image: "https://image2url.com/r2/default/images/1767132092957-ab00049e-9029-43ad-8f26-1e1f528d491a.jpg"
    },
    {
      id: 'ssr',
      name: "Союз Республик",
      subtitle: "Технократия",
      iconName: 'Cpu',
      description: "Мастера механизмов и паровых машин. Полагаются на дисциплину, мощь технологий и индустриальный прогресс.",
      color: "from-amber-700 to-amber-900",
      borderColor: "border-amber-700",
      textColor: "text-amber-400",
      bgColor: "bg-amber-950/30",
      image: "https://image2url.com/r2/default/images/1767132156688-7c7e32c5-4543-4e61-ae5a-760c67c740c5.jpg"
    },
    {
      id: 'mgla',
      name: "Мгла",
      subtitle: "Хаос и Тьма",
      iconName: 'Skull',
      description: "Загадочные существа, использующие темную магию и первобытный страх для достижения своих целей в мире Нави.",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-950/30",
      image: "https://image2url.com/r2/default/images/1767132179982-5a0fd591-3557-4a99-8749-4e899645bb54.jpg"
    }
  ],
  screenshots: [
    "https://placehold.co/1920x1080/000000/333333?text=Gameplay+1",
    "https://placehold.co/1920x1080/000000/333333?text=Gameplay+2",
    "https://placehold.co/1920x1080/000000/333333?text=Gameplay+3"
  ],
  serverStatus: 'maintenance'
};

const KEYS = {
  GAME_DATA: 'triglav_content_data',
  NEWS: 'triglav_content_news',
  USERS: 'triglav_users_db'
};

// Database Methods (Synchronous LocalStorage)
export const db = {
  init: () => {
    try {
      const existing = localStorage.getItem(KEYS.GAME_DATA);
      if (!existing) {
        localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(DEFAULT_GAME_DATA));
      }
    } catch (e) {
      console.error("DB Init failed", e);
    }
  },

  resetToDefaults: () => {
    localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(DEFAULT_GAME_DATA));
    localStorage.removeItem(KEYS.NEWS);
    window.location.reload();
  },

  getGameData: (): GameData => {
    const data = localStorage.getItem(KEYS.GAME_DATA);
    if (!data) return DEFAULT_GAME_DATA;
    try {
        return JSON.parse(data);
    } catch {
        return DEFAULT_GAME_DATA;
    }
  },

  updateGameData: (newData: GameData) => {
    localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(newData));
  },

  getNews: (): NewsItem[] => {
    const data = localStorage.getItem(KEYS.NEWS);
    return data ? JSON.parse(data) : [];
  },

  addNews: (newsItem: Omit<NewsItem, 'id'>) => {
    const news = db.getNews();
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;
    const newItem = { ...newsItem, id: newId };
    localStorage.setItem(KEYS.NEWS, JSON.stringify([newItem, ...news]));
  },

  deleteNews: (id: number) => {
    const news = db.getNews().filter(n => n.id !== id);
    localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (email: string, updates: Partial<User>) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
  }
};

// Alias for compatibility if needed, though we switched to 'db'
export const api = db;