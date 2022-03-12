import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";

const deviceWidth = Dimensions.get("window").width;
const STORAGE_KEY = "@todos";
const CATEGORY_KEY = "@work";
const TODO_HEIGHT = 60;

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
      [Date.now()]: { text, working, done: false },
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

  const editTodo = (key) => {
    Alert.prompt("Edit title", "Please submit new title", (input) => {
      if (text !== "") {
        const newTodos = { ...todos };
        newTodos[key].text = input;
        saveTodos(newTodos);
        setTodos(newTodos);
      }
    });
  };

  const doneTodo = (key) => {
    const newTodos = { ...todos };
    newTodos[key].done = !newTodos[key].done;
    saveTodos(newTodos);
    setTodos(newTodos);
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
          <Text
            style={{
              ...styles.option,
              color: working ? theme.title : theme.titleInactive,
            }}
          >
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
            style={{
              ...styles.option,
              color: !working ? theme.title : theme.titleInactive,
            }}
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
        <SwipeListView
          useFlatList
          contentContainerStyle={styles.todos}
          data={Object.keys(todos).reduce((result, key) => {
            if (todos[key].working === working) {
              return [...result, { key, text: todos[key].text }];
            } else {
              return [...result];
            }
          }, [])}
          renderItem={(data) => (
            <View style={styles.todo} key={data.item.key}>
              {todos[data.item.key].done ? (
                <Ionicons
                  name="checkbox-outline"
                  size={24}
                  color={theme.doneText}
                  style={{ marginRight: 10 }}
                />
              ) : null}
              <Text
                style={{
                  textDecorationLine: todos[data.item.key].done
                    ? "line-through"
                    : "none",
                  fontSize: 20,
                  color: todos[data.item.key].done
                    ? theme.doneText
                    : theme.text,
                }}
              >
                {data.item.text}
              </Text>
            </View>
          )}
          renderHiddenItem={(data) => (
            <View style={styles.hidden}>
              <View style={styles.hiddenleft}>
                <TouchableOpacity onPress={() => editTodo(data.item.key)}>
                  <View style={styles.hiddenEdit}>
                    <Text>Edit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(data.item.key)}>
                  <View style={styles.hiddenDelete}>
                    <Text>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.hiddenright}>
                <TouchableOpacity onPress={() => doneTodo(data.item.key)}>
                  <View style={styles.hiddenDone}>
                    <Text>
                      {todos[data.item.key].done === false ? "Done" : "To do"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          leftOpenValue={160}
          stopLeftSwipe={160}
          rightOpenValue={-105}
          stopRightSwipe={-105}
        ></SwipeListView>
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
    paddingHorizontal: 50,
    paddingBottom: 20,

    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: theme.bg,
    shadowOpacity: 0.18,
    shadowRadius: 5.0,
    elevation: 1,
  },
  option: {
    fontSize: 30,
    color: theme.title,
  },

  main: { flex: 6 },
  input: {
    height: 50,
    marginHorizontal: 20,
    marginVertical: 30,
    paddingHorizontal: 20,

    backgroundColor: theme.inputBg,
    borderRadius: 10,
    fontSize: 15,

    borderColor: "gainsboro",
    borderStyle: "solid",
    borderWidth: 1,
  },
  todos: {
    paddingHorizontal: deviceWidth * 0.05,
    marginTop: 10,
    paddingBottom: 50,
  },

  todo: {
    height: TODO_HEIGHT,
    marginBottom: 10,
    paddingLeft: 20,
    borderRadius: 10,

    justifyContent: "center",
    fontSize: 40,
    backgroundColor: theme.todoBg,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  hidden: {
    flexDirection: "row",
    height: TODO_HEIGHT,
    borderRadius: 10,
  },

  hiddenleft: {
    flex: 1,
    flexDirection: "row",
  },
  hiddenEdit: {
    width: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "green",
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  hiddenDelete: {
    width: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "red",
    borderWidth: 1,
    borderRadius: 20,
  },

  hiddenright: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  hiddenDone: {
    width: 100,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 5,
  },
});
