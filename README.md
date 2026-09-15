# BLUSH CLUB — Guía de puesta en marcha (paso a paso)

Esta guía asume que no programas. Cada paso te dice exactamente qué pantalla abrir y qué botón tocar.

---

## Qué es esto

Ya no es una demo. Es un proyecto real (Next.js) conectado a una base de datos real (Supabase), con:

- Tienda pública: cualquiera puede ver productos, buscar, filtrar, guardar favoritos y reservar por WhatsApp.
- `/admin`: solo tú puedes entrar. Ahí editas productos, tonos, fotos, marcas, categorías, el menú, las secciones de inicio y todo el diseño (logo, colores, WhatsApp, políticas).
- La seguridad no depende de esconder un botón: la base de datos misma (con Row Level Security) rechaza cualquier intento de editar algo si no inicias sesión con tu cuenta de administradora.

---

## Paso 1 — Crear tu proyecto en Supabase

1. Ve a **supabase.com** y crea una cuenta (o inicia sesión).
2. Toca **New project**.
3. Ponle un nombre, por ejemplo `blush-club`.
4. Elige una contraseña para la base de datos y guárdala en un lugar seguro (no es la contraseña con la que tú vas a iniciar sesión en la tienda, es solo interna).
5. Elige la región más cercana a Colombia (por ejemplo, alguna de EE. UU. este).
6. Espera 1–2 minutos a que el proyecto termine de crearse.

## Paso 2 — Ejecutar el esquema de la base de datos

1. Dentro de tu proyecto de Supabase, ve al menú izquierdo → **SQL Editor**.
2. Toca **New query**.
3. Abre el archivo `supabase/01_schema.sql` de este proyecto, copia todo su contenido, pégalo en el editor y toca **Run**.
4. Repite exactamente lo mismo, en este orden, con:
   - `supabase/02_policies.sql`
   - `supabase/03_storage.sql`
   - `supabase/04_seed.sql` (esto carga tus 3 productos de prueba)

Si alguno da error, revisa que hayas corrido los anteriores primero — dependen unos de otros.

## Paso 3 — Crear tu cuenta de administradora

Este paso es intencionalmente manual: así nadie puede crearse una cuenta de administrador por su cuenta, ni siquiera si intenta registrarse desde la web.

1. En Supabase, ve a **Authentication → Users**.
2. Toca **Add user → Create new user**.
3. Escribe tu correo y una contraseña. Marca la opción de **Auto Confirm User** si aparece (así no necesitas confirmar por correo).
4. Toca **Create user**. Copia el **User UID** que aparece en la lista (es un código largo).
5. Ve de nuevo a **SQL Editor → New query** y pega esto, reemplazando `PEGA-AQUI-EL-UID`:

```sql
insert into profiles (id, role) values ('PEGA-AQUI-EL-UID', 'admin');
```

6. Toca **Run**. Con esto, esa cuenta (y solo esa) tiene permisos de administradora.

Para agregar a alguien más al equipo en el futuro, repites este mismo paso 3 con su correo.

## Paso 4 — Obtener tus llaves de Supabase

1. En Supabase, ve a **Project Settings → API**.
2. Vas a necesitar dos valores:
   - **Project URL**
   - **anon public key**

No necesitas la "service role key" para que la tienda funcione — este proyecto está diseñado para no usarla nunca en el navegador.

## Paso 5 — Configurar las variables de entorno

1. En la carpeta del proyecto, copia el archivo `.env.local.example` y renómbralo a `.env.local`.
2. Pega tus valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

(La variable `SUPABASE_SERVICE_ROLE_KEY` puedes dejarla vacía por ahora; no se usa en el código actual.)

## Paso 6 — Probarlo en tu computador (opcional, si tienes a alguien que te ayude con esto)

```
npm install
npm run dev
```

Abre `http://localhost:3000`. Entra a `/login` con el correo y contraseña que creaste en el Paso 3 para acceder a `/admin`.

## Paso 7 — Publicar la tienda en internet (Vercel)

1. Sube este proyecto a GitHub (o pide ayuda para hacerlo una vez).
2. Ve a **vercel.com**, inicia sesión con GitHub y toca **Add New → Project**.
3. Elige el repositorio de Blush Club.
4. En **Environment Variables**, agrega las mismas dos variables del Paso 5 (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Toca **Deploy**. En un par de minutos tendrás una URL pública como `blush-club.vercel.app`.
6. Desde el panel de Vercel puedes conectar tu propio dominio (por ejemplo `blushclub.co`) cuando lo tengas.

---

## Cómo administrar la tienda día a día

- Entra a `tu-dominio.com/admin` e inicia sesión con tu correo y contraseña.
- **Productos**: agregar, editar, subir fotos reales (reemplazan las de prueba), agregar tonos, marcar Viral/Bestseller/Nuevo, ocultar o eliminar.
- **Marcas** y **Categorías**: crear, editar, subir imagen, ocultar.
- **Inicio**: agregar o quitar secciones de la página principal (hero, filas de productos, categorías, marcas, banners, texto), reordenarlas, mostrarlas u ocultarlas.
- **Menú**: editar qué aparece en el menú ☰ y a dónde lleva cada enlace.
- **Diseño y configuración**: logo, favicon, colores, WhatsApp, Instagram, correo, porcentaje de abono, política de reserva, información de envíos.

Todo lo que cambies ahí se refleja de inmediato en la tienda pública — no necesitas volver a publicar ni tocar código.

---

## Qué es gratis y qué podría tener costo

- **Supabase**: el plan gratuito incluye base de datos, autenticación y 1 GB de almacenamiento de imágenes — de sobra para empezar. Si el catálogo crece mucho (miles de fotos en alta resolución) o el tráfico aumenta bastante, existe un plan pago (desde ~US$25/mes).
- **Vercel**: el plan gratuito (Hobby) es suficiente para una tienda de este tamaño.
- **Dominio propio** (ej. blushclub.co): tiene un costo anual con el proveedor que elijas (aprox. US$10–20/año); no está incluido en Supabase ni Vercel.
- **WhatsApp**: no tiene costo, se usa tu número normal mediante enlaces `wa.me`.

## Qué quedó simplificado en esta primera versión (y se puede ampliar después)

- El registro de **pedidos** (`orders`/`order_items`) ya existe en la base de datos, pero por ahora el flujo de compra termina en WhatsApp; guardar cada pedido automáticamente en el panel es un siguiente paso natural.
- Las **subcategorías** existen como un campo de texto libre en cada producto, no como su propio catálogo administrable — suficiente para tu volumen actual de productos.
- No hay todavía una "vista previa" separada antes de publicar: los cambios en `/admin` se reflejan de inmediato en la tienda.
- El reordenamiento es con botones (subir/bajar), no arrastrando con el dedo.

Ninguno de estos bloquea el uso real de la tienda; son mejoras que se agregan cuando tenga sentido para ti. 
