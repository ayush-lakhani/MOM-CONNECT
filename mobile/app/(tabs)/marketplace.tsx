import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search, SlidersHorizontal, Globe, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import api from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { useProducts } from '../../hooks/useProducts';
import { useLanguage } from '../../utils/LanguageContext';

// ... imports
const CATEGORIES = ['All', 'Baby Gear', 'Clothes', 'Toys', 'Books', 'Health'];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useProducts();
  const { language, setLanguage, t } = useLanguage();

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category.includes(activeCategory); // Simple match
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleBuy = async (product: any) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 1. Create Order
      const response = await api.post('/payments/create-order', {
        amount: product.price,
        currency: 'INR',
        description: `Buying ${product.name}`
      });

      const { orderId, amount } = response.data;

      // 2. Open Razorpay (Simulated)
      Alert.alert(
        'Razorpay Test Mode',
        `Simulating Payment for Order: ${orderId}\nAmount: ₹${amount / 100}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Pay Success', onPress: () => Alert.alert('Success', 'Payment Verified! Item Sold.') }
        ]
      );

    } catch (error) {
      Alert.alert('Error', 'Could not initiate payment');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.appName}>MomConnect</Text>
            <Text style={styles.screenTitle}>{t('Marketplace', 'बाज़ार')}</Text>
          </View>
          <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
            <Globe size={18} color={COLORS.primary} />
            <Text style={styles.langText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textLight} />
          <TextInput
            placeholder={t('Search cribs, toys...', 'पालना, खिलौने खोजें...')}
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {/* Filter Icon */}
          <View style={styles.filterIcon}>
            <SlidersHorizontal size={18} color={COLORS.primary} />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveCategory(cat);
              }}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Grid */}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredProducts}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }: any) => (
            <ProductCard
              name={item.name}
              price={item.price}
              image={item.image}
              seller={item.seller?.name || 'Mom'}
              onPress={() => console.log('View Product', item._id)}
              onBuy={() => handleBuy(item)}
            />
          )}
          numColumns={2}
          estimatedItemSize={280}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title={t('No Products Found', 'कोई उत्पाद नहीं मिला')}
                message={t('Try adjusting your filters', 'फ़िल्टर बदलने का प्रयास करें')}
              />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => { }}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>

      {/* Sell FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/sell-product');
        }}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={32} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#FAFAFA',
    zIndex: 10,
  },
  topRow: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  langButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
    height: '100%',
  },
  filterIcon: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#F3F4F6',
  },
  catScroll: {
    paddingBottom: 4,
    marginBottom: 10,
  },
  catContent: {
    paddingRight: 20,
    gap: 12,
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  catChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  catTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
