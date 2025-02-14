import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { books, type Book } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { BlurView } from 'expo-blur';
import { DEFAULT_BOOK_IMAGE } from './constants';

const { width } = Dimensions.get('window');

export default function BookDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      try {
        const result = await db.select().from(books).where(eq(books.id, Number(id)));
        if (result.length > 0) {
          setBook(result[0]);
        }
      } catch (error) {
        console.error('Error loading book:', error);
      }
    };
    loadBook();
  }, [id]);

  const handleLinkPress = async () => {
    if (book?.link) {
      try {
        await Linking.openURL(book.link);
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Handle relative image paths
  const imageUri = book.image.startsWith('http') 
    ? book.image 
    : DEFAULT_BOOK_IMAGE;

  return (
    <>
      <Stack.Screen 
        options={{
          title: book.title,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerBackVisible: true,
          headerTitle: () => null
        }} 
      />
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.coverImage} 
            resizeMode="cover" 
          />
          <BlurView intensity={100} tint="dark" style={styles.blurOverlay}>
            <Image 
              source={{ uri: imageUri }}
              style={styles.smallCover} 
              resizeMode="contain" 
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
            </View>
          </BlurView>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pays</Text>
              <Text style={styles.infoValue}>{book.country || 'Non spécifié'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Langue</Text>
              <Text style={styles.infoValue}>{book.language || 'Non spécifié'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pages</Text>
              <Text style={styles.infoValue}>{book.pages || 'Non spécifié'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Année</Text>
              <Text style={styles.infoValue}>{book.publishedDate || 'Non spécifié'}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{book.prix}€</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Acheter</Text>
            </TouchableOpacity>
          </View>

          {book.link && (
            <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
              <Text style={styles.linkButtonText}>Plus d'informations</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  smallCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#fff',
  },
  detailsContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  buyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  linkButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
});
