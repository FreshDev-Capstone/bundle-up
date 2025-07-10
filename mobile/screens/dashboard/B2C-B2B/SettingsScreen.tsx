import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../../context/AuthContext";
import { SettingItem } from "../../../../../shared/types";
import styles from "./SettingsScreen.styles";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change interface coming soon!");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Privacy policy will be displayed here.");
  };

  const handleTermsOfService = () => {
    Alert.alert("Terms of Service", "Terms of service will be displayed here.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete Account",
              "Account deletion feature coming soon!"
            );
          },
        },
      ]
    );
  };

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        {
          key: "notifications",
          label: "Push Notifications",
          type: "toggle" as const,
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
        {
          key: "emailMarketing",
          label: "Email Marketing",
          type: "toggle" as const,
          value: emailMarketing,
          onPress: () => setEmailMarketing(!emailMarketing),
        },
        {
          key: "location",
          label: "Location Services",
          type: "toggle" as const,
          value: locationServices,
          onPress: () => setLocationServices(!locationServices),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          key: "changePassword",
          label: "Change Password",
          type: "action" as const,
          onPress: handleChangePassword,
        },
      ],
    },
    {
      title: "Information",
      items: [
        {
          key: "accountType",
          label: "Account Type",
          type: "info" as const,
          value: user?.accountType || "Unknown",
        },
        {
          key: "privacy",
          label: "Privacy Policy",
          type: "action" as const,
          onPress: handlePrivacyPolicy,
        },
        {
          key: "terms",
          label: "Terms of Service",
          type: "action" as const,
          onPress: handleTermsOfService,
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          key: "deleteAccount",
          label: "Delete Account",
          type: "action" as const,
          onPress: handleDeleteAccount,
          dangerous: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case "toggle":
        return (
          <View key={item.key} style={styles.settingItem}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Switch
              value={Boolean(item.value)}
              onValueChange={item.onPress}
              trackColor={{ false: "#767577", true: "#3498db" }}
              thumbColor={Boolean(item.value) ? "#fff" : "#f4f3f4"}
            />
          </View>
        );

      case "action":
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.settingItem, styles.actionItem]}
            onPress={item.onPress}
          >
            <Text
              style={[
                styles.settingLabel,
                item.dangerous && styles.dangerousLabel,
              ]}
            >
              {item.label}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        );

      case "info":
        return (
          <View key={item.key} style={styles.settingItem}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {settingsGroups.map((group) => (
        <View key={group.title} style={styles.settingGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.groupItems}>
            {group.items.map(renderSettingItem)}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => {
          Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: logout },
          ]);
        }}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
