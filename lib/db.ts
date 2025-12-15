// Типы данных
export interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

export interface GameData {
  name: string;
  slogan: string;
  tagline: string;
  description: string;
  fullDescription: string;
  features: FeatureItem[];
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

// Данные по умолчанию (если база пустая)
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
  screenshots: [
    "https://placehold.co/1200x700/1a1a1a/amber?text=TRIGLAV+ONLINE+-+Screenshot+1",
    "https://placehold.co/1200x700/1a1a1a/amber?text=TRIGLAV+ONLINE+-+Screenshot+2",
    "https://placehold.co/1200x700/1a1a1a/amber?text=TRIGLAV+ONLINE+-+Screenshot+3",
    "https://placehold.co/1200x700/1a1a1a/amber?text=TRIGLAV+ONLINE+-+Screenshot+4"
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
  },
  {
    id: 2,
    title: "Три великие фракции",
    date: "10 декабря 2025",
    preview: "Познакомьтесь с тремя великими фракциями мира TRIGLAV и выберите свою сторону в вечном противостоянии.",
    image: "https://placehold.co/600x400/1a1a1a/amber?text=Factions"
  },
  {
    id: 3,
    title: "Миры славянской мифологии",
    date: "5 декабря 2025",
    preview: "Явь, Правь и Навь - три мира ждут отважных героев. Исследуйте тайны древних земель.",
    image: "https://placehold.co/600x400/1a1a1a/amber?text=Worlds"
  }
];

// Ключи localStorage
const KEYS = {
  GAME_DATA: 'triglav_content_data',
  NEWS: 'triglav_content_news',
  USERS: 'triglav_users_db'
};

// Сервис базы данных
export const db = {
  // Инициализация
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

  // Полный сброс базы данных (Wipe)
  resetToDefaults: () => {
    localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(DEFAULT_GAME_DATA));
    localStorage.setItem(KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
    // Пользователей можно оставить или удалить, по желанию.
    // Обычно при вайпе удаляют всех кроме админов, но тут просто сбросим контент.
    return true;
  },

  // Работа с контентом игры
  getGameData: (): GameData => {
    const data = localStorage.getItem(KEYS.GAME_DATA);
    if (!data) return DEFAULT_GAME_DATA;
    const parsed = JSON.parse(data);
    return { ...DEFAULT_GAME_DATA, ...parsed };
  },

  updateGameData: (newData: GameData) => {
    localStorage.setItem(KEYS.GAME_DATA, JSON.stringify(newData));
  },

  // Работа с новостями
  getNews: (): NewsItem[] => {
    const data = localStorage.getItem(KEYS.NEWS);
    return data ? JSON.parse(data) : DEFAULT_NEWS;
  },

  addNews: (newsItem: Omit<NewsItem, 'id'>) => {
    const news = db.getNews();
    const newId = Math.max(0, ...news.map(n => n.id)) + 1;
    const newNews = [{ ...newsItem, id: newId }, ...news];
    localStorage.setItem(KEYS.NEWS, JSON.stringify(newNews));
  },

  deleteNews: (id: number) => {
    const news = db.getNews().filter(n => n.id !== id);
    localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
  },

  // Работа с пользователями
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = db.getUsers();
    if (users.some(u => u.email === user.email || u.nickname === user.nickname)) {
      throw new Error('Пользователь с таким email или никнеймом уже существует');
    }
    const newUser = { ...user, characters: [] };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (email: string, updates: Partial<User>) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      const sessionUser = localStorage.getItem('triglav_user');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        if (parsed.email === email) {
          localStorage.setItem('triglav_user', JSON.stringify(users[index]));
        }
      }
    }
  }
};

db.init();