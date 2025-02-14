import { books, carts } from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'; 
import AsyncStorage from 'expo-sqlite/kv-store';

// Cette fonction ajoute des données fictives dans la base de données
export const addDummyData = async (db: ExpoSQLiteDatabase) => {
const value = AsyncStorage.getItemSync('dbInitialized');
if (value) return;
console.log('Inserting lists');

await db.insert(books).values([{
    author: "Chinua Achebe",
    country: "Nigeria",
    image: '../assets/images/things-fall-apart.jpg',
    language: "English",
    link: "https://en.wikipedia.org/wiki/Things_Fall_Apart\n",
    pages: 209,
    title: "Things Fall Apart",
    publishedDate: 1958,
    prix: 150
},
{
    author: "Hans Christian Andersen",
    country: "Denmark",
    image: '../assets/images/fairy-tales.jpg',
    language: "Danish",
    link: "https://en.wikipedia.org/wiki/Fairy_Tales_Told_for_Children._First_Collection.\n",
    pages: 784,
    title: "Fairy tales",
    publishedDate: 1836,      
    prix: 150
},
{
    author: "Dante Alighieri",
    country: "Italy",
    image: '../assets/images/the-divine-comedy.jpg',
    language: "Italian",
    link: "https://en.wikipedia.org/wiki/Divine_Comedy\n",
    pages: 928,
    title: "The Divine Comedy",
    publishedDate: 1315,
    prix: 150
}]);

await db.insert(carts).values ( [
{ quantite: 1, book_id: 1 },
{ quantite: 2, book_id: 2 },
{ quantite: 3, book_id: 3 },
]);

AsyncStorage.setItemSync('dbInitialized', 'true');

console.log('Dummy data inserted');

};