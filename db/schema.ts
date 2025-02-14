import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const carts = sqliteTable('carts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quantite : integer('quantite'),
  book_id: integer('Book_id')
    .notNull()
    .references(() => books.id),
});

export const books = sqliteTable('books', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    author: text('author').notNull(),
    country: text('country'),
    language: text('language'),
    link: text('link'),
    pages: integer('pages'),
    publishedDate: integer('publishedDate'),
    prix: real('prix'),
    image: text('image').notNull(),
  });

// Export du type pour l'utiliser dans l'application
export type Book = typeof books.$inferSelect;
export type Cart = typeof carts.$inferSelect;
