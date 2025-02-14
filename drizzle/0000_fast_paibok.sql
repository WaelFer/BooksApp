CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`country` text,
	`language` text,
	`link` text,
	`pages` integer,
	`publishedDate` integer,
	`prix` real,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quantite` integer,
	`Book_id` integer NOT NULL,
	FOREIGN KEY (`Book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
