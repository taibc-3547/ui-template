-- create "products" table
CREATE TABLE `products` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `slug` text NULL, `description` text NULL, `for_sale` bool NULL, `best_selling` bool NULL, `price` integer NULL, `content` text NULL, `featured_image_id` integer NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `product_featured_image_id` FOREIGN KEY (`featured_image_id`) REFERENCES `files` (`id`) ON DELETE SET NULL);
-- create index "products_id_key" to table: "products"
CREATE UNIQUE INDEX `products_id_key` ON `products` (`id`);
-- create "categories" table
CREATE TABLE `categories` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `slug` text NOT NULL, `description` text NULL, `image_id` integer NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `category_image_id` FOREIGN KEY (`image_id`) REFERENCES `files` (`id`) ON DELETE SET NULL);
-- create index "categories_id_key" to table: "categories"
CREATE UNIQUE INDEX `categories_id_key` ON `categories` (`id`);
-- create index "categories_slug_key" to table: "categories"
CREATE UNIQUE INDEX `categories_slug_key` ON `categories` (`slug`);
-- create "collections" table
CREATE TABLE `collections` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL);
-- create index "collections_id_key" to table: "collections"
CREATE UNIQUE INDEX `collections_id_key` ON `collections` (`id`);
-- create index "collections_name_key" to table: "collections"
CREATE UNIQUE INDEX `collections_name_key` ON `collections` (`name`);
-- create "roles" table
CREATE TABLE `roles` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `description` text NULL, `root` bool NULL, `rule` text NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL);
-- create index "roles_id_key" to table: "roles"
CREATE UNIQUE INDEX `roles_id_key` ON `roles` (`id`);
-- create "permissions" table
CREATE TABLE `permissions` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `role_id` integer NOT NULL, `resource` text NOT NULL, `value` text NOT NULL, `modifier` json NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION);
-- create index "permissions_id_key" to table: "permissions"
CREATE UNIQUE INDEX `permissions_id_key` ON `permissions` (`id`);
-- create "users" table
CREATE TABLE `users` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `username` text NOT NULL, `email` text NULL, `password` text NULL, `active` bool NULL, `provider` text NULL, `provider_id` text NULL, `provider_username` text NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL);
-- create index "users_id_key" to table: "users"
CREATE UNIQUE INDEX `users_id_key` ON `users` (`id`);
-- create "files" table
CREATE TABLE `files` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `disk` text NOT NULL, `name` text NOT NULL, `path` text NOT NULL, `type` text NOT NULL, `size` integer NOT NULL, `user_id` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `file_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION);
-- create index "files_id_key" to table: "files"
CREATE UNIQUE INDEX `files_id_key` ON `files` (`id`);
-- create "orders" table
CREATE TABLE `orders` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `hash` text NOT NULL, `name` text NOT NULL, `email` text NOT NULL, `country` text NOT NULL, `city` text NOT NULL, `address` text NOT NULL, `phone` text NOT NULL, `delivery_method` text NOT NULL, `currency` text NOT NULL, `subtotal` real NOT NULL, `total` real NOT NULL, `tax` real NULL, `delivery_fee` real NULL, `status` text NOT NULL, `cart_id` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE NO ACTION);
-- create index "orders_id_key" to table: "orders"
CREATE UNIQUE INDEX `orders_id_key` ON `orders` (`id`);
-- create index "orders_cart_id_key" to table: "orders"
CREATE UNIQUE INDEX `orders_cart_id_key` ON `orders` (`cart_id`);
-- create "carts" table
CREATE TABLE `carts` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `hash` text NULL, `detail` text NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL);
-- create index "carts_id_key" to table: "carts"
CREATE UNIQUE INDEX `carts_id_key` ON `carts` (`id`);
-- create index "carts_hash_key" to table: "carts"
CREATE UNIQUE INDEX `carts_hash_key` ON `carts` (`hash`);
-- create "images_product_images" table
CREATE TABLE `images_product_images` (`product_images` integer NOT NULL, `images` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `images_product_images_images` FOREIGN KEY (`images`) REFERENCES `files` (`id`) ON DELETE CASCADE, CONSTRAINT `images_product_images_product_images` FOREIGN KEY (`product_images`) REFERENCES `products` (`id`) ON DELETE CASCADE);
-- create index "unique_images_product_images" to table: "images_product_images"
CREATE UNIQUE INDEX `unique_images_product_images` ON `images_product_images` (`images`, `product_images`);
-- create "categories_products" table
CREATE TABLE `categories_products` (`categories` integer NOT NULL, `products` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `categories_products_categories` FOREIGN KEY (`categories`) REFERENCES `categories` (`id`) ON DELETE CASCADE, CONSTRAINT `categories_products_products` FOREIGN KEY (`products`) REFERENCES `products` (`id`) ON DELETE CASCADE);
-- create index "unique_categories_products" to table: "categories_products"
CREATE UNIQUE INDEX `unique_categories_products` ON `categories_products` (`categories`, `products`);
-- create "collections_products" table
CREATE TABLE `collections_products` (`collections` integer NOT NULL, `products` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `collections_products_collections` FOREIGN KEY (`collections`) REFERENCES `collections` (`id`) ON DELETE CASCADE, CONSTRAINT `collections_products_products` FOREIGN KEY (`products`) REFERENCES `products` (`id`) ON DELETE CASCADE);
-- create index "unique_collections_products" to table: "collections_products"
CREATE UNIQUE INDEX `unique_collections_products` ON `collections_products` (`collections`, `products`);
-- create "roles_users" table
CREATE TABLE `roles_users` (`users` integer NOT NULL, `roles` integer NOT NULL, `created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), `updated_at` datetime NULL, `deleted_at` datetime NULL, CONSTRAINT `roles_users_roles` FOREIGN KEY (`roles`) REFERENCES `roles` (`id`) ON DELETE CASCADE, CONSTRAINT `roles_users_users` FOREIGN KEY (`users`) REFERENCES `users` (`id`) ON DELETE CASCADE);
-- create index "unique_roles_users" to table: "roles_users"
CREATE UNIQUE INDEX `unique_roles_users` ON `roles_users` (`roles`, `users`);
