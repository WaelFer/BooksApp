import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { countries } from "@/data/countries"; 
import { books } from "@/db/schema";
import { db } from "@/db";

// Define the form data type
type BookFormData = {
  title: string;
  author: string;
  country: string | null;
  language: string | null;
  link: string | null;
  pages: number | null;
  publishedDate: number | null;
  prix: number | null;
  image: string;
};

const bookSchema: yup.ObjectSchema<BookFormData> = yup.object({
  title: yup.string().required("Le titre est requis"),
  author: yup.string().required("L'auteur est requis"),
  country: yup.string().nullable().default(null),
  language: yup.string().nullable().default(null),
  link: yup.string().url("Lien invalide").nullable().default(null),
  pages: yup.number().positive().integer().nullable().default(null),
  publishedDate: yup
    .number()
    .typeError("L'année doit être un nombre")
    .integer("L'année doit être un entier")
    .min(1000, "L'année doit être à quatre chiffres")
    .max(new Date().getFullYear(), `L'année ne doit pas dépasser ${new Date().getFullYear()}`)
    .nullable()
    .default(null),
  prix: yup.number().positive().nullable().default(null),
  image: yup.string().required("L'image est requise"),
}).required();

export default function AddBook() {
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      country: null,
      language: null,
      link: null,
      pages: null,
      publishedDate: null,
      prix: null,
      image: '',
    }
  });

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    // Removed initDatabase() call
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      await db.insert(books).values({
        title: data.title,
        author: data.author,
        country: data.country,
        language: data.language,
        link: data.link,
        pages: data.pages,
        publishedDate: data.publishedDate,
        prix: data.prix,
        image: data.image
      });
      
      Alert.alert("Succès", "Le livre a été ajouté avec succès !");
      reset();
      setImageUri(null);
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'ajout du livre.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Ajouter un Livre</Text>

            <View style={styles.imageSection}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                  <>
                    <Image 
                      source={require('../../assets/images/upload.png')} 
                      style={styles.uploadIcon} 
                    />
                    <Text style={styles.imagePickerText}>Choisir une image</Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.image && <Text style={styles.error}>{errors.image.message}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Informations Principales</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.title && styles.inputError]}
                      placeholder="Titre du livre"
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor="#999"
                    />
                    {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="author"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.author && styles.inputError]}
                      placeholder="Auteur"
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor="#999"
                    />
                    {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}
                  </View>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Détails du Livre</Text>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <RNPickerSelect
                      onValueChange={onChange}
                      items={countries}
                      value={value || undefined}
                      placeholder={{ label: "Sélectionner un pays...", value: undefined }}
                      style={pickerSelectStyles}
                    />
                    {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="language"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Langue"
                      onChangeText={onChange}
                      value={value === null ? '' : value}
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="pages"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre de pages"
                      onChangeText={(text) => onChange(text ? parseInt(text) : null)}
                      value={value === null ? '' : value.toString()}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="publishedDate"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Année de publication"
                      onChangeText={(text) => onChange(text ? parseInt(text) : null)}
                      value={value === null ? '' : value.toString()}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prix et Liens</Text>
              <Controller
                control={control}
                name="prix"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Prix"
                      onChangeText={(text) => onChange(text ? parseFloat(text) : null)}
                      value={value === null ? '' : value.toString()}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="link"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Lien"
                      onChangeText={onChange}
                      value={value === null ? '' : value}
                      keyboardType="url"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>Ajouter le Livre</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePicker: {
    width: 150,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#666',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  error: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputAndroid: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
};
