export declare type ILinqDb<TDb = any> = (db: TDb) => void;
export declare function gql<TDb = any>(fun: ILinqDb<TDb>): string;
export declare class Lambda<TDb = any> {
    private fun;
    constructor(fun: ILinqDb<TDb>);
    gql(): string;
}
declare global {
    interface Function {
        gql(db?: any): string;
    }
}
export declare const extendFunction: () => void;
