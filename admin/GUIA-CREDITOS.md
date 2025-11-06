# 📋 Guía de Gestión de Créditos - FruviStore

## 🎯 Flujo Rápido para Agregar Créditos por WhatsApp

### Paso 1: Recibir el mensaje por WhatsApp
Cuando un cliente compre créditos, te enviará un mensaje con su **User ID**. Se ve así:
```
497e4ec0-a1c9-4ffb-af31-4244868d4c71
```

### Paso 2: Copiar el User ID
- Selecciona y copia el ID completo del mensaje de WhatsApp
- Asegúrate de copiar todo el ID (36 caracteres con guiones)

### Paso 3: Abrir el Panel de Administración
1. Ve a: `https://tu-dominio.com/admin/admin-panel-secure.html`
2. Inicia sesión con tus credenciales de admin
3. Click en "**Créditos**" en el menú lateral

### Paso 4: Usar la Función de Agregar Rápido
En la sección **"Agregar Créditos Rápido (por User ID)"**:

1. **Pega el User ID** en el primer campo
   - El sistema buscará automáticamente el usuario
   - Verás una confirmación verde si el usuario existe
   - Verás un mensaje rojo si el usuario no existe

2. **Ingresa la cantidad de créditos**
   - Ejemplo: `100` para 100 créditos
   - `500` para 500 créditos

3. **Escribe el motivo** (opcional pero recomendado)
   - Ejemplo: "Compra por WhatsApp"
   - "Pago recibido vía transferencia"
   - "Recarga PayPal"

4. **Click en "Agregar Créditos Ahora"**
   - Confirma la operación
   - Los créditos se agregarán instantáneamente

### Paso 5: Confirmar al Cliente
1. El sistema mostrará un mensaje de éxito
2. Podrás ver el nuevo saldo del usuario
3. Envía confirmación al cliente por WhatsApp

---

## 📊 Otras Funciones Disponibles

### Ver Todos los Usuarios
- Click en "**Todos los Usuarios**"
- Verás una tabla con todos los usuarios registrados
- Puedes copiar el User ID de cualquier usuario

### Buscar Usuario
- Usa el campo de búsqueda para filtrar por nombre o email
- Útil cuando no tienes el User ID

### Gestión Avanzada
En la sección "**Gestión Avanzada**" puedes:

- **Agregar créditos**: Sumar créditos al saldo actual
- **Restar créditos**: Quitar créditos del saldo
- **Establecer**: Definir un saldo específico
- **Reiniciar**: Poner el saldo en 0

### Copiar User ID desde la Tabla
En cualquier tabla de usuarios:
- Click en el botón <i class="fas fa-copy"></i> (copiar)
- El User ID se copiará automáticamente al portapapeles

---

## 🔍 Información del Usuario

Cuando seleccionas un usuario, verás:

- **Nombre**: Nombre completo del usuario
- **Email**: Email registrado
- **User ID**: ID único (copiable)
- **Créditos actuales**: Saldo de créditos
- **Última actividad**: Última vez que usó el sistema
- **Fecha de registro**: Cuándo se registró

---

## ⚡ Ejemplos de Uso

### Ejemplo 1: Cliente compra 100 créditos
```
WhatsApp: "Hola, acabo de hacer la transferencia. Mi ID es: 
497e4ec0-a1c9-4ffb-af31-4244868d4c71"

Admin:
1. Copia: 497e4ec0-a1c9-4ffb-af31-4244868d4c71
2. Pega en "User ID"
3. Cantidad: 100
4. Motivo: "Compra por WhatsApp - Transferencia"
5. Click "Agregar Créditos Ahora"
6. ✅ Confirmado

Respuesta WhatsApp: "¡Listo! Te agregué 100 créditos. 
Nuevo saldo: 100 créditos 🎉"
```

### Ejemplo 2: Cliente quiere recarga
```
WhatsApp: "Quiero recargar 500 créditos"

Admin:
1. Pide el User ID al cliente
2. Cliente envía: 8a2f3d1b-9c4e-4f5a-b6d7-1e2f3a4b5c6d
3. Pega el ID
4. Cantidad: 500
5. Motivo: "Recarga PayPal"
6. Click "Agregar Créditos Ahora"
7. ✅ Confirmado

Respuesta WhatsApp: "¡500 créditos agregados! 
Disfruta tu recarga 🚀"
```

---

## 🛡️ Seguridad

- El panel requiere autenticación de administrador
- Todas las operaciones quedan registradas
- Los User IDs son únicos e irrepetibles
- Las sesiones expiran después de 1 hora de inactividad

---

## ❓ Problemas Comunes

### "Usuario no encontrado"
- ✅ Verifica que el User ID esté completo
- ✅ Asegúrate de no incluir espacios extras
- ✅ Confirma que el cliente esté registrado

### "Formato de ID inválido"
- ✅ El ID debe tener formato UUID
- ✅ Ejemplo válido: `497e4ec0-a1c9-4ffb-af31-4244868d4c71`
- ✅ Son 36 caracteres (32 letras/números + 4 guiones)

### Cliente no sabe su User ID
1. Pide su email
2. Busca en "Todos los Usuarios"
3. Filtra por su email
4. Copia su User ID
5. Compártelo con el cliente (para futuras compras)

---

## 📱 Flujo Completo Recomendado

```mermaid
Cliente compra créditos
    ↓
Cliente envía User ID por WhatsApp
    ↓
Admin copia el User ID
    ↓
Admin pega en panel de créditos
    ↓
Sistema confirma el usuario
    ↓
Admin ingresa cantidad y motivo
    ↓
Click "Agregar Créditos Ahora"
    ↓
Sistema actualiza base de datos
    ↓
Admin confirma al cliente
    ↓
¡Cliente puede usar sus créditos! 🎉
```

---

## 📞 Soporte

Si tienes dudas o problemas:
- Revisa esta guía primero
- Verifica que el User ID sea correcto
- Asegúrate de tener conexión a internet
- Los cambios son instantáneos en la base de datos

**¡Importante!** Los clientes pueden ver su User ID en su perfil dentro de la aplicación.

---

*Última actualización: 5 de noviembre de 2025*
