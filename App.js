import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View, Linking, FlatList, Image } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms'; 
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const call = (contact) => {
  const phoneNumber = contact.phoneNumbers?.[0]?.number;
  if (phoneNumber) {
    // Removes non-numeric characters from the phone number if needed
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');

    const link = `tel:${formattedPhoneNumber}`;
    Linking.canOpenURL(link)
      .then(supported => {
        if (supported) {
          Linking.openURL(link);
        } else {
          console.error("Phone call not supported on this device.");
        }
      })
      .catch(err => console.error(err));
  } else {
    console.error("This contact does not have a valid phone number.");
  }
};

// Messaging functionality for users
const message = async (contact) => {
  const phoneNumber = contact.phoneNumbers?.[0]?.number;
  if (phoneNumber) {
    const messageText = " ";
    try {
      await SMS.sendSMSAsync([phoneNumber], messageText);
      console.log("Message sent successfully!");
    } catch (error) {
      console.error("Error sending the message:", error);
    }
  } else {
    console.error("This contact does not have a valid phone number.");
  }
};

const ContactDetailsScreen = ({ route }) => {
  const { contact } = route.params;
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {contact.imageAvailable ? (
        <Image source={{ uri: contact.image.uri }} style={styles.contactImage} />
      ) : (
        <Image source={require('./assets/defaultImg.png')} style={styles.contactImage} />
      )}

      <View style={styles.buttonContainer}>
      <Button onPress={() => call(contact)} title="Call" color="blue" />
      <Button onPress={() => message(contact)} title="Message" color="green" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const ContactItem = ({ item, navigation }) => (
  <View style={styles.item}>
    <Button
      onPress={() => navigation.navigate('ContactDetails', { contact: item })}
      title={item.name}
      color="#333333"
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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Contacts"
          options={{ title: 'Contacts' }}
        >
          {({ navigation }) => (
            <View style={styles.container}>
              <FlatList
                data={contacts}
                renderItem={({ item }) => (
                  <ContactItem item={item} navigation={navigation} />
                )}
                keyExtractor={item => item.id}
              />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ContactDetails"
          component={ContactDetailsScreen}
          options={({ route }) => ({
            title: route.params.contact.name,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#ADD8E6',
    padding: 8,
    width: 275,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 60,
  },
  contactImage: {
    width: 300,
    height: 300,
    borderRadius: 200,
    marginBottom: 120,
  },
});
