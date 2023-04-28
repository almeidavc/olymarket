import { View } from 'app/design/view'
import * as ImagePicker from 'expo-image-picker'
import { Button } from 'react-native'
import { useState } from 'react'
import { Image } from 'app/design/image'

export function CreatePostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {imageUri && <Image className="h-48 w-48" source={{ uri: imageUri }} />}
      <Button title="Create post" onPress={() => {}} />
    </View>
  )
}
