// Типы данных приложения
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

// Константы данных (используем качественные фотостоки для презентации)
const DEFAULT_GAME_DATA: GameData = {
  name: "TRIGLAV ONLINE",
  slogan: "Командуй. Сражайся. Побеждай.",
  tagline: "Стратегическая MMORPG в сеттинге славянского фэнтези",
  description: "Управляйте героем, ведущим за собой отряд воинов. Исследуйте три мира славянской мифологии: Явь, Правь и Навь. Выберите одну из трёх великих фракций и участвуйте в эпическом противостоянии.",
  fullDescription: "Станьте воином, ремесленником, строителем или собирателем. Вся экономика создаётся игроками — от простого меча до легендарных артефактов.",
  features: [
    {
      title: "Экономика игроков",
      description: "Создавайте ресурсы и торгуйте на глобальном рынке. Каждый предмет в игре сделан кем-то из игроков.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Чёрные зоны",
      description: "Опасные территории с механикой Full Loot. Рискните всем ради великой награды.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Осады замков",
      description: "Масштабные сражения за контроль территорий и налоговые отчисления с городов.",
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=800"
    }
  ],
  factions: [
    {
      id: 'arkon',
      name: "Империя Аркон",
      subtitle: "Природная гармония",
      iconName: 'Leaf',
      description: "Защитники лесов и древних традиций. Сильны в магии природы и партизанской войне.",
      color: "from-emerald-600 to-emerald-800",
      borderColor: "border-emerald-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-950/30",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'ssr',
      name: "Союз Республик",
      subtitle: "Технократия",
      iconName: 'Cpu',
      description: "Инженеры и изобретатели, полагающиеся на механизмы и дисциплину регулярной армии.",
      color: "from-amber-700 to-amber-900",
      borderColor: "border-amber-700",
      textColor: "text-amber-400",
      bgColor: "bg-amber-950/30",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'mgla',
      name: "Мгла",
      subtitle: "Демоническая мощь",
      iconName: 'Skull',
      description: "Последователи тёмных культов, использующие силу хаоса для сокрушения врагов.",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-950/30",
      image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800"
    }
  ],
  screenshots: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1200"
  ],
  serverStatus: 'maintenance'
};

const KEYS = {
  GAME_DATA: 'triglav_content_data',
  NEWS: 'triglav_content_news',
  USERS: 'triglav_users_db'
};

export const db = {
  init: () => {
    try {
      if (!localStorage.getItem(KEYS.GAME_DATA)) {
        localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(DEFAULT_GAME_DATA));
      }
      if (!localStorage.getItem(KEYS.NEWS)) {
        localStorage.setItem(KEYS.NEWS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.USERS)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify([]));
      }
    } catch (e) {
      console.error("LocalStorage initialization failed", e);
    }
  },

  resetToDefaults: () => {
    localStorage.removeItem(KEYS.GAME_DATA);
    localStorage.removeItem(KEYS.NEWS);
    window.location.reload();
    return true;
  },

  getGameData: (): GameData => {
    const data = localStorage.getItem(KEYS.GAME_DATA);
    return data ? JSON.parse(data) : DEFAULT_GAME_DATA;
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
    localStorage.setItem(KEYS.NEWS, JSON.stringify([{ ...newsItem, id: newId }, ...news]));
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

// Выполняем инициализацию сразу при загрузке модуля
db.init();
