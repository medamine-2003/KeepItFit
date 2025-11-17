// Translation data for English and Arabic
export const translations = {
  en: {
    // Auth screens
    welcomeTitle: "keepItFit",
    welcomeSubtitle: "Your personal fitness companion",
    welcomeDescription: "Track your activities, get personalized meal plans, and achieve your fitness goals.",
    getStarted: "Get Started",
    logIn: "Log In",
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    email: "Email",
    password: "Password",
    username: "Username",
    login: "Login",
    loggingIn: "Logging in...",
    dontHaveAccount: "Don't have an account? Sign up",
    alreadyHaveAccount: "Already have an account? Log in",
    
    // Profile fields
    accountInfo: "Account Information",
    personalInfo: "Personal Information",
    fitnessGoals: "Fitness Goals",
    age: "Age",
    weight: "Weight (kg)",
    height: "Height (cm)",
    goal: "Goal",
    goalLose: "Lose Weight",
    goalMaintain: "Maintain",
    goalGain: "Gain Muscle",
    dietPreference: "Diet Preference",
    dietBalanced: "Balanced",
    dietVegan: "Vegan",
    dietKeto: "Keto",
    activityLevel: "Activity Level",
    activitySedentary: "Sedentary",
    activityModerate: "Moderate",
    activityVeryActive: "Very Active",
    
    // Navigation
    home: "Home",
    myPlan: "My Plan",
    activity: "Activity",
    insights: "Insights",
    profile: "Profile",
    
    // Home screen
    welcomeUser: "Welcome",
    wellnessScore: "Wellness Score",
    recentActivities: "Recent Activities",
    noActivities: "No recent activities",
    
    // Plan screen
    mealPlan: "Meal Plan",
    workoutPlan: "Workout Plan",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    generatePlan: "Generate Plan",
    generatingPlan: "Generating Plan...",
    
    // Activity screen
    mealAnalyzer: "Meal Analyzer",
    recipeGenerator: "Recipe Generator",
    uploadImage: "Upload Image",
    analyzing: "Analyzing...",
    enterIngredients: "Enter available ingredients (e.g., chicken, rice, tomatoes)",
    generateRecipe: "Generate Healthy Recipe",
    generatingRecipe: "Generating...",
    
    // Profile screen
    editProfile: "Edit",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    signOut: "Sign Out",
    changePhoto: "Change Photo",
    addPhoto: "Add Photo",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    refresh: "Pull to refresh",
    
    // Language
    language: "Language",
    english: "English",
    arabic: "العربية",
  },
  ar: {
    // Auth screens
    welcomeTitle: "keepItFit",
    welcomeSubtitle: "رفيقك الشخصي للياقة البدنية",
    welcomeDescription: "تتبع أنشطتك، احصل على خطط وجبات مخصصة، وحقق أهداف اللياقة البدنية.",
    getStarted: "ابدأ الآن",
    logIn: "تسجيل الدخول",
    welcomeBack: "مرحباً بعودتك",
    createAccount: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    username: "اسم المستخدم",
    login: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    dontHaveAccount: "ليس لديك حساب؟ سجل الآن",
    alreadyHaveAccount: "لديك حساب بالفعل؟ سجل الدخول",
    
    // Profile fields
    accountInfo: "معلومات الحساب",
    personalInfo: "المعلومات الشخصية",
    fitnessGoals: "أهداف اللياقة البدنية",
    age: "العمر",
    weight: "الوزن (كجم)",
    height: "الطول (سم)",
    goal: "الهدف",
    goalLose: "فقدان الوزن",
    goalMaintain: "الحفاظ",
    goalGain: "زيادة العضلات",
    dietPreference: "تفضيل النظام الغذائي",
    dietBalanced: "متوازن",
    dietVegan: "نباتي",
    dietKeto: "كيتو",
    activityLevel: "مستوى النشاط",
    activitySedentary: "قليل الحركة",
    activityModerate: "معتدل",
    activityVeryActive: "نشط جداً",
    
    // Navigation
    home: "الرئيسية",
    myPlan: "خطتي",
    activity: "النشاط",
    insights: "الرؤى",
    profile: "الملف الشخصي",
    
    // Home screen
    welcomeUser: "مرحباً",
    wellnessScore: "درجة الصحة",
    recentActivities: "الأنشطة الأخيرة",
    noActivities: "لا توجد أنشطة حديثة",
    
    // Plan screen
    mealPlan: "خطة الوجبات",
    workoutPlan: "خطة التمارين",
    breakfast: "الإفطار",
    lunch: "الغداء",
    dinner: "العشاء",
    generatePlan: "إنشاء خطة",
    generatingPlan: "جاري إنشاء الخطة...",
    
    // Activity screen
    mealAnalyzer: "محلل الوجبات",
    recipeGenerator: "مولد الوصفات",
    uploadImage: "رفع صورة",
    analyzing: "جاري التحليل...",
    enterIngredients: "أدخل المكونات المتاحة (مثل: دجاج، أرز، طماطم)",
    generateRecipe: "إنشاء وصفة صحية",
    generatingRecipe: "جاري الإنشاء...",
    
    // Profile screen
    editProfile: "تعديل",
    save: "حفظ",
    saving: "جاري الحفظ...",
    cancel: "إلغاء",
    signOut: "تسجيل الخروج",
    changePhoto: "تغيير الصورة",
    addPhoto: "إضافة صورة",
    
    // Common
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    refresh: "اسحب للتحديث",
    
    // Language
    language: "اللغة",
    english: "English",
    arabic: "العربية",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
