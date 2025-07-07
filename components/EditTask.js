import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Theme } from "./Theme.js";
import { useTheme } from "./ThemeProvider.js";

const EditTask = ({ route, navigation }) => {
  const { colorScheme } = useTheme();
  const { task, updateTaskInList } = route.params;

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const handleUpdate = () => {
    // Create the updated task object
    const updatedTask = { ...task, name, description, dueDate };

    try {
      if (updateTaskInList) {
        updateTaskInList(updatedTask); // Update the parent component's state
      }
      navigation.goBack(); // Navigate back after successful update
    } catch (error) {
      console.error("Error updating task:", error.message);
      console.log("Updated task list:", task);
      console.error("Error", "Failed to update task. Please try again.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorScheme.background }]}
    >
      <Text style={[styles.label, { color: colorScheme.text }]}>Task Name</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colorScheme.secondary },
          { color: colorScheme.text },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Enter task name"
      />
      <Text style={[styles.label, { color: colorScheme.text }]}>
        Description
      </Text>
      <TextInput
        style={[
          styles.input,
          { height: 100, borderColor: colorScheme.secondary },
          { color: colorScheme.text },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline={true}
      />
      <Text style={[styles.label, { color: colorScheme.text }]}>Due Date</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colorScheme.secondary },
          { color: colorScheme.text },
        ]}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Enter due date"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colorScheme.primary },
            { borderColor: colorScheme.primaryRich },
          ]}
          onPress={handleUpdate}
        >
          <Text style={[styles.buttonText, { color: colorScheme.text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colorScheme.primary },
            { borderColor: colorScheme.primaryRich },
          ]}
          onPress={handleUpdate}
        >
          <Text style={[styles.buttonText, { color: colorScheme.text }]}>
            Update
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  label: {
    paddingLeft: "10%",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: "10%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: "10%",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    borderBottomWidth: 5,
    borderRightWidth: 5,
    width: "30%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditTask;
