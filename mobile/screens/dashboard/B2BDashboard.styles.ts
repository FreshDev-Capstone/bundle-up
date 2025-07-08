import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7f8c8d",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  actionsContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
    textAlign: "center",
  },
  recentSection: {
    padding: 20,
  },
  activityCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  activityText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    fontStyle: "italic",
  },
});
