-- Clean existing data to avoid duplicates/conflicts during development
TRUNCATE TABLE concepts, packages, testimonials, site_content RESTART IDENTITY;

-- 1. Insert Concepts (Photo Themes)
INSERT INTO concepts (title, description, image)
VALUES
(
  '{
    "en": "Flying Dress", 
    "tr": "Uçan Elbise", 
    "ru": "Летящее Платье", 
    "ar": "الفستان الطائر",
    "es": "Vestido Volador"
  }',
  '{
    "en": "A magical photoshoot with our signature long-tail dresses.", 
    "tr": "İmza niteliğindeki uzun kuyruklu elbiselerimizle büyülü bir çekim.",
    "ru": "Волшебная фотосессия с нашими фирменными платьями с длинным шлейфом.",
    "ar": "جلسة تصوير ساحرة مع فساتيننا المميزة ذات الذيل الطويل.",
    "es": "Una sesión de fotos mágica con nuestros vestidos de cola larga."
  }',
  '/images/concepts/flying-dress.jpg'
),
(
  '{
    "en": "Rooftop Classic", 
    "tr": "Teras Klasik",
    "ru": "Классика на Крыше",
    "ar": "كلاسيكيات السطح",
    "es": "Clásico en la Azotea"
  }',
  '{
    "en": "Traditional Turkish carpet settings with Bosphorus view.", 
    "tr": "Boğaz manzaralı geleneksel Türk halısı dekorları.",
    "ru": "Традиционные турецкие ковры с видом на Босфор.",
    "ar": "إعدادات السجاد التركي التقليدي مع إطلالة على البوسفور.",
    "es": "Escenarios tradicionales de alfombras turcas con vistas al Bósforo."
  }',
  '/images/concepts/rooftop-classic.jpg'
);

-- 2. Insert Packages
INSERT INTO packages (name, price, currency, category, features, is_featured)
VALUES
(
  '{
    "en": "Silver Package", 
    "tr": "Gümüş Paket",
    "ru": "Серебряный Пакет",
    "ar": "الباقة الفضية",
    "es": "Paquete Plata"
  }',
  149,
  'EUR',
  'outdoor',
  '{
    "en": ["1 Hour Session", "10 Edited Photos", "All Original Files", "1 Dress Included"],
    "tr": ["1 Saat Çekim", "10 Düzenlenmiş Fotoğraf", "Tüm Orijinal Dosyalar", "1 Elbise Dahil"],
    "ru": ["1 Час Съемки", "10 Обработанных Фото", "Все Оригиналы", "1 Платье Включено"],
    "ar": ["جلسة لمدة ساعة", "10 صور معدلة", "جميع الملفات الأصلية", "فستان واحد مشمول"],
    "es": ["1 Hora de Sesión", "10 Fotos Editadas", "Todos los Archivos Originales", "1 Vestido Incluido"]
  }',
  FALSE
),
(
  '{
    "en": "Gold Package", 
    "tr": "Altın Paket",
    "ru": "Золотой Пакет",
    "ar": "الباقة الذهبية",
    "es": "Paquete Oro"
  }',
  249,
  'EUR',
  'outdoor',
  '{
    "en": ["2 Hour Session", "25 Edited Photos", "All Original Files", "2 Dresses Included", "Video Reel"],
    "tr": ["2 Saat Çekim", "25 Düzenlenmiş Fotoğraf", "Tüm Orijinal Dosyalar", "2 Elbise Dahil", "Video Reel"],
    "ru": ["2 Часа Съемки", "25 Обработанных Фото", "Все Оригиналы", "2 Платья Включено", "Видео Рилс"],
    "ar": ["جلسة لمدة ساعتين", "25 صورة معدلة", "جميع الملفات الأصلية", "فستانان مشمولان", "فيديو ريل"],
    "es": ["2 Horas de Sesión", "25 Fotos Editadas", "Todos los Archivos Originales", "2 Vestidos Incluidos", "Video Reel"]
  }',
  TRUE
);

-- 3. Insert Testimonials
INSERT INTO testimonials (client_name, location, quote, rating)
VALUES
(
  'Sarah Jenkins',
  '{
    "en": "London, UK", 
    "tr": "Londra, İngiltere",
    "ru": "Лондон, Великобритания",
    "ar": "لندن، المملكة المتحدة",
    "es": "Londres, Reino Unido"
  }',
  '{
    "en": "The best experience in Istanbul! The photos turned out amazing.", 
    "tr": "İstanbul''daki en iyi deneyimdi! Fotoğraflar harika çıktı.",
    "ru": "Лучший опыт в Стамбуле! Фотографии получились потрясающие.",
    "ar": "أفضل تجربة في إسطنبول! الصور كانت مذهلة.",
    "es": "¡La mejor experiencia en Estambul! Las fotos quedaron increíbles."
  }',
  5
),
(
  'Elena Popov',
  '{
    "en": "Moscow, Russia",
    "tr": "Moskova, Rusya",
    "ru": "Москва, Россия",
    "ar": "موسكو، روسيا",
    "es": "Moscú, Rusia"
  }',
  '{
    "en": "Professional team and great atmosphere. Highly recommended!",
    "tr": "Profesyonel ekip ve harika atmosfer. Kesinlikle tavsiye ederim!",
    "ru": "Профессиональная команда и отличная атмосфера. Очень рекомендую!",
    "ar": "فريق محترف وأجواء رائعة. ينصح به بشدة!",
    "es": "Equipo profesional y gran ambiente. ¡Muy recomendable!"
  }',
  5
);

-- 4. Insert Site Content (Hero Section & Why Us)
INSERT INTO site_content (key, content)
VALUES
(
  'hero_section',
  '{
    "heading": {
        "en": "Istanbul, Your Memory", 
        "tr": "İstanbul, Senin Anın",
        "ru": "Стамбул, Твоя Память",
        "ar": "إسطنبول، ذكراك",
        "es": "Estambul, Tu Recuerdo"
    },
    "subheading": {
        "en": "Immortalize your beauty with the breathtaking backdrop of the production.", 
        "tr": "Güzelliğinizi bu prodüksiyonun nefes kesici fonuyla ölümsüzleştirin.",
        "ru": "Обессмертьте свою красоту на захватывающем фоне нашей студии.",
        "ar": "خلّد جمالك مع الخلفية المذهلة للإنتاج.",
        "es": "Inmortaliza tu belleza con el impresionante telón de fondo de la producción."
    },
    "image_url": "https://images.unsplash.com/photo-1622548943322-a7d57f6e0886?q=80&w=2670&auto=format&fit=crop"
  }'::jsonb
),
(
  'why_choose_us',
  '{
    "heading": {
        "en": "Why Choose Rooftop Istanbul?", 
        "tr": "Neden Rooftop Istanbul?",
        "ru": "Почему Rooftop Istanbul?",
        "ar": "لماذا تختار روف توب إسطنبول؟",
        "es": "¿Por qué elegir Rooftop Istanbul?"
    },
    "image_url": "https://images.unsplash.com/photo-1527838832700-50592524d785?q=80&w=2898&auto=format&fit=crop",
    "reasons": [
      {
        "title": {
            "en": "Prime Location", 
            "tr": "Harika Konum",
            "ru": "Лучшее Расположение",
            "ar": "موقع متميز",
            "es": "Ubicación Privilegiada"
        },
        "description": {
            "en": "Situated in the heart of Sultanahmet with direct views of Hagia Sophia.", 
            "tr": "Sultanahmet''in kalbinde, Ayasofya manzaralı.",
            "ru": "Расположен в сердце Султанахмет с прямым видом на Айя-Софию.",
            "ar": "يقع في قلب السلطان أحمد مع إطلالات مباشرة على آيا صوفيا.",
            "es": "Situado en el corazón de Sultanahmet con vistas directas a Santa Sofía."
        }
      },
      {
        "title": {
            "en": "Professional Team", 
            "tr": "Profesyonel Ekip",
            "ru": "Профессиональная Команда",
            "ar": "فريق محترف",
            "es": "Equipo Profesional"
        },
        "description": {
            "en": "Expert photographers and assistants dedicated to your perfect shot.", 
            "tr": "Mükemmel kareniz için uzman fotoğrafçılar ve asistanlar.",
            "ru": "Экспертные фотографы и ассистенты для вашего идеального снимка.",
            "ar": "مصورون ومساعدون خبراء مكرسون للحصول على لقطتك المثالية.",
            "es": "Fotógrafos expertos y asistentes dedicados a tu toma perfecta."
        }
      }
    ]
  }'::jsonb
);
