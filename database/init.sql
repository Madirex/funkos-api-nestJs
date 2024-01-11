-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
                                          id SERIAL PRIMARY KEY,
                                          category_type VARCHAR(255) DEFAULT 'OTHER',
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
    );

-- Crear tabla de Funkos
CREATE TABLE IF NOT EXISTS funkos (
                                      id UUID PRIMARY KEY,
                                      name VARCHAR(255) UNIQUE NOT NULL,
    price DOUBLE PRECISION DEFAULT 0.0,
    stock INTEGER DEFAULT 0,
    image TEXT DEFAULT 'empty.png',
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
    );

-- Enumeración de tipos de categorías
DO $$
BEGIN
CREATE TYPE category_type AS ENUM (
    'SERIES',
    'DISNEY',
    'SUPERHEROS',
    'MOVIE',
    'OTHER'
  );
EXCEPTION
WHEN duplicate_object THEN null;
END $$;

-- Agregar restricción de tipo de categoría
ALTER TABLE categories
    ADD CONSTRAINT valid_category_type CHECK (category_type IN ('SERIES', 'DISNEY', 'SUPERHEROS', 'MOVIE', 'OTHER'));
