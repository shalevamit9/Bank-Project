export interface IAccountFormatter<T, S> {
    formatAccount(account: T): S;
}
