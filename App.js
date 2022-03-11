import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const deviceWidth = Dimensions.get("window").width;
const STORAGE_KEY = "@todos";
const CATEGORY_KEY = "@work";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const loadTodos = async () => {
    try {
      await AsyncStorage.getItem(STORAGE_KEY).then((value) =>
        setTodos(JSON.parse(value) ?? {})
      );
      await AsyncStorage.getItem(CATEGORY_KEY).then((value) =>
        setWorking(Boolean(JSON.parse(value)) ?? true)
      );
    } catch (error) {
      console.log("loadTodos error:");
      console.log(error);
    }
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.log("saveTodos error:");
      console.log(error);
    }
  };

  const saveCategory = async (boolean) => {
    try {
      await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(boolean));
    } catch (error) {
      console.log("saveCategory error:");
      console.log(error);
    }
  };

  const createTodo = async () => {
    const newTodos = {
      ...todos,
      [Date.now()]: { text, working },
    };
    if (text == "") return;
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const deleteTodo = (key) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Ok",
        style: "destructive",
        onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setWorking(true);
            saveCategory(true);
          }}
        >
          <Text style={{ ...styles.option, color: working ? "white" : "grey" }}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setWorking(false);
            saveCategory(false);
          }}
        >
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
          onSubmitEditing={createTodo}
        ></TextInput>
        <ScrollView style={styles.todos}>
          {Object.keys(todos).map((key) =>
            todos[key].working === working ? (
              <View style={styles.todo} key={key}>
                <Text>{todos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={20} color="black" />
                </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.todoBg,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});
