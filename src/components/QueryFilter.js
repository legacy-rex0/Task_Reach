const FilterView = ({item}) => {
    return(
        <TouchableOpacity style={[styles.filterStyle, 
            item === 'Available' && available == true ? {borderColor: '#0384fc', elevation: 4 }: 
            item === 'Verified' && verify == true ? {borderColor: '#0384fc', elevation: 4 }: 
            item === 'Not-Verified' && nonverify == true ? {borderColor: '#0384fc', elevation: 4 }: 
            item === 'Offline' && offline == true ? {borderColor: '#0384fc', elevation: 4 }: 
            item === 'Busy' && busy == true ? {borderColor: '#0384fc', elevation: 4 }: 
            
            null]}
            onPress={() => {
                onPressHandler(item)
            }}
        >
            <Text style={styles.filterItem}>{item}</Text>
        </TouchableOpacity>
    );
}

export default FilterView;