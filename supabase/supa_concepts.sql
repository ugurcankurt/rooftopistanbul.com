-- Supabase SQL to populate 'concepts' table
-- Run this in your Supabase SQL Editor

-- 1. Ensure slug column exists (if not already added)
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS slug text;
-- Add a unique constraint if it doesn't already exist (safe way)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'concepts_slug_key') THEN
        ALTER TABLE concepts ADD CONSTRAINT concepts_slug_key UNIQUE (slug);
    END IF;
END $$;

-- 2. Insert or Update Concepts
-- Note: 'image' fields are placeholders. Please update with actual URLs from your Supabase Storage.

-- Rooftop View
INSERT INTO concepts (slug, title, description, image)
VALUES (
  'rooftop-view',
  '{
    "en": "Rooftop View",
    "tr": "Teras Manzarası",
    "ru": "Вид на крышу",
    "ar": "منظر السطح",
    "es": "Vista desde la azotea"
  }',
  '{
    "en": "Capture unique photo moments with the stunning views of Istanbul''s historic Süleymaniye district from one of the city''s rooftops. Use Istanbul''s iconic skyline as your backdrop and create unforgettable memories with this concept.",
    "tr": "İstanbul''un tarihi Süleymaniye semtinin büyüleyici manzarası eşliğinde şehrin çatılarından birinde eşsiz fotoğraf kareleri yakalayın. İstanbul''un ikonik silüetini arka planınız olarak kullanın ve bu konseptle unutulmaz anılar biriktirin.",
    "ru": "Запечатлейте уникальные моменты на фоне потрясающих видов исторического района Сулеймание в Стамбуле с одной из крыш города. Используйте культовый горизонт Стамбула в качестве фона и создайте незабываемые воспоминания с этой концепцией.",
    "ar": "التقط لحظات صور فريدة مع المناظر الخلابة لمنطقة السليمانية التاريخية في إسطنبول من أحد أسطح المدينة. استخدم أفق إسطنبول الشهير كخلفية لك واخلق ذكريات لا تُنسى مع هذا المفهوم.",
    "es": "Captura momentos fotográficos únicos con las impresionantes vistas del histórico distrito de Süleymaniye en Estambul desde una de las azoteas de la ciudad. Usa el icónico horizonte de Estambul como telón de fondo y crea recuerdos inolvidables con este concepto."
  }',
  'https://ccjpmyytmbpjeklkgnyr.supabase.co/storage/v1/object/public/concepts/rooftop.jpg'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Swing View (Description was missing in chat, used generic placeholder, please update)
INSERT INTO concepts (slug, title, description, image)
VALUES (
  'swing-view',
  '{
    "en": "Swing View",
    "tr": "Salıncak Konsepti",
    "ru": "Вид на качелях",
    "ar": "إطلالة الأرجوحة",
    "es": "Vista desde el columpio"
  }',
  '{
    "en": "Experience the thrill of swinging above the magnificent view of Istanbul. A perfect mix of fun and breathtaking scenery.",
    "tr": "İstanbul''un muhteşem manzarası üzerinde sallanmanın heyecanını yaşayın. Eğlence ve nefes kesici manzaranın mükemmel birleşimi.",
    "ru": "Испытайте острые ощущения, качаясь над великолепным видом Стамбула. Идеальное сочетание веселья и захватывающих пейзажей.",
    "ar": "استمتع بتجربة التأرجح فوق المنظر الرائع لإسطنبول. مزيج مثالي من المرح والمناظر الخلابة.",
    "es": "Experimenta la emoción de columpiarte sobre la magnífica vista de Estambul. Una mezcla perfecta de diversión y paisajes impresionantes."
  }',
  'https://ccjpmyytmbpjeklkgnyr.supabase.co/storage/v1/object/public/concepts/swing.jpg'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Mosaic Lamp View
INSERT INTO concepts (slug, title, description, image)
VALUES (
  'mosaic-lamp',
  '{
    "en": "Mosaic Lamp View",
    "tr": "Mozaik Lamba Konsepti",
    "ru": "Вид с мозаичными лампами",
    "ar": "إطلالة المصابيح الفسيفسائية",
    "es": "Vista de lámparas de mosaico"
  }',
  '{
    "en": "Adorned with colorful mosaic lamps, this concept reflects the mysterious and warm atmosphere of the East. Capture enchanting and artistic photos with the unique light play of mosaic lamps.",
    "tr": "Renkli mozaik lambalarla bezenmiş bu konsept, Doğunun gizemli ve sıcak atmosferini yansıtıyor. Mozaik lambaların eşsiz ışık oyunlarıyla büyüleyici ve sanatsal fotoğraflar yakalayın.",
    "ru": "Украшенная разноцветными мозаичными лампами, эта концепция отражает таинственную и теплую атмосферу Востока. Сделайте чарующие и художественные фотографии с уникальной игрой света мозаичных ламп.",
    "ar": "مزينة بمصابيح الفسيفساء الملونة، يعكس هذا المفهوم الجو الغامض والدافئ للشرق. التقط صوراً ساحرة وفنية مع تلاعب الضوء الفريد لمصابيح الفسيفساء.",
    "es": "Adornado con coloridas lámparas de mosaico, este concepto refleja la atmósfera misteriosa y cálida de Oriente. Captura fotos encantadoras y artísticas con el juego de luz único de las lámparas de mosaico."
  }',
  'https://ccjpmyytmbpjeklkgnyr.supabase.co/storage/v1/object/public/concepts/lamps.jpg'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Cappadocia View
INSERT INTO concepts (slug, title, description, image)
VALUES (
  'cappadocia',
  '{
    "en": "Cappadocia View",
    "tr": "Kapadokya Konsepti",
    "ru": "Вид Каппадокии",
    "ar": "إطلالة كابادوكيا",
    "es": "Vista de Capadocia"
  }',
  '{
    "en": "Bring the magical atmosphere of Cappadocia to Istanbul with this concept, featuring colorful and patterned carpets. Pose on these exotic carpets and capture mystical and unique photos that reflect the rich cultural heritage of Cappadocia.",
    "tr": "Renkli ve desenli halılarla bezenmiş bu konsept ile Kapadokya''nın büyülü atmosferini İstanbul''a taşıyın. Bu egzotik halıların üzerinde poz verin ve Kapadokya''nın zengin kültürel mirasını yansıtan mistik ve eşsiz fotoğraflar yakalayın.",
    "ru": "Принесите волшебную атмосферу Каппадокии в Стамбул с этой концепцией, украшенной красочными и узорчатыми коврами. Позируйте на этих экзотических коврах и делайте мистические и уникальные фотографии, отражающие богатое культурное наследие Каппадокии.",
    "ar": "اجلب الأجواء الساحرة لكابادوكيا إلى إسطنبول مع هذا المفهوم الذي يتميز بالسجاد الملون والمنقوش. قف على هذا السجاد الغريب والتقط صوراً صوفية وفريدة تعكس التراث الثقافي الغني لكابادوكيا.",
    "es": "Trae la atmósfera mágica de Capadocia a Estambul con este concepto, que presenta alfombras coloridas y estampadas. Posa sobre estas alfombras exóticas y captura fotos místicas y únicas que reflejan la rica herencia cultural de Capadocia."
  }',
  'https://ccjpmyytmbpjeklkgnyr.supabase.co/storage/v1/object/public/concepts/cappadocia.jpg'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Sultan Taht View
INSERT INTO concepts (slug, title, description, image)
VALUES (
  'sultan-throne',
  '{
    "en": "Sultan Taht View",
    "tr": "Sultan Tahtı Konsepti",
    "ru": "Вид с троном Султана",
    "ar": "إطلالة عرش السلطان",
    "es": "Vista del Trono del Sultán"
  }',
  '{
    "en": "Our studio features a Hürrem Sultan-themed decor, offering guests a royal Ottoman experience with special costumes and unforgettable photos.",
    "tr": "Stüdyomuz, konuklarına özel kostümler ve unutulmaz fotoğraflar ile kraliyet Osmanlı deneyimi sunan Hürrem Sultan temalı bir dekora sahiptir.",
    "ru": "В нашей студии представлен декор в тематике Хюррем Султан, предлагающий гостям королевский османский опыт со специальными костюмами и незабываемыми фотографиями.",
    "ar": "يتميز الاستوديو الخاص بنا بديكور بطابع حريم السلطان، مما يوفر للضيوف تجربة عثمانية ملكية مع أزياء خاصة وصور لا تُنسى.",
    "es": "Nuestro estudio cuenta con una decoración temática de Hürrem Sultan, ofreciendo a los huéspedes una experiencia real otomana con trajes especiales y fotos inolvidables."
  }',
  'https://ccjpmyytmbpjeklkgnyr.supabase.co/storage/v1/object/public/concepts/sultan.jpg'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;
