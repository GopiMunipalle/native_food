import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

export function SelectEl({
  countries,
  onSelectCountry,
}: {
  countries: {code: string; name: string; flag: any}[];
  onSelectCountry: (country: any) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const openCountryList = () => {
    setModalVisible(true);
  };

  const handleSelectCountry = (country: any) => {
    onSelectCountry(country);
    setModalVisible(false);
  };

  const renderCountryItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}>
      <View style={styles.countryItemContent}>
        <Image style={styles.countryFlag} source={item.flag} />
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{item.name}</Text>
          <Text style={styles.countryCode}>{item.code}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{alignSelf: 'center', marginBottom: 5}}
        onPress={openCountryList}>
        <FontAwesome6Icon name="sort-down" size={15} color="black" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <FontAwesome6Icon name="xmark" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 120,
    // backgroundColor: 'red',
    padding: 5,
    borderRadius: 8,
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    marginLeft: 5,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
    // flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
    marginLeft: 500,
  },
  countryList: {
    maxHeight: '100%',
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
