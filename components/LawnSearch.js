import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Appbar, Text, Searchbar, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LawnSearch = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const movies = [
    { title: 'Stree 2', language: 'Hindi', image: 'stree2_poster_url' },
    { title: 'Thalapathy Is The G.O.A.T', language: 'Hindi', image: 'thalapathy_poster_url' },
    { title: 'Khel Khel Mein', language: 'Hindi', image: 'khel_poster_url' },
    { title: 'Joker: Folie A Deux', language: 'English', image: 'joker_poster_url' },
    { title: 'Tumbbad', language: 'Hindi', image: 'tumbbad_poster_url' },
    { title: 'Yudhra', language: 'Hindi', image: 'yudhra_poster_url' },
    { title: 'Thangalaan', language: 'Hindi', image: 'thangalaan_poster_url' },
  ];

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {/* AppBar with Back Arrow */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{ borderRadius: 0, width: "85%" }}
        />
      </Appbar.Header>

      {/* Movie List */}
      <ScrollView>
        {movies.map((movie, index) => (
          <List.Item
            key={index}
            title={<Text>{movie.title}</Text>}  // Wrapped title in <Text>
            description={<Text>{movie.language}</Text>}  // Wrapped description in <Text>
            left={() => (
              <Image 
                source={{ uri: movie.image }} 
                style={{ width: 50, height: 70 }} 
              />
            )}
            right={() => <Text style={{ alignSelf: 'center' }}>A</Text>}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default LawnSearch;
