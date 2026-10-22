# Auth (RF02)
- Todas las rutas exigen JWT por defecto (guard global). Sin token o vencido: 401.
- `@Roles('jefe_operaciones')` en el metodo o la clase: otro rol recibe 403. Sin `@Roles`, basta estar autenticado.
- `@Publica()` solo para excepciones explicitas (`/health`, `/auth/login`, `/auth/refresh`).
- `@UsuarioActual() u: UsuarioJwtPayload` entrega `{ sub, rol, codigoParticipante }`.
- Importa desde `modulos/plataforma/auth`; no hace falta registrar guards en tu modulo.
