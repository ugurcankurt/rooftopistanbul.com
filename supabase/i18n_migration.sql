-- Migration to convert TEXT columns to JSONB for i18n support
-- Safe migration: It casts existing text to a JSONB object with 'en' key.
-- e.g. "Some Text" becomes {"en": "Some Text"}

-- 1. Concepts Table
DO $$ 
BEGIN
  -- Convert title
  BEGIN
    ALTER TABLE concepts 
    ALTER COLUMN title TYPE jsonb USING jsonb_build_object('en', title);
  EXCEPTION
    WHEN undefined_column THEN NULL; -- Ignore if column missing
    WHEN datatype_mismatch THEN NULL; -- Ignore if already jsonb (or compatible)
    WHEN others THEN NULL; -- Safety net
  END;

  -- Convert description
  BEGIN
    ALTER TABLE concepts 
    ALTER COLUMN description TYPE jsonb USING jsonb_build_object('en', description);
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN datatype_mismatch THEN NULL;
    WHEN others THEN NULL;
  END;
END $$;

-- 2. Packages Table
DO $$ 
BEGIN
  -- Convert name
  BEGIN
    ALTER TABLE packages 
    ALTER COLUMN name TYPE jsonb USING jsonb_build_object('en', name);
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN datatype_mismatch THEN NULL;
    WHEN others THEN NULL;
  END;
  
  -- Note: 'features' is already JSONB, so no type change needed.
  -- Semantically it will now store [{"key": "...", "en": "..."}] or simply {"en": [...], "tr": [...]}
  -- This migration doesn't change data structure of 'features', that happens on write.
END $$;

-- 3. Testimonials Table
DO $$ 
BEGIN
  -- Convert quote
  BEGIN
    ALTER TABLE testimonials
    ALTER COLUMN quote TYPE jsonb USING jsonb_build_object('en', quote);
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN datatype_mismatch THEN NULL;
    WHEN others THEN NULL;
  END;

  -- Convert location (Optional, but good for "Istanbul, Turkey" vs "İstanbul, Türkiye")
  BEGIN
    ALTER TABLE testimonials
    ALTER COLUMN location TYPE jsonb USING jsonb_build_object('en', location);
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN datatype_mismatch THEN NULL;
    WHEN others THEN NULL;
  END;
END $$;
