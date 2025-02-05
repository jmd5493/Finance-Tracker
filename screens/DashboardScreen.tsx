import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // ✅ Import navigation types

// ✅ Define navigation type for Dashboard
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [newTransaction, setNewTransaction] = useState({ description: "", amount: "", type: "Income" });

  useEffect(() => {
    loadTransactions();
  }, []);

  // ✅ Load Transactions from AsyncStorage
  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem("transactions");
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
        calculateTotals(parsedTransactions);
      }
    } catch (error) {
      console.error("❌ Error loading transactions:", error);
    }
  };

  // ✅ Define Transaction Type
  interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "Income" | "Expense";
    date: string;
  }
  
  // ✅ Calculate Balance, Income, and Expenses
  const calculateTotals = (transactions: Transaction[]) => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    setIncome(totalIncome);
    setExpenses(totalExpenses);
    setBalance(totalIncome - totalExpenses);
  };

  // ✅ Handle Adding a New Transaction
  const addTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) {
      Alert.alert("Error", "Please enter a description and amount.");
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount), // Ensure it's a number
      type: newTransaction.type as "Income" | "Expense",
      date: new Date().toLocaleDateString(),
    };

    const updatedTransactions = [...transactions, transaction];

    try {
      await AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      calculateTotals(updatedTransactions);
      setNewTransaction({ description: "", amount: "", type: "Income" }); // Reset input fields
    } catch (error) {
      console.error("❌ Error saving transaction:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile", { user: null })} // ✅ Pass a user parameter
        >
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.balanceText}>Total Balance: ${balance.toFixed(2)}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.incomeText}>Income: ${income.toFixed(2)}</Text>
          <Text style={styles.expenseText}>Expenses: ${expenses.toFixed(2)}</Text>
        </View>
      </View>

      {/* Transaction Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Description"
          value={newTransaction.description}
          onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={newTransaction.amount}
          onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>{item.description} ({item.date})</Text>
            <Text style={[styles.amount, item.type === "Income" ? styles.incomeText : styles.expenseText]}>
              {item.type === "Expense" ? "-" : ""}${item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  profileButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  profileText: { color: "white", fontSize: 16 },
  summaryContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 },
  balanceText: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  incomeText: { fontSize: 18, color: "green", fontWeight: "bold" },
  expenseText: { fontSize: 18, color: "red", fontWeight: "bold" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  transactionItem: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8 },
  transactionText: { fontSize: 16 },
  amount: { fontSize: 16, fontWeight: "bold" },
  inputContainer: { marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 5 },
  addButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center" },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
