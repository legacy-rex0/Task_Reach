import moment from "moment"; 
 
 //Getting status from workers data
 export const sortStatus = (data) => {
    let list = [];
    data?.forEach(item => {
        list.push(`${item.status.charAt(0).toUpperCase()}${item.status.substr(1)}`, "Verified", "Not-Verified");
    });

    list = [...new Set(list)]

    list = list.sort();

    return list;
};

export const FilterDate = (data) => {
    let d = [];

    data?.forEach(item => {
        d.push(moment(item.created_at).format('LL'));
    });
    
    d = [...new Set(d)];
    d = d.sort();
    // console.log(d)
    return d;
};

export const dateSlit = (val, arr) => {
    const filt = arr.filter(v => moment(v.created_at).format('LL') == val);
    console.log(filt);
    return filt;
};


const newFilterData = (data) => {
    let date = FilterDate(data);

}