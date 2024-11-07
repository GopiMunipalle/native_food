import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

interface CustomDropdownProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange?: (option: string) => void;
  maxHeight?: number;
}

const DROPDOWN_MAX_HEIGHT = Dimensions.get('window').height * 0.4;

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  maxHeight = DROPDOWN_MAX_HEIGHT,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || placeholder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    onChange?.(option);
    setIsOpen(false);
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[styles.option, selectedOption === item && styles.selectedOption]}
      onPress={() => selectOption(item)}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isOpen && styles.buttonOpen]}
        onPress={toggleDropdown}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.buttonText,
            selectedOption === placeholder && styles.placeholderText,
          ]}>
          {selectedOption}
        </Text>
        <FontAwesome6Icon
          name={isOpen ? 'angle-up' : 'angle-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <SafeAreaView style={[styles.dropdownContent, {maxHeight}]}>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                contentContainerStyle={styles.flatListContent}
              />
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(90),
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  buttonOpen: {
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  dropdownContent: {
    backgroundColor: '#fff',
    width: '100%',
  },
  flatListContent: {
    flexGrow: 1,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown;
