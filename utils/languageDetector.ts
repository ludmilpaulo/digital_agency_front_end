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
 * Detect user's browser language (automatic, no manual override)
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';

  // Always detect from browser (no localStorage override)
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
 * Get user's current language (automatic detection only)
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return detectBrowserLanguage();
};

/**
 * Basic translations for common UI elements
 */
export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common UI
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
    'home': 'Home',
    'services': 'Services',
    'blog': 'Blog',
    'about_us': 'About Us',
    'contact': 'Contact',
    'get_quote': 'Get a Quote',
    'get_started': 'Get Started',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'my_projects': 'My Projects',
    'my_tasks': 'My Tasks',
    'my_appointments': 'My Appointments',
    'appointments': 'Appointments',
    'proposals': 'Proposals',
    'my_proposals': 'My Proposals',
    'profile': 'Profile',
    'settings': 'Settings',
    'overview': 'Overview',
    'analytics': 'Analytics',
    'team': 'Team',
    'members': 'Members',
    'documents': 'Documents',
    'campaigns': 'Campaigns',
    'careers': 'Careers',
    
    // Actions
    'create_new': 'Create New',
    'edit_item': 'Edit',
    'delete_item': 'Delete',
    'view_details': 'View Details',
    'send_request': 'Send Request',
    'download': 'Download',
    'upload': 'Upload',
    'add': 'Add',
    'remove': 'Remove',
    'update': 'Update',
    'create': 'Create',
    
    // Form Fields
    'name': 'Name',
    'email': 'Email',
    'password': 'Password',
    'phone': 'Phone',
    'company': 'Company',
    'message': 'Message',
    'description': 'Description',
    'title': 'Title',
    'status': 'Status',
    'priority': 'Priority',
    'due_date': 'Due Date',
    'budget': 'Budget',
    
    // Messages
    'success': 'Success!',
    'error': 'Error!',
    'welcome_back': 'Welcome back',
    'no_data': 'No data available',
    'try_again': 'Try again',
    'something_wrong': 'Something went wrong',
    'please_wait': 'Please wait...',
    'confirm_delete': 'Are you sure you want to delete this?',
    'changes_saved': 'Changes saved successfully',
    'request_submitted': 'Request submitted successfully',
    'thank_you': 'Thank you!',
    
    // Proposal & Contact
    'request_proposal': 'Request a Proposal',
    'have_project': 'Have a Project?',
    'lets_build': "Let's Build it Together!",
    'your_name': 'Your Name',
    'your_email': 'Your Email',
    'your_message': 'Your Message',
    'send_message': 'Send Message',
    'contact_us': 'Contact Us',
    
    // Dashboard Sections
    'active_projects': 'Active Projects',
    'pending_tasks': 'Pending Tasks',
    'recent_activity': 'Recent Activity',
    'project_progress': 'Project Progress',
    'upcoming_deadlines': 'Upcoming Deadlines',
    'no_projects': 'No projects yet',
    'no_tasks': 'No tasks yet',
    'no_appointments': 'No appointments',
    'no_proposals': 'No proposals',
    
    // Status
    'active': 'Active',
    'completed': 'Completed',
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'scheduled': 'Scheduled',
    'cancelled': 'Cancelled',
  },
  
  es: {
    // Common UI
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
    'home': 'Inicio',
    'services': 'Servicios',
    'blog': 'Blog',
    'about_us': 'Sobre Nosotros',
    'contact': 'Contacto',
    'get_quote': 'Obtener Cotización',
    'get_started': 'Comenzar',
    
    // Dashboard
    'dashboard': 'Panel de Control',
    'my_projects': 'Mis Proyectos',
    'my_tasks': 'Mis Tareas',
    'my_appointments': 'Mis Citas',
    'appointments': 'Citas',
    'proposals': 'Propuestas',
    'my_proposals': 'Mis Propuestas',
    'profile': 'Perfil',
    'settings': 'Configuración',
    'overview': 'Resumen',
    'analytics': 'Analíticas',
    'team': 'Equipo',
    'members': 'Miembros',
    'documents': 'Documentos',
    'campaigns': 'Campañas',
    'careers': 'Carreras',
    
    // Actions
    'create_new': 'Crear Nuevo',
    'edit_item': 'Editar',
    'delete_item': 'Eliminar',
    'view_details': 'Ver Detalles',
    'send_request': 'Enviar Solicitud',
    'download': 'Descargar',
    'upload': 'Subir',
    'add': 'Agregar',
    'remove': 'Eliminar',
    'update': 'Actualizar',
    'create': 'Crear',
    
    // Form Fields
    'name': 'Nombre',
    'email': 'Correo Electrónico',
    'password': 'Contraseña',
    'phone': 'Teléfono',
    'company': 'Empresa',
    'message': 'Mensaje',
    'description': 'Descripción',
    'title': 'Título',
    'status': 'Estado',
    'priority': 'Prioridad',
    'due_date': 'Fecha de Vencimiento',
    'budget': 'Presupuesto',
    
    // Messages
    'success': '¡Éxito!',
    'error': '¡Error!',
    'welcome_back': 'Bienvenido de nuevo',
    'no_data': 'No hay datos disponibles',
    'try_again': 'Intentar de nuevo',
    'something_wrong': 'Algo salió mal',
    'please_wait': 'Por favor espere...',
    'confirm_delete': '¿Está seguro de que desea eliminar esto?',
    'changes_saved': 'Cambios guardados con éxito',
    'request_submitted': 'Solicitud enviada con éxito',
    'thank_you': '¡Gracias!',
    
    // Proposal & Contact
    'request_proposal': 'Solicitar Propuesta',
    'have_project': '¿Tienes un Proyecto?',
    'lets_build': '¡Construyámoslo Juntos!',
    'your_name': 'Tu Nombre',
    'your_email': 'Tu Correo',
    'your_message': 'Tu Mensaje',
    'send_message': 'Enviar Mensaje',
    'contact_us': 'Contáctenos',
    
    // Dashboard Sections
    'active_projects': 'Proyectos Activos',
    'pending_tasks': 'Tareas Pendientes',
    'recent_activity': 'Actividad Reciente',
    'project_progress': 'Progreso del Proyecto',
    'upcoming_deadlines': 'Próximos Vencimientos',
    'no_projects': 'Aún no hay proyectos',
    'no_tasks': 'Aún no hay tareas',
    'no_appointments': 'No hay citas',
    'no_proposals': 'No hay propuestas',
    
    // Status
    'active': 'Activo',
    'completed': 'Completado',
    'pending': 'Pendiente',
    'in_progress': 'En Progreso',
    'scheduled': 'Programado',
    'cancelled': 'Cancelado',
  },
  
  pt: {
    // Override with Portuguese translations
    'welcome': 'Bem-vindo', 'login': 'Entrar', 'logout': 'Sair', 'signup': 'Cadastrar', 'submit': 'Enviar',
    'cancel': 'Cancelar', 'save': 'Salvar', 'delete': 'Excluir', 'edit': 'Editar', 'view': 'Ver',
    'search': 'Pesquisar', 'filter': 'Filtrar', 'clear': 'Limpar', 'loading': 'Carregando...', 'home': 'Início',
    'services': 'Serviços', 'blog': 'Blog', 'about_us': 'Sobre Nós', 'contact': 'Contato', 'get_quote': 'Solicitar Orçamento',
    'get_started': 'Começar', 'dashboard': 'Painel', 'my_projects': 'Meus Projetos', 'my_tasks': 'Minhas Tarefas',
    'my_appointments': 'Meus Compromissos', 'appointments': 'Compromissos', 'proposals': 'Propostas', 'my_proposals': 'Minhas Propostas',
    'profile': 'Perfil', 'settings': 'Configurações', 'overview': 'Visão Geral', 'analytics': 'Análises',
    'team': 'Equipe', 'members': 'Membros', 'documents': 'Documentos', 'campaigns': 'Campanhas', 'careers': 'Carreiras',
    'create_new': 'Criar Novo', 'edit_item': 'Editar', 'delete_item': 'Excluir', 'view_details': 'Ver Detalhes',
    'send_request': 'Enviar Solicitação', 'download': 'Baixar', 'upload': 'Enviar', 'add': 'Adicionar',
    'remove': 'Remover', 'update': 'Atualizar', 'create': 'Criar', 'name': 'Nome', 'email': 'E-mail',
    'password': 'Senha', 'phone': 'Telefone', 'company': 'Empresa', 'message': 'Mensagem', 'description': 'Descrição',
    'title': 'Título', 'status': 'Status', 'priority': 'Prioridade', 'due_date': 'Data de Vencimento', 'budget': 'Orçamento',
    'success': 'Sucesso!', 'error': 'Erro!', 'welcome_back': 'Bem-vindo de volta', 'no_data': 'Nenhum dado disponível',
    'try_again': 'Tentar novamente', 'something_wrong': 'Algo deu errado', 'please_wait': 'Por favor, aguarde...',
    'confirm_delete': 'Tem certeza que deseja excluir isto?', 'changes_saved': 'Alterações salvas com sucesso',
    'request_submitted': 'Solicitação enviada com sucesso', 'thank_you': 'Obrigado!', 'request_proposal': 'Solicitar Proposta',
    'have_project': 'Tem um Projeto?', 'lets_build': 'Vamos Construir Juntos!', 'your_name': 'Seu Nome',
    'your_email': 'Seu E-mail', 'your_message': 'Sua Mensagem', 'send_message': 'Enviar Mensagem', 'contact_us': 'Fale Conosco',
    'active_projects': 'Projetos Ativos', 'pending_tasks': 'Tarefas Pendentes', 'recent_activity': 'Atividade Recente',
    'project_progress': 'Progresso do Projeto', 'upcoming_deadlines': 'Prazos Próximos', 'no_projects': 'Ainda sem projetos',
    'no_tasks': 'Ainda sem tarefas', 'no_appointments': 'Sem compromissos', 'no_proposals': 'Sem propostas',
    'active': 'Ativo', 'completed': 'Concluído', 'pending': 'Pendente', 'in_progress': 'Em Andamento',
    'scheduled': 'Agendado', 'cancelled': 'Cancelado',
  },
  
  fr: {
    'welcome': 'Bienvenue', 'login': 'Connexion', 'logout': 'Déconnexion', 'signup': "S'inscrire", 'submit': 'Soumettre',
    'cancel': 'Annuler', 'save': 'Enregistrer', 'delete': 'Supprimer', 'edit': 'Modifier', 'view': 'Voir',
    'search': 'Rechercher', 'filter': 'Filtrer', 'clear': 'Effacer', 'loading': 'Chargement...', 'home': 'Accueil',
    'services': 'Services', 'blog': 'Blog', 'about_us': 'À Propos', 'contact': 'Contact', 'get_quote': 'Obtenir un Devis',
    'get_started': 'Commencer', 'dashboard': 'Tableau de Bord', 'my_projects': 'Mes Projets', 'my_tasks': 'Mes Tâches',
    'my_appointments': 'Mes Rendez-vous', 'appointments': 'Rendez-vous', 'proposals': 'Propositions', 'my_proposals': 'Mes Propositions',
    'profile': 'Profil', 'settings': 'Paramètres', 'overview': 'Aperçu', 'analytics': 'Analytique',
    'team': 'Équipe', 'members': 'Membres', 'documents': 'Documents', 'campaigns': 'Campagnes', 'careers': 'Carrières',
    'create_new': 'Créer Nouveau', 'edit_item': 'Modifier', 'delete_item': 'Supprimer', 'view_details': 'Voir Détails',
    'send_request': 'Envoyer Demande', 'download': 'Télécharger', 'upload': 'Téléverser', 'add': 'Ajouter',
    'remove': 'Retirer', 'update': 'Mettre à Jour', 'create': 'Créer', 'name': 'Nom', 'email': 'E-mail',
    'password': 'Mot de Passe', 'phone': 'Téléphone', 'company': 'Entreprise', 'message': 'Message', 'description': 'Description',
    'title': 'Titre', 'status': 'Statut', 'priority': 'Priorité', 'due_date': 'Date Limite', 'budget': 'Budget',
    'success': 'Succès!', 'error': 'Erreur!', 'welcome_back': 'Bon Retour', 'no_data': 'Aucune Donnée',
    'try_again': 'Réessayer', 'something_wrong': 'Quelque Chose ne va Pas', 'please_wait': 'Veuillez Patienter...',
    'confirm_delete': 'Êtes-vous sûr de vouloir supprimer ceci?', 'changes_saved': 'Modifications Enregistrées',
    'request_submitted': 'Demande Envoyée avec Succès', 'thank_you': 'Merci!', 'request_proposal': 'Demander une Proposition',
    'have_project': 'Avez-vous un Projet?', 'lets_build': 'Construisons Ensemble!', 'your_name': 'Votre Nom',
    'your_email': 'Votre E-mail', 'your_message': 'Votre Message', 'send_message': 'Envoyer Message', 'contact_us': 'Contactez-nous',
    'active_projects': 'Projets Actifs', 'pending_tasks': 'Tâches en Attente', 'recent_activity': 'Activité Récente',
    'project_progress': 'Progrès du Projet', 'upcoming_deadlines': 'Échéances à Venir', 'no_projects': 'Pas Encore de Projets',
    'no_tasks': 'Pas Encore de Tâches', 'no_appointments': 'Pas de Rendez-vous', 'no_proposals': 'Pas de Propositions',
    'active': 'Actif', 'completed': 'Terminé', 'pending': 'En Attente', 'in_progress': 'En Cours',
    'scheduled': 'Programmé', 'cancelled': 'Annulé',
  },
  
  de: {
    'welcome': 'Willkommen', 'login': 'Anmelden', 'logout': 'Abmelden', 'signup': 'Registrieren', 'submit': 'Absenden',
    'cancel': 'Abbrechen', 'save': 'Speichern', 'delete': 'Löschen', 'edit': 'Bearbeiten', 'view': 'Ansehen',
    'search': 'Suchen', 'filter': 'Filtern', 'clear': 'Löschen', 'loading': 'Lädt...', 'home': 'Startseite',
    'services': 'Dienstleistungen', 'blog': 'Blog', 'about_us': 'Über Uns', 'contact': 'Kontakt', 'get_quote': 'Angebot Erhalten',
    'get_started': 'Beginnen', 'dashboard': 'Dashboard', 'my_projects': 'Meine Projekte', 'my_tasks': 'Meine Aufgaben',
    'my_appointments': 'Meine Termine', 'appointments': 'Termine', 'proposals': 'Vorschläge', 'my_proposals': 'Meine Vorschläge',
    'profile': 'Profil', 'settings': 'Einstellungen', 'overview': 'Übersicht', 'analytics': 'Analytik',
    'team': 'Team', 'members': 'Mitglieder', 'documents': 'Dokumente', 'campaigns': 'Kampagnen', 'careers': 'Karriere',
    'create_new': 'Neu Erstellen', 'edit_item': 'Bearbeiten', 'delete_item': 'Löschen', 'view_details': 'Details Anzeigen',
    'send_request': 'Anfrage Senden', 'download': 'Herunterladen', 'upload': 'Hochladen', 'add': 'Hinzufügen',
    'remove': 'Entfernen', 'update': 'Aktualisieren', 'create': 'Erstellen', 'name': 'Name', 'email': 'E-Mail',
    'password': 'Passwort', 'phone': 'Telefon', 'company': 'Firma', 'message': 'Nachricht', 'description': 'Beschreibung',
    'title': 'Titel', 'status': 'Status', 'priority': 'Priorität', 'due_date': 'Fälligkeitsdatum', 'budget': 'Budget',
    'success': 'Erfolg!', 'error': 'Fehler!', 'welcome_back': 'Willkommen Zurück', 'no_data': 'Keine Daten',
    'try_again': 'Erneut Versuchen', 'something_wrong': 'Etwas ist Schief Gelaufen', 'please_wait': 'Bitte Warten...',
    'confirm_delete': 'Sind Sie sicher, dass Sie dies löschen möchten?', 'changes_saved': 'Änderungen Gespeichert',
    'request_submitted': 'Anfrage Erfolgreich Gesendet', 'thank_you': 'Danke!', 'request_proposal': 'Angebot Anfordern',
    'have_project': 'Haben Sie ein Projekt?', 'lets_build': 'Lass uns Zusammen Bauen!', 'your_name': 'Ihr Name',
    'your_email': 'Ihre E-Mail', 'your_message': 'Ihre Nachricht', 'send_message': 'Nachricht Senden', 'contact_us': 'Kontaktieren Sie Uns',
    'active_projects': 'Aktive Projekte', 'pending_tasks': 'Ausstehende Aufgaben', 'recent_activity': 'Letzte Aktivität',
    'project_progress': 'Projektfortschritt', 'upcoming_deadlines': 'Bevorstehende Fristen', 'no_projects': 'Noch Keine Projekte',
    'no_tasks': 'Noch Keine Aufgaben', 'no_appointments': 'Keine Termine', 'no_proposals': 'Keine Vorschläge',
    'active': 'Aktiv', 'completed': 'Abgeschlossen', 'pending': 'Ausstehend', 'in_progress': 'In Bearbeitung',
    'scheduled': 'Geplant', 'cancelled': 'Storniert',
  },
  
  zh: {
    'welcome': '欢迎', 'login': '登录', 'logout': '登出', 'signup': '注册', 'submit': '提交',
    'cancel': '取消', 'save': '保存', 'delete': '删除', 'edit': '编辑', 'view': '查看',
    'search': '搜索', 'filter': '筛选', 'clear': '清除', 'loading': '加载中...', 'home': '首页',
    'services': '服务', 'blog': '博客', 'about_us': '关于我们', 'contact': '联系我们', 'get_quote': '获取报价',
    'get_started': '开始', 'dashboard': '仪表板', 'my_projects': '我的项目', 'my_tasks': '我的任务',
    'my_appointments': '我的预约', 'appointments': '预约', 'proposals': '提案', 'my_proposals': '我的提案',
    'profile': '个人资料', 'settings': '设置', 'overview': '概览', 'analytics': '分析',
    'team': '团队', 'members': '成员', 'documents': '文档', 'campaigns': '营销活动', 'careers': '职业',
    'create_new': '新建', 'edit_item': '编辑', 'delete_item': '删除', 'view_details': '查看详情',
    'send_request': '发送请求', 'download': '下载', 'upload': '上传', 'add': '添加',
    'remove': '移除', 'update': '更新', 'create': '创建', 'name': '姓名', 'email': '电子邮件',
    'password': '密码', 'phone': '电话', 'company': '公司', 'message': '消息', 'description': '描述',
    'title': '标题', 'status': '状态', 'priority': '优先级', 'due_date': '截止日期', 'budget': '预算',
    'success': '成功！', 'error': '错误！', 'welcome_back': '欢迎回来', 'no_data': '暂无数据',
    'try_again': '重试', 'something_wrong': '出错了', 'please_wait': '请稍候...',
    'confirm_delete': '确定要删除吗？', 'changes_saved': '更改已保存', 'request_submitted': '请求已提交',
    'thank_you': '谢谢！', 'request_proposal': '申请提案', 'have_project': '有项目？',
    'lets_build': '让我们一起建造！', 'your_name': '您的姓名', 'your_email': '您的邮箱',
    'your_message': '您的消息', 'send_message': '发送消息', 'contact_us': '联系我们',
    'active_projects': '活跃项目', 'pending_tasks': '待办任务', 'recent_activity': '最近活动',
    'project_progress': '项目进度', 'upcoming_deadlines': '即将到期', 'no_projects': '暂无项目',
    'no_tasks': '暂无任务', 'no_appointments': '无预约', 'no_proposals': '无提案',
    'active': '活跃', 'completed': '已完成', 'pending': '待处理', 'in_progress': '进行中',
    'scheduled': '已安排', 'cancelled': '已取消',
  },
  
  ar: {
    'welcome': 'مرحباً', 'login': 'تسجيل الدخول', 'logout': 'تسجيل الخروج', 'signup': 'التسجيل', 'submit': 'إرسال',
    'cancel': 'إلغاء', 'save': 'حفظ', 'delete': 'حذف', 'edit': 'تعديل', 'view': 'عرض',
    'search': 'بحث', 'filter': 'تصفية', 'clear': 'مسح', 'loading': 'جاري التحميل...', 'home': 'الرئيسية',
    'services': 'الخدمات', 'blog': 'المدونة', 'about_us': 'عنا', 'contact': 'اتصل بنا', 'get_quote': 'احصل على عرض',
    'get_started': 'ابدأ', 'dashboard': 'لوحة التحكم', 'my_projects': 'مشاريعي', 'my_tasks': 'مهامي',
    'my_appointments': 'مواعيدي', 'appointments': 'المواعيد', 'proposals': 'المقترحات', 'my_proposals': 'مقترحاتي',
    'profile': 'الملف الشخصي', 'settings': 'الإعدادات', 'overview': 'نظرة عامة', 'analytics': 'التحليلات',
    'team': 'الفريق', 'members': 'الأعضاء', 'documents': 'المستندات', 'campaigns': 'الحملات', 'careers': 'الوظائف',
    'create_new': 'إنشاء جديد', 'edit_item': 'تعديل', 'delete_item': 'حذف', 'view_details': 'عرض التفاصيل',
    'send_request': 'إرسال الطلب', 'download': 'تحميل', 'upload': 'رفع', 'add': 'إضافة',
    'remove': 'إزالة', 'update': 'تحديث', 'create': 'إنشاء', 'name': 'الاسم', 'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور', 'phone': 'الهاتف', 'company': 'الشركة', 'message': 'الرسالة', 'description': 'الوصف',
    'title': 'العنوان', 'status': 'الحالة', 'priority': 'الأولوية', 'due_date': 'تاريخ الاستحقاق', 'budget': 'الميزانية',
    'success': 'نجح!', 'error': 'خطأ!', 'welcome_back': 'مرحباً بعودتك', 'no_data': 'لا توجد بيانات',
    'try_again': 'حاول مرة أخرى', 'something_wrong': 'حدث خطأ ما', 'please_wait': 'يرجى الانتظار...',
    'confirm_delete': 'هل أنت متأكد من الحذف؟', 'changes_saved': 'تم حفظ التغييرات', 'request_submitted': 'تم إرسال الطلب',
    'thank_you': 'شكراً لك!', 'request_proposal': 'طلب مقترح', 'have_project': 'لديك مشروع؟',
    'lets_build': 'دعنا نبنيه معاً!', 'your_name': 'اسمك', 'your_email': 'بريدك الإلكتروني',
    'your_message': 'رسالتك', 'send_message': 'إرسال رسالة', 'contact_us': 'اتصل بنا',
    'active_projects': 'المشاريع النشطة', 'pending_tasks': 'المهام المعلقة', 'recent_activity': 'النشاط الأخير',
    'project_progress': 'تقدم المشروع', 'upcoming_deadlines': 'المواعيد القادمة', 'no_projects': 'لا توجد مشاريع بعد',
    'no_tasks': 'لا توجد مهام بعد', 'no_appointments': 'لا توجد مواعيد', 'no_proposals': 'لا توجد مقترحات',
    'active': 'نشط', 'completed': 'مكتمل', 'pending': 'معلق', 'in_progress': 'قيد التنفيذ',
    'scheduled': 'مجدول', 'cancelled': 'ملغى',
  },
  
  af: {
    'welcome': 'Welkom', 'login': 'Teken In', 'logout': 'Teken Uit', 'signup': 'Registreer', 'submit': 'Stuur',
    'cancel': 'Kanselleer', 'save': 'Stoor', 'delete': 'Verwyder', 'edit': 'Wysig', 'view': 'Bekyk',
    'search': 'Soek', 'filter': 'Filter', 'clear': 'Maak Skoon', 'loading': 'Laai...', 'home': 'Tuis',
    'services': 'Dienste', 'blog': 'Blog', 'about_us': 'Oor Ons', 'contact': 'Kontak', 'get_quote': 'Kry Kwotasie',
    'get_started': 'Begin', 'dashboard': 'Dashboard', 'my_projects': 'My Projekte', 'my_tasks': 'My Take',
    'my_appointments': 'My Afsprake', 'appointments': 'Afsprake', 'proposals': 'Voorstelle', 'my_proposals': 'My Voorstelle',
    'profile': 'Profiel', 'settings': 'Instellings', 'overview': 'Oorsig', 'analytics': 'Ontledings',
    'team': 'Span', 'members': 'Lede', 'documents': 'Dokumente', 'campaigns': 'Veldtogte', 'careers': 'Loopbane',
    'create_new': 'Skep Nuwe', 'edit_item': 'Wysig', 'delete_item': 'Verwyder', 'view_details': 'Bekyk Besonderhede',
    'send_request': 'Stuur Versoek', 'download': 'Laai Af', 'upload': 'Laai Op', 'add': 'Voeg By',
    'remove': 'Verwyder', 'update': 'Werk By', 'create': 'Skep', 'name': 'Naam', 'email': 'E-pos',
    'password': 'Wagwoord', 'phone': 'Telefoon', 'company': 'Maatskappy', 'message': 'Boodskap', 'description': 'Beskrywing',
    'title': 'Titel', 'status': 'Status', 'priority': 'Prioriteit', 'due_date': 'Sperdatum', 'budget': 'Begroting',
    'success': 'Sukses!', 'error': 'Fout!', 'welcome_back': 'Welkom Terug', 'no_data': 'Geen Data',
    'try_again': 'Probeer Weer', 'something_wrong': 'Iets het Fout Geloop', 'please_wait': 'Wag Asseblief...',
    'confirm_delete': 'Is jy seker jy wil dit verwyder?', 'changes_saved': 'Veranderinge Gestoor',
    'request_submitted': 'Versoek Suksesvol Gestuur', 'thank_you': 'Dankie!', 'request_proposal': 'Versoek Voorstel',
    'have_project': 'Het jy ʼn Projek?', 'lets_build': 'Kom Ons Bou Saam!', 'your_name': 'Jou Naam',
    'your_email': 'Jou E-pos', 'your_message': 'Jou Boodskap', 'send_message': 'Stuur Boodskap', 'contact_us': 'Kontak Ons',
    'active_projects': 'Aktiewe Projekte', 'pending_tasks': 'Hangende Take', 'recent_activity': 'Onlangse Aktiwiteit',
    'project_progress': 'Projekvordering', 'upcoming_deadlines': 'Komende Sperdatums', 'no_projects': 'Nog Geen Projekte',
    'no_tasks': 'Nog Geen Take', 'no_appointments': 'Geen Afsprake', 'no_proposals': 'Geen Voorstelle',
    'active': 'Aktief', 'completed': 'Voltooi', 'pending': 'Hangende', 'in_progress': 'In Proses',
    'scheduled': 'Geskeduleer', 'cancelled': 'Gekanselleer',
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

