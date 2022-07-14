import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { width, height } from '../global';
import Spinner from 'react-native-spinkit';
import moment from 'moment';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client/react';
import Toast from 'react-native-simple-toast';
import { dateSlit, FilterDate, sortStatus } from '../Utils';


//Query to the workers Data;
const GET_DATA = gql`
    query {
        workers{
            id,
            name,
            email,
            profession,
            uuid,
            uri,
            status,
            address,
            amount,
            created_at,
            email,
            phone_number,
            ratings,
            status,
            verified,
            current_payment,
            year
        }
    }
`;


const Main = ({navigation}) => {
    
    const {data, loading, error} = useQuery(GET_DATA);
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        setWorkers(c => c = data?.workers);

    }, [loading])


    //Search Function - Get Profession
    const onSearch = (text, arr) => {

        const wordArr = text.split(' ');

        const searchVal = arr.filter(v => {
            const professionArr = v.profession.split(' ');
            return professionArr.join('').toLowerCase() === wordArr.join('').toLowerCase()});
        console.log(searchVal)
        setIsSearch(true)

        setSearch(searchVal);
       

    };
    
    const [search, setSearch] = useState([]); 
    const [isSearch, setIsSearch] = useState(false)
    
    if(error){
        console.log(error);
        Toast.showWithGravity(`${error}`, Toast.LONG, Toast.TOP);
    }


    const filtVer = workers?.filter((item) => item.verified === true);
    const filtNotVer = workers?.filter((item) => item.verified === false);
    const filtAva = workers?.filter((item) => item.status === 'Available');
    const filtOffline = workers?.filter((item) => item.status === 'offline');
    const filtBusy = workers?.filter((item) => item.status === 'busy');

    const [verify, setVerify] = useState(false);
    const [nonverify, setNonverify] = useState(false);
    const [available, setAvailable] = useState(false);
    const [offline, setOffline] = useState(false);
    const [busy, setBusy] = useState(false);

    //OnPress Function for Query Status
    const onPressHandler =(item) => {
        if(item === 'Verified'){
            setVerify(!verify);
            setNonverify(false);
            setAvailable(false);
            setOffline(false)
            setBusy(false);
            setWorkers(c => c = filtVer);
            setIsSearch(false)
        } else if (item === 'Not-Verified'){
            setNonverify(!nonverify);
            setVerify(false);
            setAvailable(false);
            setOffline(false)
            setBusy(false);
            setIsSearch(false)
            setWorkers(c => c = filtNotVer);
        } else if (item === 'Available'){
            setAvailable(!available);
            setVerify(false);
            setNonverify(false);
            setOffline(false)
            setIsSearch(false)
            setBusy(false);
            setWorkers(c => c = filtAva);
        } else if (item === 'Offline'){
            setOffline(!offline)
            setVerify(false);
            setNonverify(false);
            setAvailable(false);
            setBusy(false);
            setIsSearch(false)
            setWorkers(c => c = filtVer);
        } else if (item === 'Busy'){
            setBusy(!busy);
            setVerify(false);
            setNonverify(false);
            setAvailable(false);
            setOffline(false)
            setIsSearch(false)
            setWorkers(c => c = filtBusy);
        }
    }

    
    const getArray = (workers) => {
        return verify == true ? filtVer : nonverify == true ? filtNotVer : 
                available == true ? filtAva : offline == true ? filtOffline :
                busy == true ? filtBusy : isSearch == true ?
                search : workers ;
    };
 

    const filterView = ({item}) => {
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


  return(
      
      <SafeAreaView style={styles.view}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#fcfcfc'} />

            {loading === false  &&
                <View style={styles.container}>
                    <TextInput style={styles.searchInput} 
                    placeholder='Search... e.g Engineer, Driver, Plumber etc.' 
                    placeholderTextColor={'#bbb'}
                    onSubmitEditing={(val) => {
                        onSearch(val.nativeEvent.text, getArray(workers));
                    }}
                    keyboardType={'web-search'}
                    />

                    <View style={styles.view4}>
                        <FlatList
                            data={sortStatus(workers)}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            renderItem={filterView}
                        />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} >
                        {FilterDate(workers)?.map((d, i) => (
                            <View style={styles.view1} key={i}>
                                {dateSlit(d, getArray(workers)).length > 0 ? <Text style={styles.dates}>{ d}</Text> : null}
                                {getArray(workers)?.map((item, index) => (moment(item.created_at).format('LL') == d ?
                                    <TouchableOpacity style={styles.touch} activeOpacity={0.6} onPress={() => navigation.push('infoScreen', {details: item})}>
                                        <View style={styles.view11}>
                                            <Image style={styles.image} source={{uri: item.uri}} /> 
                                            <View style={styles.view12}>
                                                <Text style={styles.title}>{item.name}</Text>
                                                <Text style={styles.content}>{item.profession}</Text>
                                                
                                                <View style={styles.view3}>
                                                    <Text style={{textAlign: 'right', color: 'black', fontSize: 10}}>Ratings: {item.ratings} </Text>
                                                    <Image source={require('../../assets/images/star.png')} style={styles.icon} />
                                
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity> : 
                                    <View key={index} />

                                ))}
                            </View>
                        ))}

                    </ScrollView>
                </View>
            }
            {loading  &&
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center'}]} >
                    <Spinner color='darkblue' type='9CubeGrid' size={100} style={{backgroundColor: '#fcfcfc'}} />
                </View>
            
            }
        </SafeAreaView>
    )
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        width: width,
        padding: 20
    },
    view3:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: -50
    },  
    title:{
        fontSize: 13,
        color: 'black',
        fontWeight: '600'
    },
    content:{
        marginTop: 2,
        fontSize: 11,
        color: '#aaa'
    },
    view4:{
        width: '100%',
        marginVertical: 20

    },
    view:{
        flex: 1,
    },
    filterStyle:{
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#aaa',
        width: width * 0.3,
        elevation: 1,
        backgroundColor:"#fcfcfc",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    filterItem:{
        color: '#aaa',
        fontSize: 12
    },
    row:{
        flexDirection: 'row',
    },
    searchInput:{
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 10,
        fontSize: 12,
        color: '#000',
        marginTop: 20,
    },
    icon:{
        width: 18,
        height: 18,
        marginHorizontal: 10
    },
    view1:{
        padding: 12,
        width: '100%',
        marginBottom: 15
    },
    touch:{
        width: '100%',
        elevation: 1,
        padding: 18,
        borderWidth: 0.6,
        borderColor: "#bbb",
        backgroundColor: '#fcfcfc',
        borderRadius: 10,
        flexDirection: 'row',
        paddingVertical: 20,
        marginBottom: 10
    },
    dates:{
        color: '#aaa',
        fontSize: 11,
        marginBottom: 10
    },
    view11:{
        flexDirection: 'row',
        width: '100%'
    },
    image:{
        width: 50, 
        height: 50,
        borderRadius: 100,
        marginRight: 20
    },
    view12:{
        marginLeft: 15,        
        width: '50%'
    }
})