// Типы данных
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
  color: string; // Tailwind class: from-X to-Y
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

// Данные по умолчанию
const DEFAULT_GAME_DATA: GameData = {
  name: "TRIGLAV ONLINE",
  slogan: "Командуй. Сражайся. Побеждай.",
  tagline: "Стратегическая MMORPG",
  description: "Управляйте героем, ведущим за собой отряд воинов. Исследуйте три мира славянской мифологии: Явь, Правь и Навь. Выберите одну из трёх великих фракций и участвуйте в эпическом противостоянии за господство на континенте Средиземье.",
  fullDescription: "Станьте воином, ремесленником, строителем или собирателем. Вся экономика создаётся игроками - от простого меча до легендарных артефактов. В опасных чёрных зонах победитель забирает всё снаряжение поверженных врагов, создавая уникальную экономику без инфляции.",
  features: [
    {
      title: "Экономика игроков",
      description: "Вся экономика управляется игроками. Создавайте оружие, броню, зелья и торгуйте на рынке.",
      image: "https://placehold.co/600x400/1a1a1a/amber?text=Economy"
    },
    {
      title: "Чёрные зоны",
      description: "Опасные территории полного лута. Победитель забирает всё снаряжение поверженных врагов.",
      image: "https://placehold.co/600x400/1a1a1a/red?text=Black+Zones"
    },
    {
      title: "Контроль территорий",
      description: "Захватывайте земли, стройте укрепления и сражайтесь за господство на континенте.",
      image: "https://placehold.co/600x400/1a1a1a/amber?text=Territory"
    }
  ],
  factions: [
    {
      id: 'arkon',
      name: "Империя Аркон",
      subtitle: "Природная",
      iconName: 'Leaf',
      description: "Эльфы, северные люди и оборотни живут в гармонии с природой, развивая свои духовные силы. Они защищают свой цветущий мир от тех, кто угрожает его существованию.",
      color: "from-emerald-600 to-emerald-800",
      borderColor: "border-emerald-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-950/30",
      image: "https://placehold.co/600x400/10b981/1a1a1a?text=Empire+Arkon"
    },
    {
      id: 'ssr',
      name: "Союз Свободных Республик",
      subtitle: "Технократическая",
      iconName: 'Cpu',
      description: "Мастера технологий, сращивающие плоть и механизмы. Искренне верят в свой путь развития и готовы 'просветить' другие расы. Устойчивы к ядам благодаря имплантам.",
      color: "from-amber-700 to-amber-900",
      borderColor: "border-amber-700",
      textColor: "text-amber-400",
      bgColor: "bg-amber-950/30",
      image: "https://placehold.co/600x400/92400e/1a1a1a?text=SSR"
    },
    {
      id: 'mgla',
      name: "Мгла",
      subtitle: "Демоническая",
      iconName: 'Skull',
      description: "Служители тёмных сил, черпающие мощь из демонических недр. Поклоняются золоту и власти, мастерски порабощают разум врагов и накладывают смертельные проклятия.",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-950/30",
      image: "https://placehold.co/600x400/7c3aed/1a1a1a?text=Mgla"
    }
  ],
  screenshots: [
    "https://placehold.co/1200x700/1a1a1a/amber?text=Screenshot+1",
    "https://placehold.co/1200x700/1a1a1a/amber?text=Screenshot+2",
    "https://placehold.co/1200x700/1a1a1a/amber?text=Screenshot+3",
    "https://placehold.co/1200x700/1a1a1a/amber?text=Screenshot+4"
  ],
  serverStatus: 'maintenance'
};

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Анонс альфа-тестирования",
    date: "15 декабря 2025",
    preview: "Регистрация на закрытое альфа-тестирование открыта! Станьте первым, кто испытает TRIGLAV ONLINE.",
    image: "https://placehold.co/600x400/1a1a1a/amber?text=Alpha+Test"
  }
];

const KEYS = {
  GAME_DATA: 'triglav_content_data',
  NEWS: 'triglav_content_news',
  USERS: 'triglav_users_db'
};

export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.GAME_DATA)) {
      localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(DEFAULT_GAME_DATA));
    }
    if (!localStorage.getItem(KEYS.NEWS)) {
      localStorage.setItem(KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
  },

  resetToDefaults: () => {
    localStorage.removeItem(KEYS.GAME_DATA);
    localStorage.removeItem(KEYS.NEWS);
    // Мы не удаляем пользователей (USERS), чтобы не разлогинивать админа
    db.init();
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
    return data ? JSON.parse(data) : DEFAULT_NEWS;
  },

  addNews: (newsItem: Omit<NewsItem, 'id'>) => {
    const news = db.getNews();
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;
    const newNews = [{ ...newsItem, id: newId }, ...news];
    localStorage.setItem(KEYS.NEWS, JSON.stringify(newNews));
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
    if (users.some(u => u.email === user.email || u.nickname === user.nickname)) {
      throw new Error('Пользователь уже существует');
    }
    users.push({ ...user, characters: [] });
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

db.init();
