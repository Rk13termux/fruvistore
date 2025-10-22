# 🔧 Configuración de Subdominio para Admin

## Opción 2A: Subdominio con GitHub Pages (Recomendado)

### 1. Crear repositorio separado para admin:
```bash
# Crear nuevo repo: admin-fruvi-store
# Subir solo los archivos del admin:
- admin.html
- scripts/
- styles/
- images/ (si las necesita el admin)
```

### 2. Configurar GitHub Pages en el nuevo repo:
- Settings → Pages
- Custom domain: `admin.fruvi.store`

### 3. Configurar DNS en tu proveedor de dominio:
```
Tipo: CNAME
Nombre: admin
Valor: rk13termux.github.io
TTL: 300
```

### 4. Crear CNAME file en el repo admin:
```
admin.fruvi.store
```

## Opción 2B: Subdominio con redirección

### En tu DNS provider:
```
Tipo: CNAME  
Nombre: admin
Valor: fruvi.store
TTL: 300
```

### En tu servidor web (si usas uno):
```nginx
# Nginx
server {
    server_name admin.fruvi.store;
    location / {
        try_files $uri $uri/ /admin.html;
    }
}
```

## Opción 2C: Usando Vercel/Netlify (Más fácil)

### 1. Deploy en Vercel:
```bash
npx vercel --prod
# Configurar custom domain: admin.fruvi.store
```

### 2. O usar Netlify:
- Arrastra tu carpeta a netlify.app
- Settings → Domain management → Custom domain
- Agregar: admin.fruvi.store