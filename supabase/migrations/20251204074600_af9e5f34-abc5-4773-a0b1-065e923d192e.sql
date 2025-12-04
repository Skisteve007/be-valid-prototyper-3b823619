-- Make the affiliate-docs bucket public so ID documents can be viewed by admins
UPDATE storage.buckets 
SET public = true 
WHERE id = 'affiliate-docs';