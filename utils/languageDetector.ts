/**
 * Language Detection and Translation Utility
 * Detects user's browser language and provides basic translation support
 */

export type SupportedLanguage = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'zh' | 'ar' | 'af';

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
];

/**
 * Detect user's browser language
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';

  // Check localStorage first
  const stored = localStorage.getItem('preferred-language');
  if (stored && isSupportedLanguage(stored)) {
    return stored as SupportedLanguage;
  }

  // Detect from browser
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Map to supported language
  if (isSupportedLanguage(langCode)) {
    return langCode as SupportedLanguage;
  }

  return 'en'; // Default to English
};

/**
 * Check if language code is supported
 */
export const isSupportedLanguage = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

/**
 * Set user's preferred language
 */
export const setPreferredLanguage = (code: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred-language', code);
};

/**
 * Get user's current language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return detectBrowserLanguage();
};

/**
 * Basic translations for common UI elements
 */
export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common
    'welcome': 'Welcome',
    'login': 'Login',
    'logout': 'Logout',
    'signup': 'Sign Up',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'search': 'Search',
    'filter': 'Filter',
    'clear': 'Clear',
    'loading': 'Loading...',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'my_projects': 'My Projects',
    'my_tasks': 'My Tasks',
    'appointments': 'Appointments',
    'proposals': 'Proposals',
    'profile': 'Profile',
    'settings': 'Settings',
    
    // Actions
    'create_new': 'Create New',
    'edit_item': 'Edit',
    'delete_item': 'Delete',
    'view_details': 'View Details',
    'send_request': 'Send Request',
    
    // Messages
    'success': 'Success!',
    'error': 'Error!',
    'welcome_back': 'Welcome back',
    'no_data': 'No data available',
    'try_again': 'Try again',
  },
  
  es: {
    // Common
    'welcome': 'Bienvenido',
    'login': 'Iniciar sesión',
    'logout': 'Cerrar sesión',
    'signup': 'Registrarse',
    'submit': 'Enviar',
    'cancel': 'Cancelar',
    'save': 'Guardar',
    'delete': 'Eliminar',
    'edit': 'Editar',
    'view': 'Ver',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'clear': 'Limpiar',
    'loading': 'Cargando...',
    
    // Dashboard
    'dashboard': 'Panel',
    'my_projects': 'Mis Proyectos',
    'my_tasks': 'Mis Tareas',
    'appointments': 'Citas',
    'proposals': 'Propuestas',
    'profile': 'Perfil',
    'settings': 'Configuración',
    
    // Actions
    'create_new': 'Crear Nuevo',
    'edit_item': 'Editar',
    'delete_item': 'Eliminar',
    'view_details': 'Ver Detalles',
    'send_request': 'Enviar Solicitud',
    
    // Messages
    'success': '¡Éxito!',
    'error': '¡Error!',
    'welcome_back': 'Bienvenido de nuevo',
    'no_data': 'No hay datos disponibles',
    'try_again': 'Intentar de nuevo',
  },
  
  pt: {
    // Common
    'welcome': 'Bem-vindo',
    'login': 'Entrar',
    'logout': 'Sair',
    'signup': 'Cadastrar',
    'submit': 'Enviar',
    'cancel': 'Cancelar',
    'save': 'Salvar',
    'delete': 'Excluir',
    'edit': 'Editar',
    'view': 'Ver',
    'search': 'Pesquisar',
    'filter': 'Filtrar',
    'clear': 'Limpar',
    'loading': 'Carregando...',
    
    // Dashboard
    'dashboard': 'Painel',
    'my_projects': 'Meus Projetos',
    'my_tasks': 'Minhas Tarefas',
    'appointments': 'Compromissos',
    'proposals': 'Propostas',
    'profile': 'Perfil',
    'settings': 'Configurações',
    
    // Actions
    'create_new': 'Criar Novo',
    'edit_item': 'Editar',
    'delete_item': 'Excluir',
    'view_details': 'Ver Detalhes',
    'send_request': 'Enviar Solicitação',
    
    // Messages
    'success': 'Sucesso!',
    'error': 'Erro!',
    'welcome_back': 'Bem-vindo de volta',
    'no_data': 'Nenhum dado disponível',
    'try_again': 'Tentar novamente',
  },
  
  fr: {
    // Common
    'welcome': 'Bienvenue',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'signup': "S'inscrire",
    'submit': 'Soumettre',
    'cancel': 'Annuler',
    'save': 'Enregistrer',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'view': 'Voir',
    'search': 'Rechercher',
    'filter': 'Filtrer',
    'clear': 'Effacer',
    'loading': 'Chargement...',
    
    // Dashboard
    'dashboard': 'Tableau de bord',
    'my_projects': 'Mes Projets',
    'my_tasks': 'Mes Tâches',
    'appointments': 'Rendez-vous',
    'proposals': 'Propositions',
    'profile': 'Profil',
    'settings': 'Paramètres',
    
    // Actions
    'create_new': 'Créer nouveau',
    'edit_item': 'Modifier',
    'delete_item': 'Supprimer',
    'view_details': 'Voir les détails',
    'send_request': 'Envoyer la demande',
    
    // Messages
    'success': 'Succès!',
    'error': 'Erreur!',
    'welcome_back': 'Bon retour',
    'no_data': 'Aucune donnée disponible',
    'try_again': 'Réessayer',
  },
  
  de: {
    // Common
    'welcome': 'Willkommen',
    'login': 'Anmelden',
    'logout': 'Abmelden',
    'signup': 'Registrieren',
    'submit': 'Absenden',
    'cancel': 'Abbrechen',
    'save': 'Speichern',
    'delete': 'Löschen',
    'edit': 'Bearbeiten',
    'view': 'Ansehen',
    'search': 'Suchen',
    'filter': 'Filtern',
    'clear': 'Löschen',
    'loading': 'Lädt...',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'my_projects': 'Meine Projekte',
    'my_tasks': 'Meine Aufgaben',
    'appointments': 'Termine',
    'proposals': 'Vorschläge',
    'profile': 'Profil',
    'settings': 'Einstellungen',
    
    // Actions
    'create_new': 'Neu erstellen',
    'edit_item': 'Bearbeiten',
    'delete_item': 'Löschen',
    'view_details': 'Details anzeigen',
    'send_request': 'Anfrage senden',
    
    // Messages
    'success': 'Erfolg!',
    'error': 'Fehler!',
    'welcome_back': 'Willkommen zurück',
    'no_data': 'Keine Daten verfügbar',
    'try_again': 'Erneut versuchen',
  },
  
  zh: {
    // Common
    'welcome': '欢迎',
    'login': '登录',
    'logout': '登出',
    'signup': '注册',
    'submit': '提交',
    'cancel': '取消',
    'save': '保存',
    'delete': '删除',
    'edit': '编辑',
    'view': '查看',
    'search': '搜索',
    'filter': '筛选',
    'clear': '清除',
    'loading': '加载中...',
    
    // Dashboard
    'dashboard': '仪表板',
    'my_projects': '我的项目',
    'my_tasks': '我的任务',
    'appointments': '预约',
    'proposals': '提案',
    'profile': '个人资料',
    'settings': '设置',
    
    // Actions
    'create_new': '新建',
    'edit_item': '编辑',
    'delete_item': '删除',
    'view_details': '查看详情',
    'send_request': '发送请求',
    
    // Messages
    'success': '成功！',
    'error': '错误！',
    'welcome_back': '欢迎回来',
    'no_data': '暂无数据',
    'try_again': '重试',
  },
  
  ar: {
    // Common
    'welcome': 'مرحباً',
    'login': 'تسجيل الدخول',
    'logout': 'تسجيل الخروج',
    'signup': 'التسجيل',
    'submit': 'إرسال',
    'cancel': 'إلغاء',
    'save': 'حفظ',
    'delete': 'حذف',
    'edit': 'تعديل',
    'view': 'عرض',
    'search': 'بحث',
    'filter': 'تصفية',
    'clear': 'مسح',
    'loading': 'جاري التحميل...',
    
    // Dashboard
    'dashboard': 'لوحة التحكم',
    'my_projects': 'مشاريعي',
    'my_tasks': 'مهامي',
    'appointments': 'المواعيد',
    'proposals': 'المقترحات',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    
    // Actions
    'create_new': 'إنشاء جديد',
    'edit_item': 'تعديل',
    'delete_item': 'حذف',
    'view_details': 'عرض التفاصيل',
    'send_request': 'إرسال الطلب',
    
    // Messages
    'success': 'نجح!',
    'error': 'خطأ!',
    'welcome_back': 'مرحباً بعودتك',
    'no_data': 'لا توجد بيانات',
    'try_again': 'حاول مرة أخرى',
  },
  
  af: {
    // Common (Afrikaans - South African language)
    'welcome': 'Welkom',
    'login': 'Teken in',
    'logout': 'Teken uit',
    'signup': 'Registreer',
    'submit': 'Stuur',
    'cancel': 'Kanselleer',
    'save': 'Stoor',
    'delete': 'Verwyder',
    'edit': 'Wysig',
    'view': 'Bekyk',
    'search': 'Soek',
    'filter': 'Filter',
    'clear': 'Maak skoon',
    'loading': 'Laai...',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'my_projects': 'My Projekte',
    'my_tasks': 'My Take',
    'appointments': 'Afsprake',
    'proposals': 'Voorstelle',
    'profile': 'Profiel',
    'settings': 'Instellings',
    
    // Actions
    'create_new': 'Skep nuwe',
    'edit_item': 'Wysig',
    'delete_item': 'Verwyder',
    'view_details': 'Bekyk besonderhede',
    'send_request': 'Stuur versoek',
    
    // Messages
    'success': 'Sukses!',
    'error': 'Fout!',
    'welcome_back': 'Welkom terug',
    'no_data': 'Geen data beskikbaar',
    'try_again': 'Probeer weer',
  },
};

/**
 * Translate a key to current language
 */
export const t = (key: string, lang?: SupportedLanguage): string => {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang]?.[key] || translations['en'][key] || key;
};

/**
 * Get language configuration
 */
export const getLanguageConfig = (code: SupportedLanguage): LanguageConfig | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

