export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;

  Detail: {
    id?: string;
    title?: string;
    description?: string;
    name?: string;
  };

  CreateSpecies: undefined;
  Map: undefined;
  Profile: undefined;
};