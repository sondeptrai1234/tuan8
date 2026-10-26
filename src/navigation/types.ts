export type RootStackParamList = {
  Home: undefined;
  Login: { redirect?: 'Checkout' } | undefined;
  Register: { redirect?: 'Checkout' } | undefined;
  BookDetail: { bookId: number };
  Cart: undefined;
  Checkout: undefined;
};