import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceWidth = Dimensions.get("window").width;
const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const loadTodos = async () => {
    try {
      await AsyncStorage.getItem(STORAGE_KEY).then((value) =>
        setTodos(JSON.parse(value) || {})
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      console.log(todos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

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
      <View style={styles.main}>
        <TextInput
          style={styles.input}
          placeholder={working ? "Write to do..." : "Where do you want to go?"}
          onChangeText={(event) => {
            setText(event);
          }}
          value={text}
          returnKeyType="send"
          onSubmitEditing={async () => {
            const newTodos = {
              ...todos,
              [Date.now()]: { text, working },
            };
            if (text == "") return;
            setTodos(newTodos);
            await saveTodos(newTodos);
            setText("");
          }}
        ></TextInput>
        <ScrollView style={styles.todos}>
          {Object.keys(todos).map((key) =>
            todos[key].working === working ? (
              <View style={styles.todo} key={key}>
                <Text>{todos[key].text}</Text>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
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
  input: {
    backgroundColor: theme.title,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 15,
  },
  todos: { paddingHorizontal: deviceWidth * 0.05, marginTop: 20 },
  todo: {
    backgroundColor: theme.todoBg,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});
