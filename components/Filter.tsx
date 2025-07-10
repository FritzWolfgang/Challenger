import { useState } from "react";
import {
  ModalProps,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Modal } from "./Modal";

type Props = ModalProps & {
  isOpen: boolean;
  onPressCancel: () => void;
  onSelect?: (selected: string[]) => void; // Optional callback for selected items
  objects: string[];
  title: string;
};

export const Filter = ({
  isOpen,
  onPressCancel,
  title,
  objects,
  onSelect,
  children,
  ...rest
}: Props) => {
  const [chosenObjects, setChosenObjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredObjects = objects.filter((obj) =>
    obj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleObject = (object: string) => {
    setChosenObjects((prev) =>
      prev.includes(object)
        ? prev.filter((item) => item !== object)
        : [...prev, object]
    );
  };

  return (
    <Modal isOpen={isOpen} withInput={true} title={title}>
      {/* Top bar */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.textInput}
        />
        <Pressable onPress={onPressCancel} style={{ padding: 5 }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {/* List of objects */}
      <ScrollView style={[styles.scrollContainer, { marginTop: 20 }]}>
        {filteredObjects.map((item, index) => {
          const isSelected = chosenObjects.includes(item);
          return (
            <Pressable
              key={index}
              onPress={() => toggleObject(item)}
              style={[
                styles.objectItem,
                {
                  backgroundColor: isSelected ? "#D0F0C0" : "#FFF",
                  borderColor: isSelected ? "green" : "black",
                },
              ]}
            >
              <Text style={styles.objectText}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Select Button */}
      <Pressable
        style={styles.selectButton}
        onPress={() => {
          if (typeof onSelect === "function") {
            onSelect(chosenObjects);
          }
          onPressCancel();
        }}
      >
        <Text style={styles.selectText}>Select</Text>
      </Pressable>

      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    padding: 20,
    maxHeight: "80%",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: "Gabarito",
  },
  scrollContainer: {
    flexGrow: 0,
    maxHeight: 300,
    marginBottom: 20,
  },
  objectItem: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  objectText: {
    fontSize: 18,
    fontFamily: "Gabarito",
  },
  cancelText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Gabarito",
  },
  selectButton: {
    backgroundColor: "#21C513",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  selectText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Gabarito",
  },
});
