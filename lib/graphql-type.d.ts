export interface ITableType {
    name: string;
    fields: IFieldType[];
    where?: ICondition[];
}
export interface IFieldType {
    name: string;
}
export interface ICondition {
    key: string;
    value: string;
}
export interface IDBQuery {
    rootTable: ITableType;
}
