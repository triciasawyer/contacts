import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Linking, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';


const call = (contact) => {
  let phoneNumber = contact.phoneNumbers[0].number;
  console.log('phoneNumber:', phoneNumber);
  let link = `tel:${phoneNumber}`
  console.log('link:', link);
  Linking.canOpenURL(link)
    .then(supported => Linking.openURL(link))
    .catch(err => console.error(err));
}

const Item = ({ item }) => (
  <View style={styles.item}>
    <Button
      onPress={() => call(item)}
      title={item.name}
      color="white"
    />
  </View>
);

export default function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        let { data } = await Contacts.getContactsAsync();
        setContacts(data)
      }
    }
    getContacts();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={contacts}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={item => item.id} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 65,
  },
  item: {
    backgroundColor: '#FF0000',
    padding: 10,
    width: 185,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    color: 'black',
    marginBottom: 10,
    fontSize: 35,
  },
});
