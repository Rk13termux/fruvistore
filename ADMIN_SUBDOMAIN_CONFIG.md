# 🔧 CONFIGURACIÓN DE SUBDOMINIO OCULTO PARA ADMIN

## 🎯 **Estrategia implementada:**

### 📁 **Estructura de carpetas:**
```
/home/sebas/RK13/web/
├── index.html                    (Web principal)
├── sys-mgmt-v2024/              (Admin oculto)
│   ├── index.html               (Login admin - secure-access.html)
│   ├── panel.html               (Panel admin - admin-panel-secure.html)
│   ├── scripts/                 (Scripts necesarios)
│   └── styles/                  (Estilos necesarios)
```

## 🌐 **URLs resultantes:**

### 🔒 **Admin con carpeta oculta:**
```
https://fruvi.store/sys-mgmt-v2024/
https://fruvi.store/sys-mgmt-v2024/panel.html
```

### 🏷️ **Opción de subdominio (requiere configuración DNS):**
```
https://admin.fruvi.store/
```

## ⚙️ **Configuración DNS para subdominio (Opcional):**

### En tu proveedor de DNS:
```
Tipo: CNAME
Nombre: admin
Valor: rk13termux.github.io
TTL: 300
```

### Crear archivo CNAME en carpeta admin:
```
admin.fruvi.store
```

## 🔐 **Características de seguridad mantenidas:**

### ✅ **Mismo sistema de autenticación:**
- Usuario: `fruvi_admin_2024`
- Contraseña: `FruviStore@Secure#2024!`
- Bloqueo por 3 intentos fallidos
- Sesión de 30 minutos

### ✅ **Completamente oculto:**
- Nombre de carpeta no obvio: `sys-mgmt-v2024`
- Sin enlaces desde la web principal
- No indexable por buscadores
- URLs no predecibles

## 🚀 **URLs finales del admin:**

### 🎯 **Opción 1 - Carpeta oculta (Inmediato):**
```
Login:  https://fruvi.store/sys-mgmt-v2024/
Panel:  https://fruvi.store/sys-mgmt-v2024/panel.html
```

### 🎯 **Opción 2 - Subdominio (Requiere DNS):**
```
Login:  https://admin.fruvi.store/
Panel:  https://admin.fruvi.store/panel.html
```

## 📝 **Ventajas de cada opción:**

### ✅ **Carpeta oculta:**
- Funciona inmediatamente
- Mismo repositorio
- Completamente oculta
- URL no predecible

### ✅ **Subdominio:**
- URL más limpia
- Separación conceptual
- Fácil de recordar
- Más profesional