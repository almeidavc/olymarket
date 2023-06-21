import { FlatList } from 'react-native'
import { PostCategory, PostCategoryTitles } from 'app/utils/enums'
import { TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'

interface CategoryProps {
  selected: boolean
  category: PostCategory
  onPress: () => void
}

const Category = ({ selected, category, onPress }: CategoryProps) => {
  const containerStyles = selected ? 'bg-sky-700' : 'bg-background'
  const textStyles = selected ? 'text-white' : ''

  return (
    <TouchableOpacity
      className={`mr-4 rounded-full px-[16px] py-[14px] ${containerStyles}`}
      onPress={onPress}
    >
      <Text className={textStyles}>{PostCategoryTitles.get(category)}</Text>
    </TouchableOpacity>
  )
}

interface CategoriesListProps {
  selectedCategories: PostCategory[]
  setSelectedCategories: (categories: PostCategory[]) => void
}

export const CategoriesList = ({
  selectedCategories,
  setSelectedCategories,
}: CategoriesListProps) => {
  const onPressCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={Object.keys(PostCategory)}
      keyExtractor={(category) => category}
      renderItem={({ item: category }) => {
        const isSelected = selectedCategories.includes(category)

        return (
          <Category
            selected={isSelected}
            category={category}
            onPress={() => onPressCategory(category)}
          />
        )
      }}
    />
  )
}
