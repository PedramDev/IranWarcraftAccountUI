export interface IDictionary<Key,Value>{
    key : Key,
    value : Value
}
export interface IList<Key>{
    key : Key
}



export class Dictionary<Key,Value> extends Array<IDictionary<Key,Value>>{
    
}

export class List<Key> extends Array<IList<Key>>{
    
}