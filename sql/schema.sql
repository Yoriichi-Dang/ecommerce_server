CREATE TABLE "authors" (
  "id" integer PRIMARY KEY NOT NULL,
  "name" "character varying(512)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "cart_items" (
  "id" integer PRIMARY KEY NOT NULL,
  "cart_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "price" doubleprecision,
  "quantity" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "carts" (
  "id" integer PRIMARY KEY NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "categories" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" "character varying(55)" NOT NULL,
  "level" integer NOT NULL,
  "url_key" "character varying(51)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "categories_depend" (
  "category_id" integer NOT NULL,
  "level" integer,
  "level_1_id" integer,
  "level_2_id" integer,
  "level_3_id" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "order_details" (
  "id" integer PRIMARY KEY NOT NULL,
  "order_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "price" doubleprecision,
  "quantity" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "orders" (
  "id" integer PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_authors" (
  "product_id" integer,
  "id" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_categories" (
  "product_id" integer,
  "category_id" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_descriptions" (
  "id" integer PRIMARY KEY NOT NULL,
  "description" "character varying(65579)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_highlights" (
  "product_id" integer NOT NULL,
  "name" "character varying(189)" NOT NULL,
  "title" "character varying(16)" NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_images" (
  "id" integer NOT NULL,
  "image_url" "character varying(181)" NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_infos" (
  "id" integer PRIMARY KEY NOT NULL,
  "name" "character varying(295)" NOT NULL,
  "url_key" "character varying(669)",
  "short_url" "character varying(54)" NOT NULL,
  "short_description" "character varying(203)",
  "original_price" integer NOT NULL,
  "thumbnail_url" "character varying(195)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_inventory" (
  "product_id" integer PRIMARY KEY NOT NULL,
  "quantity" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_options" (
  "product_id" integer NOT NULL,
  "code" "character varying(14)" NOT NULL,
  "name" "character varying(71)",
  "label" "character varying(91)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_seller" (
  "product_id" integer NOT NULL,
  "id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "product_specifications_attrs" (
  "product_id" integer NOT NULL,
  "name" "character varying(61)" NOT NULL,
  "code" "character varying(32)" NOT NULL,
  "value" "character varying(11193)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "review_medias" (
  "id" integer PRIMARY KEY NOT NULL,
  "review_id" integer NOT NULL,
  "url" "character varying",
  "type_media" "character varying",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "reviews" (
  "id" integer PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "rating" integer,
  "comment" "character varying",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "sellers" (
  "id" integer PRIMARY KEY NOT NULL,
  "name" "character varying(255)" NOT NULL
);

CREATE TABLE "shipments" (
  "id" integer PRIMARY KEY NOT NULL,
  "status" "character varying",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "users_account" (
  "id" integer PRIMARY KEY NOT NULL,
  "full_name" "character varying",
  "username" "character varying",
  "avatar_url" "character varying",
  "address" "character varying",
  "district" "character varying",
  "province" "character varying",
  "day_of_birth" timestamp,
  "gender" "character varying(6)",
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "users_login_data" (
  "id" integer PRIMARY KEY NOT NULL,
  "phone" "character varying" NOT NULL,
  "email" "character varying" NOT NULL,
  "password_hash" "character varying" NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE INDEX "ix_users_account_id" ON "users_account" USING BTREE ("id");

ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "categories_depend" ADD CONSTRAINT "categories_depend_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_account" ("id");

ALTER TABLE "product_authors" ADD CONSTRAINT "product_authors_id_fkey" FOREIGN KEY ("id") REFERENCES "authors" ("id");

ALTER TABLE "product_authors" ADD CONSTRAINT "product_authors_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_descriptions" ADD CONSTRAINT "product_descriptions_id_fkey" FOREIGN KEY ("id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_highlights" ADD CONSTRAINT "product_highlights_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_images" ADD CONSTRAINT "product_images_id_fkey" FOREIGN KEY ("id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_infos" ADD CONSTRAINT "product_infos_id_fkey" FOREIGN KEY ("id") REFERENCES "product_inventory" ("product_id");

ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_seller" ADD CONSTRAINT "product_seller_id_fkey" FOREIGN KEY ("id") REFERENCES "sellers" ("id");

ALTER TABLE "product_seller" ADD CONSTRAINT "product_seller_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "product_specifications_attrs" ADD CONSTRAINT "product_specifications_attrs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");

ALTER TABLE "review_medias" ADD CONSTRAINT "review_medias_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_infos" ("id");
