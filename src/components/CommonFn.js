
export const orderSort = function({arr,flag,orderBy=false}){
    arr = arr||[]
    if(arr.length>0 && Object.keys(arr[0]).indexOf(flag)>-1){   //判断是否存在排序字段,比如sordOrder
        arr.sort((objA,objB)=>{
            if(orderBy)
                return objA[flag]>objB[flag]?1:-1
            return objA[flag]<objB[flag]?1:-1
        })
    }
    return arr
}