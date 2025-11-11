export type Ride = {
  id: string;
  driverName: string;
  driverCompany?: string;
  driverGender: "female" | "male" | "non-binary";
  origin: string;
  destination: string;
  departure: string;
  seatsLeft: number;
  distanceFromYouKm: number;
  tags?: string[];
};

export const ACTIVE_RIDES: Ride[] = [
  {
    id: "ride-01",
    driverName: "Camille Dupont",
    driverCompany: "Loop HQ",
    driverGender: "female",
    origin: "Montparnasse Station",
    destination: "Renault Technocentre",
    departure: new Date(Date.now() + 1000 * 60 * 35).toISOString(),
    seatsLeft: 2,
    distanceFromYouKm: 1.2,
    tags: ["EV", "Loop Shuttle"],
  },
  {
    id: "ride-02",
    driverName: "Alex Martin",
    driverCompany: "Urban Co-Labs",
    driverGender: "male",
    origin: "Gare de Lyon",
    destination: "Station F",
    departure: new Date(Date.now() + 1000 * 60 * 55).toISOString(),
    seatsLeft: 1,
    distanceFromYouKm: 2.4,
    tags: ["Fast lane"],
  },
  {
    id: "ride-03",
    driverName: "Sophie Bernard",
    driverCompany: "Loop HQ",
    driverGender: "female",
    origin: "Place d'Italie",
    destination: "Renault Design Center",
    departure: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
    seatsLeft: 3,
    distanceFromYouKm: 0.8,
    tags: ["Women drivers"],
  },
  {
    id: "ride-04",
    driverName: "Jamil Rahman",
    driverCompany: "Renault Fleet Partners",
    driverGender: "male",
    origin: "La Défense",
    destination: "Flins Plant",
    departure: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    seatsLeft: 4,
    distanceFromYouKm: 3.2,
    tags: ["Carpool lane"],
  },
  {
    id: "ride-05",
    driverName: "Leïla Haddad",
    driverCompany: "Urban Co-Labs",
    driverGender: "female",
    origin: "Place de la République",
    destination: "Loop HQ",
    departure: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    seatsLeft: 2,
    distanceFromYouKm: 0.6,
    tags: ["Women drivers", "Hybrid"],
  },
];

export const findRideById = (id: string) => ACTIVE_RIDES.find((ride) => ride.id === id);

