import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { fetchHandler } from "../../utils/fetchingUtils";
import { DashboardStats } from "../../../shared/types";
import styles from "./B2BDashboard.styles";

export default function B2BDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    monthlySpend: 0,
    pendingOrders: 0,
    favoriteProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [data, error] = await fetchHandler(
        "http://localhost:3001/api/dashboard/b2b"
      );

      if (error) {
        console.error("Failed to fetch dashboard data:", error);
        return;
      }

      setStats(
        data || {
          totalOrders: 0,
          monthlySpend: 0,
          pendingOrders: 0,
          favoriteProducts: 0,
        }
      );
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const quickActions = [
    { key: "reorder", label: "Reorder", icon: "🔄" },
    { key: "catalog", label: "Browse Catalog", icon: "📦" },
    { key: "orders", label: "View Orders", icon: "📋" },
    { key: "reports", label: "Reports", icon: "📊" },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#3498db"]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome back, {user?.firstName || "Business User"}!
        </Text>
        <Text style={styles.subtitle}>B2B Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${stats.monthlySpend.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Monthly Spend</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.favoriteProducts}</Text>
            <Text style={styles.statLabel}>Favorite Products</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.key} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>
            Your recent orders and activity will appear here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
