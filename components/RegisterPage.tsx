import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Calendar, Globe, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    birthDate: '',
    country: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const countries = [
    'Россия', 'Украина', 'Беларусь', 'Казахстан', 'США', 'Германия', 
    'Великобритания', 'Франция', 'Польша', 'Чехия', 'Другая'
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateNickname = (nickname: string) => {
    const re = /^[a-zA-Z0-9_-]{3,20}$/;
    return re.test(nickname);
  };

  const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 15;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.nickname) {
      newErrors.nickname = 'Никнейм обязателен';
    } else if (!validateNickname(formData.nickname)) {
      newErrors.nickname = 'Никнейм должен содержать 3-20 символов (буквы, цифры, _ -)';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Дата рождения обязательна';
    } else if (!validateAge(formData.birthDate)) {
      newErrors.birthDate = 'Вам должно быть не менее 15 лет';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо принять правила';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        // Попытка сохранить пользователя в локальную БД
        db.addUser({
          email: formData.email,
          nickname: formData.nickname,
          password: formData.password,
          role: 'user',
          registeredAt: new Date().toISOString(),
          characters: []
        });

        console.log('Пользователь зарегистрирован:', formData.email);
        setIsSubmitting(false);
        setRegistrationSuccess(true);
      } catch (e: any) {
        setServerError(e.message || 'Ошибка регистрации');
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Слабый', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Средний', color: 'bg-yellow-500' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Сильный', color: 'bg-green-500' };
    }
    return { strength: 2, text: 'Средний', color: 'bg-yellow-500' };
  };

  const passwordStrength = getPasswordStrength();

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Регистрация успешна!
          </h2>
          <p className="text-gray-400 mb-6">
            На ваш email <span className="text-amber-500">{formData.email}</span> отправлено письмо с подтверждением. 
            Пожалуйста, подтвердите свой адрес электронной почты.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition font-bold uppercase tracking-wider"
          >
            Войти в аккаунт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="border-b border-amber-900/30 bg-black/50 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-lg border border-amber-500/50">
                <span className="text-black">T</span>
              </div>
              <span className="text-xl font-black tracking-wider text-amber-100">TRIGLAV</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition text-sm"
            >
              <ArrowLeft size={18} />
              <span>На главную</span>
            </button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Регистрация
            </h1>
            <p className="text-gray-400">
              Создайте аккаунт и присоединяйтесь к битве в TRIGLAV ONLINE
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 p-8 md:p-10">
            {serverError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-6 flex items-center">
                <XCircle size={20} className="mr-2" />
                {serverError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Никнейм *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.nickname ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="YourNickname"
                />
              </div>
              {errors.nickname && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.nickname}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                3-20 символов: буквы, цифры, _ -
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Пароль *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.password ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-11 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
              {formData.password && !errors.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Надёжность пароля:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === 1 ? 'text-red-500' :
                      passwordStrength.strength === 2 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-700 overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Подтвердите пароль *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-11 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Дата рождения *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.birthDate ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                />
              </div>
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Страна
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-amber-900/30 pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition appearance-none"
                >
                  <option value="">Выберите страну</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 bg-black/50 border border-amber-900/30 checked:bg-amber-600 focus:outline-none"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition">
                  Я принимаю{' '}
                  <button onClick={() => alert('Правила сайта')} className="text-amber-500 hover:text-amber-400 underline">
                    правила сайта
                  </button>
                  {' '}и{' '}
                  <button onClick={() => alert('Политика конфиденциальности')} className="text-amber-500 hover:text-amber-400 underline">
                    политику конфиденциальности
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 font-bold uppercase tracking-wider transition ${
                isSubmitting
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
              }`}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Уже есть аккаунт?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;