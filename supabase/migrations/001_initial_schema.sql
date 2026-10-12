-- Smart Sales Promoter: Supabase & PostgreSQL Multi-Tenant Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Complete multi-tenant tables, Row-Level Security (RLS) policies, indexes, and constraints.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stores (Locations within an Organization)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(30),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_store_code_per_org UNIQUE(organization_id, code)
);

-- 3. Users / Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- Matches Supabase auth.users id
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Memberships & Tenant Roles
CREATE TYPE user_role AS ENUM (
    'platform_admin',
    'org_admin',
    'store_manager',
    'promoter',
    'content_editor'
);

CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'promoter',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_org UNIQUE(user_id, organization_id)
);

-- 5. Brands
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    logo_url TEXT,
    country_of_origin VARCHAR(100),
    official_website TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Organization Brand Permissions (Catalog sharing)
CREATE TABLE IF NOT EXISTS organization_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_org_brand UNIQUE(organization_id, brand_id)
);

-- 7. Products Catalogue
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- NULL indicates global manufacturer catalog
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    model_number VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    sku VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    capacity_litres NUMERIC(6, 2),
    wattage INTEGER,
    color_finish VARCHAR(100),
    availability_status VARCHAR(50) DEFAULT 'in_stock',
    search_aliases TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Content
    short_description TEXT,
    detailed_description TEXT,
    customer_friendly_pitch TEXT,
    key_selling_points TEXT[] DEFAULT ARRAY[]::TEXT[],
    use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Technical Specs
    voltage VARCHAR(50) DEFAULT '220-240V, 50Hz',
    temperature_range_celsius VARCHAR(100),
    timer_limit_minutes INTEGER,
    operating_modes TEXT[] DEFAULT ARRAY[]::TEXT[],
    preset_menus_count INTEGER DEFAULT 0,
    material_construction TEXT,
    warranty_years NUMERIC(4, 1) DEFAULT 2.0,
    warranty_details TEXT,
    maintenance_instructions TEXT,
    safety_notes TEXT,
    country_of_origin VARCHAR(100),

    -- Dimensions (canonical in mm and kg)
    external_width_mm NUMERIC(8, 2),
    external_height_mm NUMERIC(8, 2),
    external_depth_mm NUMERIC(8, 2),
    cavity_width_mm NUMERIC(8, 2),
    cavity_height_mm NUMERIC(8, 2),
    cavity_depth_mm NUMERIC(8, 2),
    weight_kg NUMERIC(6, 2),
    packaging_width_mm NUMERIC(8, 2),
    packaging_height_mm NUMERIC(8, 2),
    packaging_depth_mm NUMERIC(8, 2),
    packaging_weight_kg NUMERIC(6, 2),
    measurement_source TEXT,
    measurement_confidence VARCHAR(50) DEFAULT 'pending_confirmation',
    
    -- Clearance Guidelines (verified)
    clearance_rear_mm NUMERIC(6, 2) DEFAULT 100,
    clearance_sides_mm NUMERIC(6, 2) DEFAULT 100,
    clearance_top_mm NUMERIC(6, 2) DEFAULT 150,
    clearance_notes TEXT,

    -- Commercial Defaults
    mrp NUMERIC(12, 2) NOT NULL,
    default_selling_price NUMERIC(12, 2) NOT NULL,

    -- Verification & Traceability
    verification_status VARCHAR(50) DEFAULT 'pending_confirmation',
    last_verified_at TIMESTAMPTZ,
    
    -- Media
    hero_image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    
    -- Multilingual Translations (Kannada & Hindi)
    translations JSONB DEFAULT '{}'::jsonb,

    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_brand_model_variant UNIQUE(brand_id, model_number, COALESCE(variant, ''))
);

-- 8. Product Sources & Traceability
CREATE TABLE IF NOT EXISTS product_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT,
    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- 'official_manufacturer_page', 'spec_sheet_pdf', 'product_label'
    retrieval_date DATE NOT NULL,
    raw_snippet TEXT,
    confidence NUMERIC(4, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Store-Specific Product Pricing & Offers
CREATE TABLE IF NOT EXISTS store_product_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    mrp NUMERIC(12, 2) NOT NULL,
    selling_price NUMERIC(12, 2) NOT NULL,
    special_offer_title VARCHAR(255),
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    offer_starts_at TIMESTAMPTZ,
    offer_ends_at TIMESTAMPTZ,
    last_updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_store_product_price UNIQUE(store_id, product_id)
);

-- 10. Accessories
CREATE TABLE IF NOT EXISTS accessories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    purpose TEXT,
    usage_instructions TEXT,
    cleaning_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_accessories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
    is_included_in_box BOOLEAN DEFAULT TRUE,
    optional_price NUMERIC(10, 2),
    verification_status VARCHAR(50) DEFAULT 'verified',
    CONSTRAINT unique_prod_acc UNIQUE(product_id, accessory_id)
);

-- 11. Visual Feature Demonstrations
CREATE TABLE IF NOT EXISTS feature_demonstrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    explanation TEXT NOT NULL,
    customer_benefit TEXT NOT NULL,
    operating_mode VARCHAR(100),
    temperature_setting VARCHAR(100),
    steps JSONB DEFAULT '[]'::jsonb,
    safety_notes TEXT,
    official_source TEXT,
    demo_images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Visual Recipes
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    prep_time_minutes INTEGER NOT NULL,
    cooking_time_minutes INTEGER NOT NULL,
    temperature_celsius INTEGER NOT NULL,
    operating_mode VARCHAR(100) NOT NULL,
    servings VARCHAR(50),
    difficulty VARCHAR(50) DEFAULT 'Easy',
    finished_image_url TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    steps JSONB DEFAULT '[]'::jsonb,
    accessories_needed TEXT[] DEFAULT ARRAY[]::TEXT[],
    tips TEXT,
    safety_notes TEXT,
    translations JSONB DEFAULT '{}'::jsonb,
    is_ai_draft BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_compatible_products (
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(recipe_id, product_id)
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization memberships
CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS TABLE (org_id UUID) AS $$
    SELECT organization_id FROM memberships WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Products RLS Policy: Users can view global products OR products belonging to their organization
CREATE POLICY "Users can view accessible products"
    ON products FOR SELECT
    USING (
        organization_id IS NULL OR
        organization_id IN (SELECT get_user_org_ids())
    );

-- Products RLS Policy: Only Org Admins / Content Editors can mutate organization products
CREATE POLICY "Authorized users can modify org products"
    ON products FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM memberships 
            WHERE user_id = auth.uid() 
            AND role IN ('platform_admin', 'org_admin', 'content_editor')
        )
    );

-- Store Prices RLS Policy: Promoters and Managers can see prices for their store
CREATE POLICY "Store users can view prices"
    ON store_product_prices FOR SELECT
    USING (
        store_id IN (
            SELECT s.id FROM stores s
            JOIN memberships m ON m.organization_id = s.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Indexes for lightning fast floor searches
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_model ON products(model_number);
CREATE INDEX IF NOT EXISTS idx_products_org ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
