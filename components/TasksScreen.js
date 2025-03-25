import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tasksData from "./TaskList.json"; // Adjust the path as necessary
import { useTheme } from "./ThemeProvider.js";

const TasksScreen = () => {
  const { colorScheme } = useTheme();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Load tasks from JSON on component mount
  useEffect(() => {
    setTasks(tasksData.tasks);
  }, []);

  const toggleCompletion = (task) => {
    const updatedTasks = tasks.map((t) =>
      t.name === task.name ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTaskName.trim() !== "" && newTaskDueDate.trim() !== "") {
      const newTask = {
        name: newTaskName,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setShowAddTask(false);
    } else {
      Alert.alert("Error", "Task name and due date are required.");
    }
  };

  const handleTaskPress = (task) => {
    navigation.navigate("TaskDetails", { task });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorScheme.background }]}
    >
      <View
        style={[styles.header, { backgroundColor: colorScheme.primaryRich }]}
      >
        <Text style={[styles.title, { color: colorScheme.text }]}>Tasks</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowAddTask(!showAddTask)}
        >
          <View
            style={[
              styles.hexagonInner,
              { backgroundColor: colorScheme.tertiary },
            ]}
          />
          <View
            style={[
              styles.hexagonBefore,
              { borderBottomColor: colorScheme.tertiary },
            ]}
          />
          <View
            style={[
              styles.hexagonAfter,
              { borderTopColor: colorScheme.tertiary },
            ]}
          />
          <AntDesign
            name="plus"
            size={24}
            color={colorScheme.text}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </View>

      {showAddTask && (
        <View style={styles.addTaskSection}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>
            Add Task
          </Text>
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Task Name"
            value={newTaskName}
            onChangeText={setNewTaskName}
          />
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Task Description"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
          />
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Due Date (YYYY-MM-DD)"
            value={newTaskDueDate}
            onChangeText={setNewTaskDueDate}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: colorScheme.primary },
              { color: colorScheme.text },
              { borderBottomWidth: 5 },
              { borderRightWidth: 5 },
              { borderColor: colorScheme.primaryRich },
            ]}
            onPress={addTask}
          >
            <Text style={[styles.addButtonText, { color: colorScheme.text }]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={
          showCompletedTasks
            ? tasks.filter((task) => task.completed)
            : tasks.filter((task) => !task.completed)
        }
        keyExtractor={(item, index) => `${item.name || "task"}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTaskPress(item)}>
            <View style={styles.task}>
              <TouchableOpacity
                onPress={() => toggleCompletion(item)}
                style={styles.completeButton}
              >
                <View
                  style={[
                    styles.hexagonInner,
                    { backgroundColor: colorScheme.tertiaryLite },
                  ]}
                />
                <View
                  style={[
                    styles.hexagonBefore,
                    { borderBottomColor: colorScheme.tertiaryLite },
                  ]}
                />
                <View
                  style={[
                    styles.hexagonAfter,
                    { borderTopColor: colorScheme.tertiaryLite },
                  ]}
                />
                {/* Hexagon shapes unchanged */}
              </TouchableOpacity>
              <View style={styles.taskDetails}>
                <Text
                  style={[
                    styles.taskName,
                    { color: colorScheme.text },
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.taskDescription, { color: colorScheme.text }]}
                >
                  {item.description}
                </Text>
                <Text style={[styles.dueDate, { color: colorScheme.text }]}>
                  Due Date: {item.dueDate}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[
          styles.showCompletedButton,
          { backgroundColor: colorScheme.secondary },
          { borderBottomWidth: 5 },
          { borderRightWidth: 5 },
          { borderColor: colorScheme.secondaryRich },
        ]}
        onPress={() => setShowCompletedTasks(!showCompletedTasks)}
      >
        <Text
          style={[styles.showCompletedButtonText, { color: colorScheme.text }]}
        >
          {showCompletedTasks ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
  },
  plusButton: {
    width: 50,
    height: 29,
    position: "relative",
  },
  hexagonInner: {
    width: "100%",
    height: "100%",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -13,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderTopWidth: 13,
  },
  hexagonBefore: {
    position: "absolute",
    top: -13,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderBottomWidth: 13,
  },
  plusIcon: {
    position: "absolute",
    top: 3,
    left: 14,
  },
  addTaskSection: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "40%",
  },
  addButtonText: {
    fontWeight: "bold",
  },
  task: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginRight: 20,
    paddingBottom: 15,
  },
  taskDetails: {
    flex: 1,
    marginLeft: 20,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    fontStyle: "bold",
  },
  completeButton: {
    width: 50,
    height: 29,
    position: "relative",
  },
  completedTask: {
    textDecorationLine: "line-through",
  },
  showCompletedButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 50,
    width: "60%",
    marginHorizontal: 20,
  },
  showCompletedButtonText: {
    fontWeight: "bold",
  },
});

export default TasksScreen;
