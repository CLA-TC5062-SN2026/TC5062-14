USE uncalificado;
-- Exclusivamente para una base de pruebas; contrasenas_hash son marcadores no utilizables.
INSERT IGNORE INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad,segundo_factor_activo)
VALUES ('11111111-1111-4111-8111-111111111111','Cliente de prueba','cliente-demo@ejemplo.invalid',REPEAT('x',60),'cliente',TRUE,FALSE);
INSERT IGNORE INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad,segundo_factor_activo,segundo_factor_secreto)
VALUES ('22222222-2222-4222-8222-222222222222','Admin de prueba','admin-demo@ejemplo.invalid',REPEAT('x',60),'administrador',TRUE,TRUE,'secreto-demo-no-real');
