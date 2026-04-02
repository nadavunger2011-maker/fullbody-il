UPDATE blog_posts SET image = CASE category_id
  WHEN 'fitness' THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop'
  WHEN 'nutrition' THEN 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop'
  WHEN 'weight' THEN 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=450&fit=crop'
  WHEN 'recipes' THEN 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=450&fit=crop'
  WHEN 'wellness' THEN 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop'
END WHERE image LIKE '%placeholder%';