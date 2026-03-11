import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import type { Address, Order, OrderWithItems } from '@bundle-up/shared-types';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const emptyAddress = {
  label: '',
  street_line1: '',
  street_line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  is_default: false,
};

export function ProfileScreen({ navigation }: Props) {
  const { user, profile, businessAccount } = useAuthStore();
  const { clearCart, addItem } = useCartStore();

  const [accountDraft, setAccountDraft] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    tax_id: '',
    billing_email: '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [passwordDraft, setPasswordDraft] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [reorderingOrderId, setReorderingOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isBusiness = user?.role === 'business';

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    setAccountDraft({
      email: user.email ?? '',
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      phone: profile?.phone ?? '',
      company_name: businessAccount?.company_name ?? '',
      tax_id: businessAccount?.tax_id ?? '',
      billing_email: businessAccount?.billing_email ?? '',
    });

    async function load() {
      setLoading(true);
      const [addressesRes, ordersRes] = await Promise.all([apiClient.getAddresses(), apiClient.getOrders()]);
      if (addressesRes.success) setAddresses(addressesRes.data);
      if (ordersRes.success) setOrders(ordersRes.data.data);
      setLoading(false);
    }

    load();
  }, [businessAccount, navigation, profile, user]);

  const canSaveAccount = useMemo(
    () => Boolean(accountDraft.email && accountDraft.first_name && accountDraft.last_name),
    [accountDraft],
  );

  async function handleSaveAccount() {
    if (!canSaveAccount) return;

    setSavingAccount(true);
    setMessage(null);
    const res = await apiClient.updateMe({
      email: accountDraft.email,
      first_name: accountDraft.first_name,
      last_name: accountDraft.last_name,
      phone: accountDraft.phone,
      company_name: isBusiness ? accountDraft.company_name : undefined,
      tax_id: isBusiness ? accountDraft.tax_id : undefined,
      billing_email: isBusiness ? accountDraft.billing_email : undefined,
    });

    setMessage(res.success ? 'Account information updated.' : res.message);
    setSavingAccount(false);
  }

  async function reloadAddresses() {
    const res = await apiClient.getAddresses();
    if (res.success) setAddresses(res.data);
  }

  async function handleSaveAddress() {
    if (!addressDraft.street_line1 || !addressDraft.city || !addressDraft.state || !addressDraft.zip) {
      setMessage('Street, city, state, and ZIP are required.');
      return;
    }

    setSavingAddress(true);
    setMessage(null);

    const payload = {
      label: addressDraft.label || null,
      street_line1: addressDraft.street_line1,
      street_line2: addressDraft.street_line2 || null,
      city: addressDraft.city,
      state: addressDraft.state,
      zip: addressDraft.zip,
      country: addressDraft.country,
      is_default: addressDraft.is_default,
    };

    const res = editingAddressId
      ? await apiClient.updateAddress(editingAddressId, payload)
      : await apiClient.createAddress(payload);

    if (res.success) {
      setAddressDraft(emptyAddress);
      setEditingAddressId(null);
      await reloadAddresses();
      setMessage(editingAddressId ? 'Address updated.' : 'Address added.');
    } else {
      setMessage(res.message);
    }

    setSavingAddress(false);
  }

  async function handleChangePassword() {
    setMessage(null);
    if (passwordDraft.new_password !== passwordDraft.confirm_password) {
      setMessage('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    const res = await apiClient.changePassword({
      current_password: passwordDraft.current_password,
      new_password: passwordDraft.new_password,
    });

    if (res.success) {
      setPasswordDraft({ current_password: '', new_password: '', confirm_password: '' });
      setMessage('Password updated successfully.');
    } else {
      setMessage(res.message);
    }

    setSavingPassword(false);
  }

  function startEditAddress(address: Address) {
    setEditingAddressId(address.id);
    setAddressDraft({
      label: address.label ?? '',
      street_line1: address.street_line1,
      street_line2: address.street_line2 ?? '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
  }

  async function handleDeleteAddress(id: number) {
    const res = await apiClient.deleteAddress(id);
    if (res.success) {
      await reloadAddresses();
      setMessage('Address deleted.');
    } else {
      setMessage(res.message);
    }
  }

  async function handleReorder(orderId: number) {
    setReorderingOrderId(orderId);
    setMessage(null);

    const orderRes = await apiClient.getOrder(orderId);
    if (!orderRes.success) {
      setMessage(orderRes.message);
      setReorderingOrderId(null);
      return;
    }

    const order = orderRes.data as OrderWithItems;
    await clearCart();
    for (const item of order.items) {
      await addItem(item.product_id, item.quantity);
    }

    setMessage('Items from that order were added to your cart.');
    setReorderingOrderId(null);
    navigation.navigate('Cart');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <TextInput style={styles.input} placeholder="Email" value={accountDraft.email} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, email: value }))} />
        <TextInput style={styles.input} placeholder="First Name" value={accountDraft.first_name} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, first_name: value }))} />
        <TextInput style={styles.input} placeholder="Last Name" value={accountDraft.last_name} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, last_name: value }))} />
        <TextInput style={styles.input} placeholder="Phone" value={accountDraft.phone} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, phone: value }))} />

        {isBusiness ? (
          <>
            <TextInput style={styles.input} placeholder="Company Name" value={accountDraft.company_name} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, company_name: value }))} />
            <TextInput style={styles.input} placeholder="Tax ID" value={accountDraft.tax_id} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, tax_id: value }))} />
            <TextInput style={styles.input} placeholder="Billing Email" value={accountDraft.billing_email} onChangeText={(value) => setAccountDraft((prev) => ({ ...prev, billing_email: value }))} />
          </>
        ) : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveAccount} disabled={!canSaveAccount || savingAccount}>
          {savingAccount ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Account Changes</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Addresses</Text>
        <Text style={styles.helperText}>Label helps identify an address later (for example: Home, Office, Warehouse).</Text>
        {addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <Text style={styles.addressLabel}>{address.label || 'Address'}</Text>
            <Text style={styles.addressText}>{address.street_line1}</Text>
            {address.street_line2 ? <Text style={styles.addressText}>{address.street_line2}</Text> : null}
            <Text style={styles.addressText}>{address.city}, {address.state} {address.zip}</Text>

            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => startEditAddress(address)}>
                <Text style={styles.secondaryButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handleDeleteAddress(address.id)}>
                <Text style={styles.secondaryButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.subTitle}>{editingAddressId ? 'Edit Address' : 'Add Address'}</Text>
        <TextInput style={styles.input} placeholder="Label (Home, Office, etc.)" autoComplete="off" value={addressDraft.label} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, label: value }))} />
        <TextInput style={styles.input} placeholder="Street Line 1" autoComplete="street-address" value={addressDraft.street_line1} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, street_line1: value }))} />
        <TextInput style={styles.input} placeholder="Street Line 2" autoComplete="street-address" value={addressDraft.street_line2} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, street_line2: value }))} />
        <TextInput style={styles.input} placeholder="City" autoComplete="off" value={addressDraft.city} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, city: value }))} />
        <TextInput style={styles.input} placeholder="State" autoComplete="off" value={addressDraft.state} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, state: value }))} />
        <TextInput style={styles.input} placeholder="ZIP" autoComplete="postal-code" value={addressDraft.zip} onChangeText={(value) => setAddressDraft((prev) => ({ ...prev, zip: value }))} />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveAddress} disabled={savingAddress}>
          {savingAddress ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{editingAddressId ? 'Update Address' : 'Save Address'}</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          autoComplete="password"
          value={passwordDraft.current_password}
          onChangeText={(value) => setPasswordDraft((prev) => ({ ...prev, current_password: value }))}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          autoComplete="new-password"
          value={passwordDraft.new_password}
          onChangeText={(value) => setPasswordDraft((prev) => ({ ...prev, new_password: value }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          autoComplete="new-password"
          value={passwordDraft.confirm_password}
          onChangeText={(value) => setPasswordDraft((prev) => ({ ...prev, confirm_password: value }))}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword} disabled={savingPassword}>
          {savingPassword ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Update Password</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {orders.length === 0 ? <Text style={styles.emptyNote}>No orders yet.</Text> : null}

        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <Text style={styles.orderNumber}>{order.order_number}</Text>
              <Text style={styles.orderStatus}>{order.status}</Text>
            </View>
            <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>{formatPrice(Number(order.total))}</Text>

            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('OrderDetail', { id: order.id })}>
                <Text style={styles.secondaryButtonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handleReorder(order.id)} disabled={reorderingOrderId === order.id}>
                <Text style={styles.secondaryButtonText}>{reorderingOrderId === order.id ? 'Reordering...' : 'Reorder'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 32, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  message: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', color: '#15803d', borderRadius: 8, padding: 10 },
  section: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, backgroundColor: '#fff', padding: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginTop: 8, marginBottom: 6 },
  helperText: { color: '#6b7280', fontSize: 12, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: '#111827',
    backgroundColor: '#fff',
  },
  primaryButton: { backgroundColor: '#16a34a', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  secondaryButtonText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  addressCard: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 },
  addressLabel: { fontWeight: '700', color: '#111827' },
  addressText: { color: '#4b5563', fontSize: 13 },
  rowActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  emptyNote: { color: '#6b7280' },
  orderCard: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginTop: 8 },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontWeight: '700', color: '#111827' },
  orderStatus: { color: '#2563eb', textTransform: 'capitalize', fontSize: 12 },
  orderDate: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  orderTotal: { color: '#111827', fontWeight: '700', marginTop: 2 },
});
