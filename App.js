import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setWorking(true)}>
          <Text style={{ ...styles.option, color: working ? "white" : "grey" }}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWorking(false)}>
          <Text
            style={{ ...styles.option, color: !working ? "white" : "grey" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },

  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 30,
  },
  option: {
    fontSize: 40,
    color: theme.title,
  },

  main: { flex: 5 },
});
