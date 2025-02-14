import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { books, type Book } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with padding

export default function Index() {
  const [data, setData] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const result = await db.select().from(books);
        console.log("Livres chargés :", result);
        setData(result);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    };
    loadBooks();
  }, []);

  const navigateToDetails = (bookId: number) => {
    router.push(`/bookDetails?id=${bookId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Liste des livres</Text>

      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard}
            onPress={() => navigateToDetails(item.id)}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.bookImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
              <Text style={styles.bookPrice}>{item.prix}€</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => router.push("/addBook")}
      >
        <Image source={require("../../assets/icons/plus.png")} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  listContainer: {
    paddingBottom: 80,
  },
  bookCard: {
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#f5f5f5",
  },
  bookImage: {
    width: "100%",
    height: "100%",
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});
