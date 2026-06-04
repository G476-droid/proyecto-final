import { Species } from "../services/speciesService";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;

  CreateSpecies: undefined;

  Detail: {
    species: Species;
  };

  Map: undefined;

  Profile: undefined;
};