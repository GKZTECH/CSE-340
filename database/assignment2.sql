-- 1. Insert Tony Stark record
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify Tony Stark record to "Admin"
-- Assuming account_id 1 is the Tony Stark record created above
UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_lastname = 'Stark' AND account_firstname = 'Tony';

-- 3. Delete the Tony Stark record
DELETE FROM public.account 
WHERE account_lastname = 'Stark' AND account_firstname = 'Tony';

-- 4. Update GM Hummer description (Replace "small interiors" with "a huge interior")
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Inner Join to select Sport category items
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
INNER JOIN public.classification c 
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update file paths to include "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
