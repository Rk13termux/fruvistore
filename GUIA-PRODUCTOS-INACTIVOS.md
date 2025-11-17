# 🔧 Sistema de Productos Inactivos - Guía de Uso

## ✅ Mejoras Implementadas

### 1. **Buscador en Productos Inactivos**
- Campo de búsqueda en tiempo real
- Busca por nombre, categoría o motivo de inactivación
- Muestra resultados instantáneos mientras escribes

### 2. **Logging Mejorado**
- Console logs para debugging en navegador
- Muestra cantidad de productos activos/inactivos
- Lista los primeros 3 productos inactivos al cargar

### 3. **Scripts SQL Incluidos**
Creados 3 archivos SQL útiles:

#### 📄 `database/insert-aguacate-uvas.sql`
- Inserta Aguacate Hass y Uvas en la base de datos
- Los crea como INACTIVOS por defecto
- Incluye precios, stock y configuración completa

#### 📄 `database/check-inactive-products.sql`
- 6 queries de verificación
- Busca productos específicos (aguacate, uvas)
- Cuenta productos por estado
- Verifica la vista `current_products`

#### 📄 `database/manage-product-status.sql`
- Comandos para activar/desactivar productos
- Ejemplos listos para copiar y modificar
- Gestión individual o masiva

---

## 🚀 Cómo Solucionar el Problema

### **Paso 1: Verificar si los productos existen**

1. Abre **Supabase Dashboard** → SQL Editor
2. Copia y ejecuta este query:

```sql
SELECT 
    mp.id,
    mp.name,
    mp.is_active,
    mpp.price_per_kg,
    mpp.stock_kg
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id AND mpp.is_current = true
WHERE LOWER(mp.name) LIKE '%aguacate%' 
   OR LOWER(mp.name) LIKE '%uva%'
   OR LOWER(mp.name) LIKE '%agra%';
```

**Si NO aparecen productos:**
- Ejecuta el archivo `database/insert-aguacate-uvas.sql` completo
- Esto creará los productos con is_active = false

**Si SÍ aparecen productos:**
- Verifica el valor de `is_active`
- Si es `NULL` o `true`, cambia a `false` con el siguiente paso

---

### **Paso 2: Desactivar los productos (si es necesario)**

Si los productos existen pero están activos, ejecuta:

```sql
-- Desactivar Aguacate Hass
UPDATE management_products
SET is_active = false
WHERE name = 'Aguacate Hass';

-- Desactivar Uvas
UPDATE management_products
SET is_active = false
WHERE name = 'Uvas';
```

---

### **Paso 3: Verificar en el Admin Panel**

1. Abre el panel admin: https://fruvi.store/admin/admin-panel-secure.html
2. Ve a **Gestión de Tienda**
3. Haz clic en la pestaña **"Productos Inactivos"**
4. Abre la **consola del navegador** (F12)
5. Busca logs como este:

```
🔍 DEBUG - Productos cargados: {total: 45, activos: 43, inactivos: 2}
📋 Productos inactivos encontrados: [...]
```

6. Usa el **buscador** en la pestaña de inactivos:
   - Escribe "aguacate" o "uvas"
   - Debería aparecer instantáneamente

---

### **Paso 4: Reactivar productos desde el Admin**

Una vez que los productos aparezcan en la pestaña de inactivos:

1. Haz clic en el botón **"Reactivar"** (verde)
2. El producto se activará automáticamente
3. Aparecerá en la pestaña de **Productos Activos**

---

## 🐛 Debugging Adicional

### Ver logs en consola del navegador:

```javascript
// Ejecuta esto en la consola (F12)
console.table(storeManagement.products.filter(p => p.is_active === false));
```

Esto te mostrará todos los productos inactivos en formato tabla.

### Ver la vista current_products:

```sql
SELECT * FROM current_products
ORDER BY is_active, name;
```

Esto muestra exactamente lo que ve el admin panel.

---

## 📊 Características del Sistema

### ✅ Lo que ya funciona:
- ✅ Tabs de Activos/Inactivos
- ✅ Botón de Reactivar
- ✅ Botón de Desactivar (con motivo)
- ✅ Contadores en badges
- ✅ Búsqueda en tiempo real (NUEVO)
- ✅ Logging para debugging (NUEVO)

### 🎨 Estilos:
- Productos inactivos con opacidad reducida
- Badge de "Motivo" con ícono
- Mensaje cuando no hay productos inactivos
- Mensaje diferente cuando no hay resultados de búsqueda

---

## 🔑 Comandos Útiles

### Ver todos los productos y su estado:
```sql
SELECT 
    name,
    is_active,
    CASE 
        WHEN is_active = true THEN '✅ ACTIVO'
        ELSE '🔴 INACTIVO'
    END AS estado
FROM management_products
ORDER BY is_active DESC, name;
```

### Contar productos por estado:
```sql
SELECT 
    CASE 
        WHEN is_active = true THEN 'Activos'
        WHEN is_active = false THEN 'Inactivos'
    END AS estado,
    COUNT(*) AS cantidad
FROM management_products
GROUP BY is_active;
```

### Reactivar todos los productos inactivos:
```sql
UPDATE management_products
SET is_active = true
WHERE is_active = false;
```

---

## 📝 Notas Importantes

1. **Campo `available` vs `is_active`:**
   - Un producto es INACTIVO si `is_active = false` O `available = false`
   - El filtro usa: `p.available === false || p.is_active === false`

2. **Vista `current_products`:**
   - Une `management_products` + `management_product_prices`
   - Es la que usa el admin panel
   - Debe retornar TODOS los productos (activos e inactivos)

3. **Cache del navegador:**
   - Si no ves cambios, presiona Ctrl+Shift+R
   - O abre en modo incógnito

---

## 🎯 Resumen Rápido

**Si Aguacate Hass y Uvas no aparecen:**

1. Ejecuta `database/check-inactive-products.sql` (query 1)
2. Si no existen, ejecuta `database/insert-aguacate-uvas.sql`
3. Si existen pero están activos, ejecuta `database/manage-product-status.sql` (desactivar)
4. Recarga el admin panel (Ctrl+Shift+R)
5. Abre consola del navegador (F12) y verifica logs
6. Busca en el buscador de productos inactivos

**Cambios subidos a GitHub:** ✅ Commit y push realizados

---

¿Necesitas ayuda adicional? Revisa los logs en consola del navegador para ver exactamente qué productos se están cargando.
