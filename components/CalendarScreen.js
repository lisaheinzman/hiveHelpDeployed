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
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.background,
              { backgroundColor: colorScheme.primaryRich },
            ]}
          >
            <View
              style={[
                styles.bottomBackground,
                { backgroundColor: colorScheme.background },
              ]}
            />
          </View>
          <View style={[styles.eventDetails, {}]}>
            <View
              style={[
                styles.eventHeadingWrapper,
                { backgroundColor: colorScheme.primary },
              ]}
            >
              <Text style={[styles.eventHeading, { color: colorScheme.text }]}>
                {markedDates[selectedDate]?.details?.title}
              </Text>
            </View>
            <Text style={[styles.subheading, { color: colorScheme.text }]}>
              Notes
            </Text>
            <Text style={styles.subheadingData}>
              {markedDates[selectedDate]?.details?.description}
            </Text>
            <Text style={styles.subheading}>Date</Text>
            <Text style={styles.subheadingData}>
              {markedDates[selectedDate]?.details?.dateString}
            </Text>
            <Text style={styles.subheading}>Time</Text>
            <Text style={styles.subheadingData}>
              {markedDates[selectedDate]?.details?.time}
            </Text>

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
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 30,
    paddingBottom: 10,
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
    transform: "scale(1.45)",
    transformOrigin: "top center",
    marginTop: 20,
    width: "fit-content",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    border: "1px solid #ccc",
  },
  addEventSection: {
    padding: 100,
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
    paddingTop: "20%",
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20%",
  },
  eventHeadingWrapper: {
    position: "absolute",
    top: 65,
    left: 20,
    width: "90%",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 25,
  },
  eventHeading: {
    fontSize: 30,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
    alignSelf: "flex-start",
    paddingLeft: "10%",
  },
  subheadingData: {
    alignSelf: "flex-start",
    paddingLeft: "30%",
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Push the background views behind the content
  },
  bottomBackground: {
    borderRadius: 20,
    width: "100%",
    paddingVertical: 500,
    position: "absolute",
    top: 100,
  },
});

export default CalendarScreen;
