"""Prueba de humo de esquema_bd.sql (MySQL 8).

Recorre un flujo completo del MVP (registro → solicitud → invitación → cita →
propuesta → cambio → cierre → evaluación) y verifica que las restricciones
rechacen los datos inválidos.

Uso:
    mysql -u root -p < esquema_bd.sql
    pip install pymysql
    python probar_esquema.py --usuario prueba --contrasena prueba
Todo se ejecuta en una transacción que se revierte al final; no deja datos.
"""
import argparse
import uuid

import pymysql

u = lambda: str(uuid.uuid4())
H = 'a' * 64  # hash SHA-256 de prueba
BCRYPT = '$2b$12$' + 'x' * 53

ids = {k: u() for k in [
    'cliente', 'trab_u', 'org_u', 'admin', 'prov_t', 'prov_o', 'sol', 'conv', 'msg', 'adj', 'inv', 'cita',
    'prop', 'vp1', 'vp2', 'c1', 'c2', 'cambio', 'contra', 'pres1', 'pres2', 'bit1', 'bit2', 'eval1', 'conj',
    'cierre', 'verif', 'caso', 'notif', 'mcanal', 'sol2', 'cambio2', 'franja']}

POSITIVAS = [
    ("usuarios", "INSERT INTO usuarios (id,nombre,correo,contrasena_hash,telefono,rol,declara_mayor_edad) VALUES "
     f"('{ids['cliente']}','Ana Cliente','ana@ejemplo.mx','{BCRYPT}','3312345678','cliente',TRUE),"
     f"('{ids['trab_u']}','Luis Plomero','luis@ejemplo.mx','{BCRYPT}',NULL,'trabajador',TRUE),"
     f"('{ids['org_u']}','Constructora Uno','org@ejemplo.mx','{BCRYPT}',NULL,'organizacion',TRUE)"),
    ("admin con 2FA", "INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad,segundo_factor_activo,segundo_factor_secreto) "
     f"VALUES ('{ids['admin']}','Admin','admin@ejemplo.mx','{BCRYPT}','administrador',TRUE,TRUE,'cifrado')"),
    ("consentimiento", f"INSERT INTO consentimientos (id,usuario_id,version_aviso) VALUES ('{u()}','{ids['cliente']}',1)"),
    ("proveedores", "INSERT INTO proveedores (id,usuario_id,modalidad,horario_dias,horario_hora_inicio,horario_hora_fin,disponibilidad_general) VALUES "
     f"('{ids['prov_t']}','{ids['trab_u']}','trabajador','lun,mar,mie,jue,vie','08:00','18:00',NULL),"
     f"('{ids['prov_o']}','{ids['org_u']}','organizacion',NULL,NULL,NULL,'aceptando_proyectos')"),
    ("subclases", f"INSERT INTO trabajadores_independientes (proveedor_id,foto_clave,anios_experiencia) VALUES ('{ids['prov_t']}','fotos/luis.jpg',12)"),
    ("organizacion", f"INSERT INTO organizaciones_contratistas (proveedor_id,nombre_legal_o_comercial,representante_contacto) VALUES ('{ids['prov_o']}','Constructora Uno SA de CV','Marta Ruiz')"),
    ("oficios y zonas", f"INSERT INTO proveedor_oficios VALUES ('{ids['prov_t']}','plomeria'),('{ids['prov_o']}','albanileria')"),
    ("zonas", f"INSERT INTO proveedor_zonas VALUES ('{ids['prov_t']}','zapopan','Centro'),('{ids['prov_o']}','guadalajara','Americana')"),
    ("verificacion", f"INSERT INTO verificaciones (id,proveedor_id,tipo) VALUES ('{ids['verif']}','{ids['prov_t']}','identidad')"),
    ("solicitud", "INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES "
     f"('{ids['sol']}','{ids['cliente']}','agente','Reparar fuga en baño','plomeria','zapopan','Centro')"),
    ("conversación", f"INSERT INTO conversaciones (id,cliente_id,solicitud_id) VALUES ('{ids['conv']}','{ids['cliente']}','{ids['sol']}')"),
    ("mensaje", f"INSERT INTO mensajes_conversacion (id,conversacion_id,emisor,contenido) VALUES ('{ids['msg']}','{ids['conv']}','agente','Soy un asistente automático')"),
    ("adjunto", "INSERT INTO adjuntos (id,solicitud_id,mensaje_conversacion_id,tipo,mime,tamano_bytes,clave_almacenamiento) VALUES "
     f"('{ids['adj']}','{ids['sol']}','{ids['msg']}','imagen','image/png',3145728,'adj/1.png')"),
    ("confirmar", f"UPDATE solicitudes SET estado='confirmada', confirmada_en=NOW(), resumen_confirmado=TRUE WHERE id='{ids['sol']}'"),
    ("recomendaciones", f"INSERT INTO conjuntos_recomendaciones (id,solicitud_id) VALUES ('{ids['conj']}','{ids['sol']}')"),
    ("recomendación", f"INSERT INTO recomendaciones VALUES ('{ids['conj']}',1,'{ids['prov_t']}',JSON_OBJECT('texto','Cubre tu colonia y es plomero','oficio','plomeria'))"),
    ("invitación", f"INSERT INTO invitaciones (id,solicitud_id,proveedor_id,vence_en) VALUES ('{ids['inv']}','{ids['sol']}','{ids['prov_t']}',NOW()+INTERVAL 4 HOUR)"),
    ("aceptar invitación", f"UPDATE invitaciones SET estado='aceptada', respondida_en=NOW() WHERE id='{ids['inv']}'"),
    ("asociar proveedor", f"UPDATE solicitudes SET proveedor_id='{ids['prov_t']}' WHERE id='{ids['sol']}'"),
    ("cita", "INSERT INTO citas (id,solicitud_id,proveedor_id,tipo,inicio,fin,expira_en) VALUES "
     f"('{ids['cita']}','{ids['sol']}','{ids['prov_t']}','visita_valoracion',NOW()+INTERVAL 1 DAY,NOW()+INTERVAL 25 HOUR,NOW()+INTERVAL 24 HOUR)"),
    ("propuesta", f"INSERT INTO propuestas (id,solicitud_id,proveedor_id,plazo_acuerdo_vence_en) VALUES ('{ids['prop']}','{ids['sol']}','{ids['prov_t']}',NOW()+INTERVAL 72 HOUR)"),
    ("versión 1", f"INSERT INTO versiones_propuesta (id,propuesta_id,numero,trabajo,fecha_inicio,fecha_fin,total) VALUES ('{ids['vp1']}','{ids['prop']}',1,'Cambio de tubería',CURDATE(),CURDATE()+INTERVAL 2 DAY,1500)"),
    ("conceptos", "INSERT INTO conceptos_propuesta (id,version_propuesta_id,categoria,descripcion,subtotal,cantidad,unidad,precio_unitario) VALUES "
     f"('{ids['c1']}','{ids['vp1']}','mano_de_obra','Instalación',1000,NULL,NULL,NULL),"
     f"('{ids['c2']}','{ids['vp1']}','material','Tubo PVC',500,5,'m',100)"),
    ("versión 2", f"INSERT INTO versiones_propuesta (id,propuesta_id,numero,trabajo,fecha_inicio,fecha_fin,total,estado,aceptada_en) VALUES ('{ids['vp2']}','{ids['prop']}',2,'Cambio de tubería (rev.)',CURDATE(),CURDATE()+INTERVAL 2 DAY,1400,'aceptada',NOW())"),
    ("presupuesto inicial", f"INSERT INTO versiones_presupuesto (id,solicitud_id,numero,total_anterior,total_actualizado,diferencia_contra_inicial,version_propuesta_id) VALUES ('{ids['pres1']}','{ids['sol']}',1,0,1400,0,'{ids['vp2']}')"),
    ("bitácora 1", f"INSERT INTO registros_bitacora (id,solicitud_id,autor_id,entidad,version_propuesta_id,decision,hash_encadenado) VALUES ('{ids['bit1']}','{ids['sol']}','{ids['cliente']}','propuesta','{ids['vp2']}','aceptacion','{H}')"),
    ("revelación", f"INSERT INTO revelaciones_domicilio (id,solicitud_id,trabajador_id,disparador) VALUES ('{u()}','{ids['sol']}','{ids['prov_t']}','propuesta_aceptada')"),
    ("cambio", f"INSERT INTO cambios (id,solicitud_id,iniciado_por,tipo,motivo,monto_ajuste,presupuesto_actualizado,elementos_afectados,vence_en) VALUES ('{ids['cambio']}','{ids['sol']}','proveedor','costo','Tubería dañada',-100,1300,JSON_ARRAY('tubería'),NOW()+INTERVAL 24 HOUR)"),
    ("contrapropuesta", f"INSERT INTO contrapropuestas (id,cambio_id,monto_adicional,presupuesto_actualizado,comentario,vence_en) VALUES ('{ids['contra']}','{ids['cambio']}',-150,1250,'Acepto si incluye llave',NOW()+INTERVAL 24 HOUR)"),
    ("análisis IA", f"INSERT INTO analisis_ia (id,cambio_id,consistencias,datos_faltantes,riesgos) VALUES ('{u()}','{ids['cambio']}',JSON_ARRAY('ok'),JSON_ARRAY(),JSON_ARRAY())"),
    ("presupuesto v2", f"INSERT INTO versiones_presupuesto (id,solicitud_id,numero,total_anterior,total_actualizado,diferencia_contra_inicial,cambio_id) VALUES ('{ids['pres2']}','{ids['sol']}',2,1400,1300,-100,'{ids['cambio']}')"),
    ("bitácora 2", f"INSERT INTO registros_bitacora (id,solicitud_id,autor_id,entidad,cambio_id,decision,anterior_id,hash_encadenado) VALUES ('{ids['bit2']}','{ids['sol']}','{ids['cliente']}','cambio','{ids['cambio']}','aceptacion','{ids['bit1']}','{'b'*64}')"),
    ("canal", f"INSERT INTO mensajes_canal (id,solicitud_id,emisor_id,contenido) VALUES ('{ids['mcanal']}','{ids['sol']}','{ids['trab_u']}','Llego a las 10')"),
    ("cierre", f"INSERT INTO solicitudes_cierre (id,solicitud_id) VALUES ('{ids['cierre']}','{ids['sol']}')"),
    ("confirmar cierre", f"UPDATE solicitudes_cierre SET respuesta='confirmado', respondida_en=NOW() WHERE id='{ids['cierre']}'"),
    ("concluir", f"UPDATE solicitudes SET estado='concluido' WHERE id='{ids['sol']}'"),
    ("evaluación", "INSERT INTO evaluaciones (id,solicitud_id,direccion,evaluador_id,evaluado_id,estado,calificacion,puntualidad,calidad,limpieza,apego_presupuesto,registrada_en,publicada_en) VALUES "
     f"('{ids['eval1']}','{ids['sol']}','cliente_a_proveedor','{ids['cliente']}','{ids['trab_u']}','publicada',4.75,5,5,4,5,NOW(),NOW())"),
    ("segunda solicitud", "INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES "
     f"('{ids['sol2']}','{ids['cliente']}','manual','Pintar recámara','pintura','guadalajara','Americana')"),
    ("cambio de la segunda solicitud", f"INSERT INTO cambios (id,solicitud_id,iniciado_por,tipo,motivo,monto_ajuste,presupuesto_actualizado,vence_en) VALUES ('{ids['cambio2']}','{ids['sol2']}','cliente','alcance','Otra pared',300,300,NOW()+INTERVAL 24 HOUR)"),
    ("franja bloqueada", f"INSERT INTO franjas_bloqueadas (id,proveedor_id,inicio,fin,cita_id) VALUES ('{ids['franja']}','{ids['prov_t']}','2026-11-03 10:00','2026-11-03 11:00','{ids['cita']}')"),
    ("evidencia del cambio", f"INSERT INTO cambio_evidencias (cambio_id,adjunto_id,solicitud_id) VALUES ('{ids['cambio']}','{ids['adj']}','{ids['sol']}')"),
    ("historial de estados", f"INSERT INTO historial_estados_solicitud (id,solicitud_id,estado,cambiado_por) VALUES ('{u()}','{ids['sol']}','borrador','{ids['cliente']}'),('{u()}','{ids['sol']}','confirmada','{ids['cliente']}')"),
    ("caso soporte", f"INSERT INTO casos_soporte (id,cliente_id,conversacion_id,motivo) VALUES ('{ids['caso']}','{ids['cliente']}','{ids['conv']}','agente_no_comprende')"),
    ("ARCO", f"INSERT INTO solicitudes_arco (folio,usuario_id,derecho,fecha_limite) VALUES ('ARCO-2026-0001','{ids['cliente']}','acceso',CURDATE()+INTERVAL 28 DAY)"),
    ("notificación", f"INSERT INTO notificaciones (id,usuario_id,tipo,titulo) VALUES ('{ids['notif']}','{ids['cliente']}','solicitud_calificacion','Califica tu servicio')"),
]

# (descripción, sentencia, código de error MySQL esperado)
NEGATIVAS = [
    ("correo duplicado (UNIQUE)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad) VALUES ('{u()}','X','ana@ejemplo.mx','{BCRYPT}','cliente',TRUE)", 1062),
    ("nombre nulo (NOT NULL)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad) VALUES ('{u()}',NULL,'n@e.mx','{BCRYPT}','cliente',TRUE)", 1048),
    ("teléfono inválido (CHECK)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,telefono,rol,declara_mayor_edad) VALUES ('{u()}','X','t@e.mx','{BCRYPT}','12ab','cliente',TRUE)", 3819),
    ("administrador sin 2FA (RNF-11)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad) VALUES ('{u()}','X','a2@e.mx','{BCRYPT}','administrador',TRUE)", 3819),
    ("rol inexistente (ENUM)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad) VALUES ('{u()}','X','r@e.mx','{BCRYPT}','soporte',TRUE)", 1265),
    ("segundo perfil de proveedor para un usuario", f"INSERT INTO proveedores (id,usuario_id,modalidad) VALUES ('{u()}','{ids['trab_u']}','trabajador')", 1062),
    ("oficio fuera del catálogo (FK)", f"INSERT INTO proveedor_oficios VALUES ('{ids['prov_t']}','jardineria')", 1452),
    ("solicitud con cliente inexistente (FK)", f"INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES ('{u()}','{u()}','manual','x','pintura','zapopan','Centro')", 1452),
    ("municipio fuera del piloto (ENUM)", f"INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES ('{u()}','{ids['cliente']}','manual','x','pintura','monterrey','Centro')", 1265),
    ("imagen de más de 5 MB (CHECK)", f"INSERT INTO adjuntos (id,solicitud_id,tipo,mime,tamano_bytes,clave_almacenamiento) VALUES ('{u()}','{ids['sol']}','imagen','image/png',6000000,'adj/x.png')", 3819),
    ("imagen con MIME de video (CHECK)", f"INSERT INTO adjuntos (id,solicitud_id,tipo,mime,tamano_bytes,clave_almacenamiento) VALUES ('{u()}','{ids['sol']}','imagen','video/mp4',100,'adj/y.png')", 3819),
    ("quinta recomendación (CHECK 1..4)", f"INSERT INTO recomendaciones VALUES ('{ids['conj']}',5,'{ids['prov_o']}',JSON_OBJECT('texto','x'))", 3819),
    ("invitar dos veces al mismo proveedor (UNIQUE)", f"INSERT INTO invitaciones (id,solicitud_id,proveedor_id,vence_en) VALUES ('{u()}','{ids['sol']}','{ids['prov_t']}',NOW()+INTERVAL 1 HOUR)", 1062),
    ("cita que termina antes de empezar (CHECK)", f"INSERT INTO citas (id,solicitud_id,proveedor_id,tipo,inicio,fin,expira_en) VALUES ('{u()}','{ids['sol']}','{ids['prov_t']}','ejecucion',NOW(),NOW()-INTERVAL 1 HOUR,NOW())", 3819),
    ("cita confirmada sin doble confirmación (CHECK)", f"UPDATE citas SET estado='confirmada', confirmada_por_proveedor_en=NOW() WHERE id='{ids['cita']}'", 3819),
    ("material sin cantidad (CHECK RF-38-AC-2)", f"INSERT INTO conceptos_propuesta (id,version_propuesta_id,categoria,descripcion,subtotal) VALUES ('{u()}','{ids['vp1']}','material','Codo',50)", 3819),
    ("número de versión repetido (UNIQUE)", f"INSERT INTO versiones_propuesta (id,propuesta_id,numero,trabajo,fecha_inicio,fecha_fin,total) VALUES ('{u()}','{ids['prop']}',1,'x',CURDATE(),CURDATE(),1)", 1062),
    ("versión de presupuesto sin origen (CHECK)", f"INSERT INTO versiones_presupuesto (id,solicitud_id,numero,total_anterior,total_actualizado,diferencia_contra_inicial) VALUES ('{u()}','{ids['sol']}',3,1,1,0)", 3819),
    ("segunda evaluación en la misma dirección (UNIQUE, 0..2)", f"INSERT INTO evaluaciones (id,solicitud_id,direccion,evaluador_id,evaluado_id) VALUES ('{u()}','{ids['sol']}','cliente_a_proveedor','{ids['cliente']}','{ids['trab_u']}')", 1062),
    ("dimensiones en evaluación proveedor → cliente (CHECK)", f"INSERT INTO evaluaciones (id,solicitud_id,direccion,evaluador_id,evaluado_id,puntualidad) VALUES ('{u()}','{ids['sol']}','proveedor_a_cliente','{ids['trab_u']}','{ids['cliente']}',5)", 3819),
    ("calificación fuera de 1..5 (CHECK)", f"INSERT INTO evaluaciones (id,solicitud_id,direccion,evaluador_id,evaluado_id,estado,calificacion,registrada_en) VALUES ('{u()}','{ids['sol']}','proveedor_a_cliente','{ids['trab_u']}','{ids['cliente']}','registrada',7,NOW())", 3819),
    ("revelar dos veces al mismo trabajador (UNIQUE)", f"INSERT INTO revelaciones_domicilio (id,solicitud_id,trabajador_id,disparador) VALUES ('{u()}','{ids['sol']}','{ids['prov_t']}','visita_confirmada')", 1062),
    ("revelar domicilio a una organización (FK a trabajadores)", f"UPDATE revelaciones_domicilio SET trabajador_id='{ids['prov_o']}' WHERE solicitud_id='{ids['sol']}'", 1452),
    ("modificar la bitácora (trigger RNF-12)", f"UPDATE registros_bitacora SET decision='rechazo' WHERE id='{ids['bit1']}'", 1644),
    ("borrar la bitácora (trigger RNF-12)", f"DELETE FROM registros_bitacora WHERE id='{ids['bit2']}'", 1644),
    ("bifurcar la cadena de bitácora (UNIQUE anterior)", f"INSERT INTO registros_bitacora (id,solicitud_id,autor_id,entidad,cambio_id,decision,anterior_id,hash_encadenado) VALUES ('{u()}','{ids['sol']}','{ids['cliente']}','cambio','{ids['cambio']}','rechazo','{ids['bit1']}','{'c'*64}')", 1062),
    ("borrar una solicitud con bitácora (FK RESTRICT)", f"DELETE FROM solicitudes WHERE id='{ids['sol']}'", 1451),
    ("cierre rechazado sin pendientes (CHECK RF-47-AC-4)", f"INSERT INTO solicitudes_cierre (id,solicitud_id,respuesta,respondida_en) VALUES ('{u()}','{ids['sol']}','rechazado',NOW())", 3819),
    ("consentimiento duplicado de la misma versión (UNIQUE)", f"INSERT INTO consentimientos (id,usuario_id,version_aviso) VALUES ('{u()}','{ids['cliente']}',1)", 1062),
    ("admin sin secreto de 2FA (CHECK RNF-11)", f"INSERT INTO usuarios (id,nombre,correo,contrasena_hash,rol,declara_mayor_edad,segundo_factor_activo) VALUES ('{u()}','X','a3@e.mx','{BCRYPT}','administrador',TRUE,TRUE)", 3819),
    ("proveedor cuya modalidad no coincide con el rol (FK compuesta)", f"INSERT INTO proveedores (id,usuario_id,modalidad) VALUES ('{u()}','{ids['cliente']}','trabajador')", 1452),
    ("perfil de organización para un proveedor trabajador (subclases disjuntas)", f"INSERT INTO organizaciones_contratistas (proveedor_id,nombre_legal_o_comercial) VALUES ('{ids['prov_t']}','X')", 1452),
    ("verificación resuelta por un no administrador (FK compuesta)", f"UPDATE verificaciones SET estado='aprobada', resuelta_por='{ids['cliente']}', resuelta_en=NOW() WHERE id='{ids['verif']}'", 1452),
    ("segunda verificación vigente del mismo tipo (UNIQUE funcional)", f"INSERT INTO verificaciones (id,proveedor_id,tipo) VALUES ('{u()}','{ids['prov_t']}','identidad')", 1062),
    ("solicitud creada por un trabajador (FK compuesta)", f"INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES ('{u()}','{ids['trab_u']}','manual','x','pintura','zapopan','Centro')", 1452),
    ("borrador sin oficio (NOT NULL, RF-16)", f"INSERT INTO solicitudes (id,cliente_id,modo_captura,resultado_esperado,oficio,zona_municipio,zona_colonia) VALUES ('{u()}','{ids['cliente']}','manual','x',NULL,'zapopan','Centro')", 1048),
    ("proyecto programado sin proveedor (CHECK RF-45)", f"UPDATE solicitudes SET estado='programado', confirmada_en=NOW(), resumen_confirmado=TRUE WHERE id='{ids['sol2']}'", 3819),
    ("confirmar sin resumen confirmado (CHECK)", f"UPDATE solicitudes SET estado='confirmada', confirmada_en=NOW() WHERE id='{ids['sol2']}'", 3819),
    ("segunda invitación activa en la misma solicitud (UNIQUE funcional)", f"INSERT INTO invitaciones (id,solicitud_id,proveedor_id,vence_en) VALUES ('{u()}','{ids['sol']}','{ids['prov_o']}',NOW()+INTERVAL 1 HOUR)", 1062),
    ("segunda versión aceptada (UNIQUE funcional)", f"UPDATE versiones_propuesta SET estado='aceptada', aceptada_en=NOW() WHERE id='{ids['vp1']}'", 1062),
    ("recomendación sin texto en la explicación (CHECK JSON)", f"INSERT INTO recomendaciones VALUES ('{ids['conj']}',2,'{ids['prov_o']}',JSON_OBJECT('oficio','x'))", 3819),
    ("mensaje del cliente de más de 4000 caracteres (CHECK)", f"INSERT INTO mensajes_conversacion (id,conversacion_id,emisor,contenido) VALUES ('{u()}','{ids['conv']}','cliente',REPEAT('a',4001))", 3819),
    ("segunda contrapropuesta pendiente (UNIQUE funcional)", f"INSERT INTO contrapropuestas (id,cambio_id,monto_adicional,presupuesto_actualizado,vence_en) VALUES ('{u()}','{ids['cambio']}',0,1400,NOW()+INTERVAL 24 HOUR)", 1062),
    ("bitácora con un cambio de otro proyecto (FK compuesta)", f"INSERT INTO registros_bitacora (id,solicitud_id,autor_id,entidad,cambio_id,decision,hash_encadenado) VALUES ('{u()}','{ids['sol']}','{ids['cliente']}','cambio','{ids['cambio2']}','rechazo','{'d'*64}')", 1452),
    ("presupuesto originado por un cambio de otro proyecto (FK compuesta)", f"INSERT INTO versiones_presupuesto (id,solicitud_id,numero,total_anterior,total_actualizado,diferencia_contra_inicial,cambio_id) VALUES ('{u()}','{ids['sol']}',3,1300,1600,200,'{ids['cambio2']}')", 1452),
    ("franja traslapada del mismo prestador (trigger RF-35)", f"INSERT INTO franjas_bloqueadas (id,proveedor_id,inicio,fin) VALUES ('{u()}','{ids['prov_t']}','2026-11-03 10:30','2026-11-03 11:30')", 1644),
    ("evaluación hecha por alguien ajeno al proyecto (trigger RD-13)", f"INSERT INTO evaluaciones (id,solicitud_id,direccion,evaluador_id,evaluado_id) VALUES ('{u()}','{ids['sol']}','proveedor_a_cliente','{ids['org_u']}','{ids['cliente']}')", 1644),
    ("evaluación del cliente sin las 4 dimensiones (CHECK RF-49)", f"UPDATE evaluaciones SET calidad=NULL WHERE id='{ids['eval1']}'", 3819),
    ("segunda solicitud de cierre abierta (UNIQUE funcional)", [f"INSERT INTO solicitudes_cierre (id,solicitud_id) VALUES ('{u()}','{ids['sol']}')", f"INSERT INTO solicitudes_cierre (id,solicitud_id) VALUES ('{u()}','{ids['sol']}')"], 1062),
    ("undécima imagen del proyecto (trigger RF-18)", [f"INSERT INTO adjuntos (id,solicitud_id,tipo,mime,tamano_bytes,clave_almacenamiento) VALUES ('{u()}','{ids['sol']}','imagen','image/png',100,'adj/n{i}.png')" for i in range(10)], 1644),
    ("evidencia de un cambio con adjunto de otro proyecto (FK compuesta)", f"INSERT INTO cambio_evidencias (cambio_id,adjunto_id,solicitud_id) VALUES ('{ids['cambio2']}','{ids['adj']}','{ids['sol2']}')", 1452),
    ("conjunto con exclusiones que no son arreglo (CHECK JSON)", f"UPDATE conjuntos_recomendaciones SET proveedores_excluidos=JSON_OBJECT('a',1) WHERE id='{ids['conj']}'", 3819),
]

VISTAS = [
    ("calificación promedio", f"SELECT calificacion_promedio, numero_evaluaciones FROM v_calificacion_proveedor WHERE proveedor_id='{ids['prov_t']}'"),
    ("perfil completo", f"SELECT perfil_completo FROM v_perfil_completo WHERE proveedor_id='{ids['prov_t']}'"),
    ("acceso al domicilio", f"SELECT acceso_hasta IS NOT NULL FROM v_acceso_domicilio WHERE solicitud_id='{ids['sol']}'"),
    ("presupuesto inicial", f"SELECT numero, es_inicial FROM v_versiones_presupuesto WHERE solicitud_id='{ids['sol']}' ORDER BY numero"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--host', default='localhost')
    ap.add_argument('--usuario', default='root')
    ap.add_argument('--contrasena', default='')
    a = ap.parse_args()
    cx = pymysql.connect(host=a.host, user=a.usuario, password=a.contrasena, database='uncalificado', autocommit=False)
    cur = cx.cursor()
    ok = fallas = 0
    print('== Flujo válido (debe aceptarse)')
    for nombre, sql in POSITIVAS:
        try:
            cur.execute(sql)
            ok += 1
            print(f'  OK   {nombre}')
        except pymysql.MySQLError as e:
            fallas += 1
            print(f'  FALLA {nombre}: {e}')
    print('== Datos inválidos (deben rechazarse)')
    for nombre, sql, codigo in NEGATIVAS:
        cur.execute('SAVEPOINT sp')
        try:
            for sentencia in (sql if isinstance(sql, list) else [sql]):
                cur.execute(sentencia)
            fallas += 1
            print(f'  FALLA {nombre}: se aceptó')
        except pymysql.MySQLError as e:
            if e.args[0] == codigo:
                ok += 1
                print(f'  OK   {nombre} → error {codigo}')
            else:
                fallas += 1
                print(f'  FALLA {nombre}: error {e.args[0]} (se esperaba {codigo}) {e.args[1]}')
        cur.execute('ROLLBACK TO SAVEPOINT sp')
    print('== Atributos derivados (vistas)')
    for nombre, sql in VISTAS:
        cur.execute(sql)
        print(f'  {nombre}: {cur.fetchall()}')
    cx.rollback()
    cx.close()
    print(f'\nResultado: {ok} correctas, {fallas} fallas')
    raise SystemExit(1 if fallas else 0)


if __name__ == '__main__':
    main()
