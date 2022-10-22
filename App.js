import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollcontainer}>
      <Button
      onPress={() => {
        alert('You tapped the button!');
      }}
      title="Press Me"
    />
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollcontainer: {
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexProperty: 'flexWrap',
  },
  button: {
    backgroundColor: 'orange',
    alignItems: 'center',
  },
});

export default App;