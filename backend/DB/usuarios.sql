-- Usuarios sincronizados con Firebase
-- Solo se guarda uuid y correo, el resto lo maneja Firebase Auth
CREATE TABLE usuarios (
    uuid UUID PRIMARY KEY,           -- UUID de Firebase
    correo VARCHAR(255) NOT NULL UNIQUE,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    semestre INT CHECK (semestre BETWEEN 1 AND 12),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Un usuario puede ser cliente, vendedor o ambos
-- Se separa en roles para no duplicar columnas nulas
CREATE TABLE vendedores (
    uuid UUID PRIMARY KEY REFERENCES usuarios(uuid) ON DELETE CASCADE,
    descripcion TEXT,
    calificacion_promedio NUMERIC(3, 2) DEFAULT 0.0 CHECK (calificacion_promedio BETWEEN 0 AND 5),
    total_valoraciones INT DEFAULT 0,
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valoraciones que un cliente le hace a un vendedor
CREATE TABLE valoraciones (
    id SERIAL PRIMARY KEY,
    uuid_cliente UUID NOT NULL REFERENCES usuarios(uuid) ON DELETE CASCADE,
    uuid_vendedor UUID NOT NULL REFERENCES vendedores(uuid) ON DELETE CASCADE,
    puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (uuid_cliente, uuid_vendedor)  -- Un cliente solo valora una vez a cada vendedor
);

-- Medios de pago aceptados por un vendedor
CREATE TABLE medios_de_pago (
    id SERIAL PRIMARY KEY,
    uuid_vendedor UUID NOT NULL REFERENCES vendedores(uuid) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,   -- ej: 'Nequi', 'Bancolombia', 'Efectivo'
    detalle VARCHAR(255)         -- ej: número de cuenta o teléfono
);

-- Historial de transacciones (compras realizadas)
CREATE TABLE historial_compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uuid_cliente UUID NOT NULL REFERENCES usuarios(uuid),
    uuid_vendedor UUID NOT NULL REFERENCES vendedores(uuid),
    producto_mongo_id VARCHAR(100) NOT NULL,  -- ID del documento en MongoDB
    tipo_oferta VARCHAR(20) NOT NULL CHECK (tipo_oferta IN ('producto', 'servicio')),
    precio_pagado NUMERIC(12, 2) NOT NULL,
    modalidad VARCHAR(50),                    -- ej: 'presencial', 'virtual'
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lista de favoritos — vive en PostgreSQL porque
-- es una relación entre un usuario (PG) y un producto (Mongo)
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    uuid_usuario UUID NOT NULL REFERENCES usuarios(uuid) ON DELETE CASCADE,
    producto_mongo_id VARCHAR(100) NOT NULL,  -- ID del documento en MongoDB
    fecha_agregado TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (uuid_usuario, producto_mongo_id)  -- No duplicar favoritos
);

-- Índices útiles
CREATE INDEX idx_valoraciones_vendedor ON valoraciones(uuid_vendedor);
CREATE INDEX idx_historial_cliente ON historial_compras(uuid_cliente);
CREATE INDEX idx_favoritos_usuario ON favoritos(uuid_usuario);