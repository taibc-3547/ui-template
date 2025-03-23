-- reverse: create index "unique_roles_users" to table: "roles_users"
DROP INDEX `unique_roles_users`;
-- reverse: create "roles_users" table
DROP TABLE `roles_users`;
-- reverse: create index "unique_collections_products" to table: "collections_products"
DROP INDEX `unique_collections_products`;
-- reverse: create "collections_products" table
DROP TABLE `collections_products`;
-- reverse: create index "unique_categories_products" to table: "categories_products"
DROP INDEX `unique_categories_products`;
-- reverse: create "categories_products" table
DROP TABLE `categories_products`;
-- reverse: create index "unique_images_product_images" to table: "images_product_images"
DROP INDEX `unique_images_product_images`;
-- reverse: create "images_product_images" table
DROP TABLE `images_product_images`;
-- reverse: create index "carts_hash_key" to table: "carts"
DROP INDEX `carts_hash_key`;
-- reverse: create index "carts_id_key" to table: "carts"
DROP INDEX `carts_id_key`;
-- reverse: create "carts" table
DROP TABLE `carts`;
-- reverse: create index "orders_cart_id_key" to table: "orders"
DROP INDEX `orders_cart_id_key`;
-- reverse: create index "orders_id_key" to table: "orders"
DROP INDEX `orders_id_key`;
-- reverse: create "orders" table
DROP TABLE `orders`;
-- reverse: create index "files_id_key" to table: "files"
DROP INDEX `files_id_key`;
-- reverse: create "files" table
DROP TABLE `files`;
-- reverse: create index "users_id_key" to table: "users"
DROP INDEX `users_id_key`;
-- reverse: create "users" table
DROP TABLE `users`;
-- reverse: create index "permissions_id_key" to table: "permissions"
DROP INDEX `permissions_id_key`;
-- reverse: create "permissions" table
DROP TABLE `permissions`;
-- reverse: create index "roles_id_key" to table: "roles"
DROP INDEX `roles_id_key`;
-- reverse: create "roles" table
DROP TABLE `roles`;
-- reverse: create index "collections_name_key" to table: "collections"
DROP INDEX `collections_name_key`;
-- reverse: create index "collections_id_key" to table: "collections"
DROP INDEX `collections_id_key`;
-- reverse: create "collections" table
DROP TABLE `collections`;
-- reverse: create index "categories_slug_key" to table: "categories"
DROP INDEX `categories_slug_key`;
-- reverse: create index "categories_id_key" to table: "categories"
DROP INDEX `categories_id_key`;
-- reverse: create "categories" table
DROP TABLE `categories`;
-- reverse: create index "products_id_key" to table: "products"
DROP INDEX `products_id_key`;
-- reverse: create "products" table
DROP TABLE `products`;
