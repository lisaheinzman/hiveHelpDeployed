import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "./ThemeProvider.js";
import eventData from "./EventList.json";

const CalendarScreen = ({ user_id }) => {
  // Accept user_id as a prop
  const { colorScheme } = useTheme();

  // Get the current date in the format 'YYYY-MM-DD'
  const currentDate = "2024-04-11";

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDotColor, setNewEventDotColor] = useState(
    colorScheme.primaryRich
  );
  const [markedDates, setMarkedDates] = useState({});

  const colorOptions = [
    "#FFD6A5",
    "#C9E4DE",
    "#C6DEF1",
    "#DBCDF0",
    "#F2C6DE",
    "#FFADAD",
  ];

  // Event details for different fixed dates

  useEffect(() => {
    setEvents(eventData.events);
  }, []);

  // Marked dates with event details

  const setMarkedDatesAndEvents = async () => {
    const markedDatesObj = {};
    events.forEach((event) => {
      const dates = Array.isArray(event.dateString)
        ? event.dateString
        : [event.dateString];
      dates.forEach((date) => {
        markedDatesObj[date] = {
          marked: true,
          dotColor: colorScheme.primaryRich,
          details: event,
        };
      });
    });
    setMarkedDates(markedDatesObj);
  };
  useEffect(() => {
    if (events.length > 0) {
      setMarkedDatesAndEvents();
    }
  }, [events]);

  const addEventToDatabase = async (event) => {
    try {
      // Create a new event object
      const newEvent = {
        title: newEventTitle,
        description: newEventDescription,
        dateString: newEventDate,
        time: newEventTime,
        dotColor: newEventDotColor,
      };

      // Add the new event to the events array
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // Update marked dates immediately
      const updatedMarkedDates = { ...markedDates };
      const dates = Array.isArray(newEvent.dateString)
        ? newEvent.dateString
        : [newEvent.dateString];
      dates.forEach((date) => {
        updatedMarkedDates[date] = {
          marked: true,
          dotColor: newEvent.dotColor,
          details: newEvent,
        };
      });
      setMarkedDates(updatedMarkedDates);

      // Clear input fields and close the add event modal
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventDate("");
      setNewEventTime("");
      setShowAddEvent(false);
      console.log("Event added:", events);
      // Optionally, update the local state or perform any other action after adding the event
    } catch (error) {
      console.error("Error adding event:", error.message);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorScheme.background }]}
    >
      <View style={[styles.header, { backgroundColor: colorScheme.secondary }]}>
        <Text
          style={[styles.heading, { color: colorScheme.text }]}
          marginLeft={10}
        >
          Calendar
        </Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowAddEvent(!showAddEvent)}
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
      {/* Calendar component with marked dates and onDayPress handler */}
      <View></View>
      <Calendar
        markedDates={markedDates}
        style={styles.Calendar}
        onDayPress={(day) => {
          const selectedDateDetails = markedDates[day.dateString];
          if (selectedDateDetails && selectedDateDetails.details) {
            console.log("Selected date details:", events);
            setSelectedDate(day.dateString); // Set the selected date
            setShowModal(true);
          }
        }}
      />

      {/* Add event */}
      {showAddEvent && (
        <Modal>
          <View
            style={[
              styles.addEventSection,
              { backgroundColor: colorScheme.background },
            ]}
          >
            <Text
              style={[
                styles.heading,
                { backgroundColor: colorScheme.tertiaryRich },
                { marginBottom: 10 },
              ]}
            >
              {" "}
              Create Event
            </Text>
            <Text> Event Title</Text>
            <TextInput
              style={styles.textInput}
              padding={5}
              placeholder="Enter Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <Text>Notes</Text>
            <TextInput
              style={styles.textInput}
              paddingLeft={5}
              paddingTop={5}
              paddingBottom={40}
              placeholder="Enter Notes"
              value={newEventDescription}
              onChangeText={setNewEventDescription}
            />
            <Text>Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD"
              value={newEventDate}
              onChangeText={(text) => setNewEventDate(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="HH:mm"
              value={newEventTime}
              onChangeText={(text) => setNewEventTime(text)}
            />

            <Text>Banner Color</Text>
            <View style={styles.colorOptionsContainer}>
              {colorOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: option,
                      borderColor:
                        option === newEventDotColor ? "black" : "transparent",
                    },
                  ]}
                  onPress={() => setNewEventDotColor(option)}
                />
              ))}
            </View>

            <View style={styles.eventButtons}>
              <TouchableOpacity
                onPress={() => setShowAddEvent(false)}
                style={[
                  styles.backButton,
                  { backgroundColor: colorScheme.tertiary },
                  { borderBottomWidth: 5 },
                  { borderRightWidth: 5 },
                  { borderColor: colorScheme.tertiaryRich },
                ]}
              >
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addEventToDatabase}
                style={[
                  styles.addButton,
                  { backgroundColor: colorScheme.tertiary },
                  { borderBottomWidth: 5 },
                  { borderRightWidth: 5 },
                  { borderColor: colorScheme.tertiaryRich },
                ]}
              >
                <Text>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal component for displaying event details */}
      <Modal
        animationType="none"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={[styles.eventDetails]}>
          <Text
            style={[
              styles.eventHeading,
              { backgroundColor: colorScheme.primary },
            ]}
          >
            {markedDates[selectedDate]?.details?.title}
          </Text>
          <Text style={styles.subheading}>Notes</Text>
          <Text>{markedDates[selectedDate]?.details?.description}</Text>
          <Text style={styles.subheading}>Date</Text>
          <Text> {markedDates[selectedDate]?.details?.dateString}</Text>
          <Text style={styles.subheading}>Time</Text>
          <Text> {markedDates[selectedDate]?.details?.time}</Text>

          <View style={styles.eventButtons}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[
                styles.backButton,
                { backgroundColor: colorScheme.tertiary },
                { borderBottomWidth: 5 },
                { borderRightWidth: 5 },
                { borderColor: colorScheme.tertiaryRich },
                { marginRight: "50%" },
              ]}
            >
              <Text>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: colorScheme.tertiary },
                { borderBottomWidth: 5 },
                { borderRightWidth: 5 },
                { borderColor: colorScheme.tertiaryRich },
              ]}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 30,
    paddingBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
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
  Calendar: {
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: -15,
    borderRadius: 20, // To round the corners
    overflow: "hidden", // Clip the content to the rounded corners
  },
  addEventSection: {
    padding: 200,
    paddingHorizontal: 50,

    align: "center",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "white",
    color: "black",
  },
  addButton: {
    fontSize: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButton: {
    fontSize: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  eventButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventDetails: {
    flex: 1,
    marginTop: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1,
  },
  eventHeading: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    fontSize: 30,
  },
  colorOptionsContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
  },
});

export default CalendarScreen;
