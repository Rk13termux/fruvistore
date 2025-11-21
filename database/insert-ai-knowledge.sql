-- =============================================
-- SEED DATA - Insertar Conocimiento Inicial Dr. Prima AI
-- Ejecutar DESPUÉS de setup-ai-knowledge.sql
-- =============================================

-- ===== INSERTAR COMPANY_KNOWLEDGE =====

INSERT INTO public.company_knowledge (category, content) VALUES
('quienes_somos', 'Fruvi es la marca premium de frutas exóticas y tropicales #1 en Colombia. Fundada en 2022 en Medellín, nos especializamos en seleccionar las mejores frutas colombianas de pequeños productores locales en zonas como el Eje Cafetero, Valle del Cauca, y la región Andina. Nuestro compromiso es triple: calidad suprema verificada por expertos agrícolas, sostenibilidad con certificación orgánica, y frescura garantizada con entrega en menos de 24 horas desde la cosecha. Trabajamos directamente con más de 150 familias campesinas certificadas, eliminando intermediarios y asegurando precios justos. Cada fruta pasa por un riguroso proceso de selección manual donde solo el 30% superior en calibre, dulzura y apariencia llega a nuestros clientes.'),

('principios', 'PRINCIPIOS FRUVI: 1) TRANSPARENCIA TOTAL - Conoce el origen exacto de cada fruta, la finca productora y la fecha de cosecha. 2) CALIDAD SIN CONCESIONES - Solo frutas que cumplan nuestro estándar premium A+ en Brix, firmeza y aroma. 3) SOSTENIBILIDAD REAL - 100% de nuestros productores usan técnicas agroecológicas certificadas, cero pesticidas sintéticos. 4) IMPACTO SOCIAL - El 15% de nuestras ganancias va directo a becas educativas para hijos de campesinos productores. 5) INNOVACIÓN CONSTANTE - Pioneros en cajas temáticas, suscripciones personalizadas con IA, y educación nutricional premium. 6) EXPERIENCIA PREMIUM - Empaques biodegradables de diseño minimalista, tarjetas con recetas exclusivas, y atención personalizada 24/7.'),

('contacto', 'CONTACTO FRUVI PREMIUM: WhatsApp VIP: +57 300 123 4567 (respuesta en menos de 5 minutos, 7am-10pm). Email premium: hola@fruvi.co (respuesta garantizada en 2 horas hábiles). Oficinas: Carrera 43A #1-50, Medellín, Colombia (showroom con degustaciones gratuitas, cita previa). Redes sociales: @fruvi.co (Instagram/TikTok/Facebook) con contenido diario de recetas, tips de conservación y livestreams con nutricionistas. Horario de atención: Lunes a Sábado 7:00am - 8:00pm, Domingos 9:00am - 6:00pm. Zonas de entrega: Medellín, Bogotá, Cali, Barranquilla, Cartagena (24-48h). Envíos nacionales express disponibles.'),

('faq', 'PREGUNTAS FRECUENTES FRUVI: ¿Cómo garantizan la frescura? Cosechamos bajo pedido. Tu fruta se corta máximo 24 horas antes de llegar a tu puerta. ¿Son realmente orgánicas? Sí, certificación orgánica USDA y EU para el 85% del catálogo, el resto es agroecológico verificado. ¿Qué pasa si llega dañada? Reemplazo inmediato gratis o reembolso 100% sin preguntas. ¿Puedo personalizar mi caja? Totalmente. En suscripciones premium, el Dr. Prima AI crea tu caja según objetivos nutricionales. ¿Hacen envíos internacionales? Actualmente solo Colombia, pero trabajamos en expansión a Panamá y Ecuador para Q2 2025. ¿Cuál es el pedido mínimo? $50.000 COP, envío gratis desde $100.000 COP. ¿Cómo conservar las frutas? Cada pedido incluye tarjeta premium con temperatura óptima, tiempo de maduración y tips de almacenamiento por variedad.'),

('estructura_web', 'ESTRUCTURA FRUVI.CO: HOME (/) - Hero con foto gigante de caja premium, CTA ''Hablar con Dr. Prima'', sección de cajas destacadas, testimonios, beneficios de membresía Dr. Prima, footer. TIENDA (/tienda) - Catálogo completo de frutas individuales con filtros por origen, Brix, precio, certificación orgánica. FRUVIBOX (/cajas) - Cajas temáticas premium: Detox, Energía, Antioxidante, Tropical, Infantil. CHAT DR. PRIMA - Modal o fullscreen, gestión de créditos, upsell elegante a suscripción premium. PERFIL (/perfil) - Historial de pedidos, métodos de pago, suscripción activa, créditos Dr. Prima. SUSCRIPCIÓN (/dr) - Página de venta de membresía Dr. Prima con planes mensual/anual, beneficios premium, testimonios de clientes VIP.'),

('politicas', 'POLÍTICAS FRUVI PREMIUM: DEVOLUCIONES - 100% satisfacción garantizada. Si no estás feliz, devolvemos tu dinero sin preguntas en 48h. PRIVACIDAD - Tus datos son sagrados. Nunca vendemos información a terceros. Cifrado AES-256 en toda la plataforma. SUSCRIPCIONES - Cancela cuando quieras sin penalización. Pausas de hasta 4 semanas sin costo. ALERGIAS - Declaramos todos los alérgenos. Producción en instalaciones que procesan frutos secos, látex. GARANTÍA DE FRESCURA - Si tu fruta no cumple estándar premium, reemplazo gratis + 20% descuento en próxima compra. PAGOS - Aceptamos todas las tarjetas, PSE, Nequi, Daviplata, efectivo contra entrega. ENVÍOS - Rastreo en tiempo real, notificaciones por WhatsApp en cada etapa, ventana de entrega de 2 horas.');

-- ===== INSERTAR AI_KNOWLEDGE_BASE =====

INSERT INTO public.ai_knowledge_base (topic, content, priority, tags) VALUES

('Mangostino - La Reina de las Frutas Tropicales', 
'El mangostino (Garcinia mangostana) es considerado la ''Reina de las Frutas'' por su sabor exquisito que combina dulzor intenso con acidez refrescante. En Fruvi, traemos mangostinos premium del Eje Cafetero (Quindío), cosechados en punto óptimo de madurez (cáscara púrpura oscuro, ligeramente firme). Beneficios: altísimo en xantonas (antioxidantes 20x más potentes que vitamina C), antiinflamatorio natural, mejora digestión, refuerza inmunidad. Precio: $8.900/unidad. Cómo consumir: presiona suavemente la cáscara hasta que se abra, extrae los gajos blancos (evita la cáscara amarga). Ideal para: postres gourmet, batidos tropicales, ensaladas de frutas premium. Temporada alta: abril-agosto. Conservación: temperatura ambiente 2-3 días, refrigerado hasta 7 días.',
9, ARRAY['mangostino', 'premium', 'antioxidante', 'tropical', 'eje_cafetero']),

('Aguacate Hass Premium - El Oro Verde Colombiano',
'Nuestro aguacate Hass proviene de fincas certificadas en Caldas y Antioquia, con altitud ideal de 1800-2200 msnm que garantiza textura cremosa y sabor mantecoso incomparable. Cada aguacate pasa por test de madurez con penetrómetro (firmeza exacta) antes del envío. Beneficios nutricionales: grasas monoinsaturadas (reduce colesterol malo), vitamina E, potasio (más que un plátano), fibra soluble. Precio: $4.500/unidad (250-280g). Tip Fruvi: pide ''punto de sazón'' y te enviamos aguacates listos para consumir en 1-2 días, o ''verdes'' si prefieres madurarlos en casa. Receta exclusiva: Tostada Fruvi Premium - aguacate + limón mandarino + sal rosada del Himalaya + aceite de oliva + pimienta negra recién molida. Ideal para: desayunos energéticos, ensaladas, guacamole gourmet, batidos verdes. Conservación: maduración acelerada envuelto en papel periódico con manzana.',
10, ARRAY['aguacate', 'hass', 'premium', 'colombia', 'grasas_saludables']),

('Gulupa Colombiana - Superfruta Andina',
'La gulupa (Passiflora edulis) es una joya de los Andes colombianos, cultivada entre 1800-2600 msnm en Boyacá y Cundinamarca. Fruvi selecciona solo gulupas con Brix mínimo de 14° (extra dulces) y aroma intenso. Beneficios: rica en vitamina C (30mg/100g), vitamina A, hierro vegetal, triptófano natural (mejora sueño y estado de ánimo). Precio: $6.200/500g. Sabor: dulce-ácido balanceado, intenso, refrescante. Cómo consumir: corta por la mitad, come la pulpa con semillas (100% comestibles y beneficiosas). Usos: jugos naturales, salsas para postres, mousse, cocteles premium, glaseados para carnes. Dato Fruvi: la gulupa es prima de la maracuyá pero más dulce y aromática. Temporada: todo el año con picos en junio-agosto. Conservación: refrigerada hasta 15 días, congela la pulpa hasta 6 meses sin perder propiedades.',
8, ARRAY['gulupa', 'maracuya', 'andina', 'vitamina_c', 'boyaca']),

('Lulo de Castilla - Sabor Único Colombiano',
'El lulo (Solanum quitoense) es un tesoro colombiano imposible de encontrar fuera de Latinoamérica. Nuestros lulos provienen de cultivos agroecológicos en clima frío moderado (1200-2000 msnm) en Santander y Tolima. Sabor: ácido intenso con notas cítricas, refrescante, único. Beneficios: vitamina C, vitamina A, fósforo, hierro, bajo en calorías (27 kcal/100g), digestivo natural. Precio: $5.800/500g. Uso estrella: jugo de lulo natural (licúa con agua, azúcar morena orgánica y hielo). Recetas Fruvi: lulada (bebida tradicional), sorbete de lulo, salsa agridulce para pescados, mermelada artesanal. Tip de conservación: el lulo maduro tiene cáscara amarilla-naranja con pelusa suave, si está muy verde déjalo madurar a temperatura ambiente 3-5 días. Temporada: todo el año. Ideal para: deportistas (rehidratación natural), dietas detox, amantes de sabores intensos.',
7, ARRAY['lulo', 'colombia', 'acido', 'vitamina_c', 'tradicional']),

('Pitahaya Amarilla Premium - Dragón Dorado',
'La pitahaya amarilla (Selenicereus megalanthus) de Fruvi viene de cultivos especializados en Valle del Cauca, reconocida internacionalmente como la más dulce del mundo (Brix 18-22°). Beneficios: prebiótico natural (semillas con fibra soluble), vitamina C, hierro, calcio, bajo índice glucémico (apta para diabéticos con moderación). Precio: $12.500/unidad (350-400g). Sabor: dulce intenso, tropical, sin acidez. Cómo consumir: corta por la mitad, come la pulpa blanca con semillas negras (crujientes y nutritivas). Usos Fruvi: smoothie bowls, ensaladas de frutas gourmet, cocteles premium, decoración de platos. Dato: la pitahaya amarilla es más difícil de cultivar que la roja pero 3 veces más dulce. Beneficio estrella: mejora tránsito intestinal suavemente, ideal para digestiones sensibles. Conservación: temperatura ambiente hasta madurez completa (cáscara amarilla brillante), luego refrigerar hasta 5 días.',
9, ARRAY['pitahaya', 'amarilla', 'premium', 'valle', 'dulce', 'prebiotico']),

('Feijoa Colombiana - Esmeralda Andina',
'La feijoa (Acca sellowiana) es originaria de los Andes colombianos. Fruvi la trae de cultivos en Boyacá y Cundinamarca (2000-2800 msnm). Sabor: único, mezcla de piña, fresa, guayaba y menta. Beneficios: vitamina C, yodo natural (único en frutas), fibra, antioxidantes, bajo en azúcar (55 kcal/100g). Precio: $7.500/500g. Cómo consumir: corta por la mitad, come la pulpa con cuchara (evita la cáscara). Usos: jugos, mermeladas gourmet, postres, licores artesanales, salsas para carnes. Temporada: marzo-junio (temporada corta y muy esperada). Dato Fruvi: la feijoa tiene propiedades antibacterianas naturales y es excelente para la tiroides por su contenido de yodo. Conservación: refrigerada hasta 10 días. Ideal para: dietas bajas en azúcar, personas con hipotiroidismo (consultar médico), amantes de sabores exóticos.',
8, ARRAY['feijoa', 'andina', 'yodo', 'unica', 'boyaca', 'temporada']),

('Granadilla Colombiana - Dulzura Natural',
'La granadilla (Passiflora ligularis) de Fruvi proviene de Huila y Cundinamarca (1500-2300 msnm). Es la pasionaria más dulce de todas, ideal para niños y personas que no toleran acidez. Beneficios: vitamina C, vitamina A, hierro, fósforo, calcio, fibra, triptófano (relajante natural). Precio: $5.500/500g. Sabor: muy dulce, suave, sin acidez, refrescante. Cómo consumir: rompe la cáscara dura, come la pulpa gelatinosa con semillas. Usos: jugos naturales, postres, batidos, yogurt natural, ensaladas de frutas. Dato Fruvi: la granadilla es perfecta para dormir mejor (consumir 1-2 horas antes de acostarse). También excelente para recuperación post-ejercicio. Conservación: temperatura ambiente hasta que la cáscara se ponga amarilla-naranja brillante, luego refrigerar hasta 10 días. Ideal para: niños, adultos mayores, personas con insomnio, deportistas.',
7, ARRAY['granadilla', 'dulce', 'pasionaria', 'huila', 'triptofano', 'infantil']),

('Beneficios Suscripción Dr. Prima Premium',
'MEMBRESÍA DR. PRIMA PREMIUM - Tu nutricionista personal con IA especializada. Beneficios exclusivos: 1) CONSULTAS ILIMITADAS - Chat sin límite de mensajes con el Dr. Prima, análisis nutricionales profundos, planes alimenticios personalizados. 2) DESCUENTOS PERMANENTES - 15% en todas tus compras de frutas, cajas y suscripciones. 3) ENVÍO GRATIS - En todos tus pedidos sin mínimo de compra. 4) CAJAS PERSONALIZADAS - El Dr. Prima crea tu FruviBox mensual según tus objetivos (pérdida de peso, energía, sistema inmune, piel radiante, etc.). 5) PRIORIDAD VIP - Atención preferente, acceso anticipado a frutas de temporada, invitaciones a eventos exclusivos. 6) RECETAS PREMIUM - 50+ recetas gourmet mensuales exclusivas para miembros. 7) SEGUIMIENTO NUTRICIONAL - El Dr. Prima monitorea tu progreso y ajusta recomendaciones. Precio: $89.900/mes o $899.000/año (ahorra 17%). Garantía: cancela cuando quieras, primer mes con devolución 100% si no estás satisfecho.',
10, ARRAY['suscripcion', 'dr_prima', 'premium', 'beneficios', 'vip', 'descuentos']),

('FruviBox Detox Premium',
'FRUVIBOX DETOX PREMIUM - Diseñada por nutricionistas para depuración profunda. Contenido: 2 piñas golden (bromelina, enzimas digestivas), 1kg limones tahití orgánicos (vitamina C, alcalinizante), 500g jengibre fresco (antiinflamatorio), 6 manzanas verdes (pectina, fibra), 500g arándanos azules (antioxidantes), 4 pepinos cohombro (hidratación, diurético), 1 manojo cilantro orgánico (quelante metales pesados), 500g espinaca baby (clorofila, hierro). Precio: $124.900 (envío gratis). Beneficios: elimina toxinas, mejora digestión, piel radiante, aumenta energía, reduce inflamación, refuerza hígado y riñones. Incluye: guía detox de 7 días, recetas de jugos verdes, batidos detox, agua saborizada. Ideal para: post-fiestas, cambio de estación, reseteo mensual, antes de eventos importantes. Temporada: todo el año. Garantía Fruvi: si no sientes diferencia en 7 días, devolvemos tu dinero.',
9, ARRAY['fruvibox', 'detox', 'depuracion', 'salud', 'caja', 'premium']),

('Proceso de Selección Premium Fruvi',
'CÓMO GARANTIZAMOS CALIDAD FRUVI: PASO 1 - Selección de fincas: Solo trabajamos con productores certificados, auditorías trimestrales, análisis de suelo y agua. PASO 2 - Cosecha óptima: Cada fruta se cosecha en el momento exacto de madurez según indicadores científicos (Brix, firmeza, color, aroma). PASO 3 - Clasificación manual: Expertos agrícolas revisan una por una, descartando 70% que no cumple estándar A+. PASO 4 - Test de calidad: Medición de Brix (dulzor), penetrómetro (firmeza), inspección visual (sin manchas, golpes, defectos). PASO 5 - Empaque premium: Cajas biodegradables con separadores, papel de seda, tarjeta de origen con foto del productor. PASO 6 - Logística fría: Transporte refrigerado, entrega máximo 24h post-cosecha. PASO 7 - Garantía: Si no estás 100% satisfecho, reemplazo gratis o reembolso completo. Resultado: Las frutas más frescas, dulces y nutritivas de Colombia en tu mesa.',
8, ARRAY['calidad', 'proceso', 'seleccion', 'premium', 'garantia', 'frescura']);

-- ===== INSERTAR AI_FORBIDDEN_RESPONSES =====

INSERT INTO public.ai_forbidden_responses (forbidden_phrase, reason, severity) VALUES

('Lo siento, no puedo ayudarte con eso', 
'Degrada la imagen de experto premium. Siempre hay una alternativa que ofrecer.', 
'high'),

('No tengo esa información', 
'El Dr. Prima debe ser omnisciente en frutas. Redirigir creativamente si falta data.', 
'high'),

('Eso no está relacionado con frutas', 
'Rompe el flujo conversacional. Mejor redirigir sutilmente hacia frutas.', 
'medium'),

('Consulta con tu médico', 
'Demasiado genérico. Mejor: ''Recomiendo validar con tu médico de confianza, mientras tanto estas frutas...''', 
'medium'),

('productos de baja calidad', 
'Fruvi solo vende premium. Nunca mencionar calidad baja ni siquiera de competencia.', 
'high'),

('barato', 
'La marca es premium. Usar: ''excelente relación valor-calidad'', ''inversión en salud''.', 
'medium'),

('normal', 
'Todo en Fruvi es excepcional. Usar: ''estándar premium'', ''calidad superior''.', 
'low'),

('puede que', 
'Inseguridad. El Dr. Prima es confiado y preciso. Usar: ''es probable'', ''generalmente''.', 
'low'),

('no sé', 
'Destruye credibilidad. Redirigir: ''Déjame investigar eso para darte la mejor respuesta''.', 
'high'),

('tal vez', 
'Muy vago para un experto. Usar: ''es recomendable'', ''sugiero'', ''lo ideal es''.', 
'low');

-- =============================================
-- ✅ DATOS INICIALES INSERTADOS EXITOSAMENTE
-- =============================================
-- 
-- VERIFICAR INSERCIÓN:
-- SELECT category, LENGTH(content) as content_length FROM company_knowledge;
-- SELECT topic, priority, tags FROM ai_knowledge_base ORDER BY priority DESC;
-- SELECT forbidden_phrase, severity FROM ai_forbidden_responses ORDER BY severity DESC;
-- =============================================
