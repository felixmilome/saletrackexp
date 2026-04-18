import { create } from "zustand";

//socket

import { DriverStore, Ride, LocationStore, DeviceLocationStore, AmbulanceLocationStore, FromLocationStore,
   ToLocationStore, HospitalStore, AmbulanceStore, AmbulanceMarker, SessionStore,
    MarkerData, PackageStore, ProfileStore, SocketStore, RideStore, 
    AmbulanceMarkersStore, MessagesStore, ChatsStore, MyRidesStore} from "@/types/type";
import { Socket } from "socket.io-client";


export const useAmbulanceMarkersStore = create<AmbulanceMarkersStore>((set) => ({
  ambulances: [] as AmbulanceMarker[],
  selectedAmbulance: null,
  setSelectedAmbulance: (id: number) =>
    set(() => ({ selectedAmbulance: id })),
  setAmbulances: (ambulances: AmbulanceMarker[]) => set(() => ({ ambulances })),
  clearSelectedAmbulance: () => set(() => ({ selectedAmbulance: null })),
}));

export const usePackageStore = create<PackageStore>((set) => ({
  packageWeight: null,
  packageDescription: null,

  setPackageWeight: (weight: number) => {
    set(() => ({
      packageWeight: weight,
    }));
  },

  setPackageDescription: (description: string) => {
    set(() => ({
      packageDescription: description,
    }));
  },

  clearPackage: () => {
    set(() => ({
      packageWeight: null,
      packageDescription: null,
    }));
  },
}));


export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,

  setProfile: (data) =>
    set(() => ({
      profile: data,
    })),

  clearProfile: () =>
    set(() => ({
      profile: null,
    })),
}));

export const useHospitalStore = create<HospitalStore>((set) => ({
  hospital: null,

  setHospital: (data) =>
    set(() => ({
      hospital: data,
    })),

  clearHospital: () =>
    set(() => ({
      hospital: null,
    })),
}));

export const useAmbulanceStore = create<AmbulanceStore>((set) => ({
  ambulance: null,

  setAmbulance: (data) =>
    set(() => ({
      ambulance: data,
    })),

  clearAmbulance: () =>
    set(() => ({
      ambulance: null,
    })),
}));


export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));


// Default ride state
const defaultRideState: Ride = {
  // DB fields
  id: null,
  client_id: null,
  rider_id: null,
  hospital_id: null,
  ambulance_id: null,
  pickup_address: null,
  pickup_latitude: null,
  pickup_longitude: null,
  dropoff_address: null,
  dropoff_latitude: null,
  dropoff_longitude: null,
  ride_state: null, // default state
  service_type: null, 
  requested_at: null,
  started_at: null,
  completed_at: null,
  rider_latitude: null,
  rider_longitude: null,
  rider_address: null,
  price: null,
  trip_estimate_minutes: null,
  trip_duration_minutes: null,
  pickup_estimate_minutes: null,
  pickup_duration_minutes: null,
  description: null,

  // Nested convenient objects
  client_data: {
    id: null,
    name: null,
    phone: null,
    image_slug: null,
  },
  driver_data: {
    id: null,
    name: null,
    vehicle_type: null,
    phone: null,
    image_slug: null,
    latitude: null,
    longitude: null,
    address: null,
  },
};

export const useRideStore = create<RideStore>((set) => ({
  ride: defaultRideState,

  setRide: (ride) =>
    set(() => ({ 
      ride,
    })),

  updateRide: (ride) =>
    set((state) => ({
      ride: state.ride ? { ...state.ride, ...ride } : state.ride,
    })),

  clearRide: () =>
    set(() => ({
      ride: null,
    })),
}));

export const useMyRidesStore = create<MyRidesStore>((set) => ({
  myRides: [],

  setMyRides: (myRides) =>
    set(() => ({
      myRides,
    })),

  clearMyRides: () =>
    set(() => ({
      myRides: [],
    })),
}));

export const useSessionStore = create<SessionStore>((set) => ({
  token: null,
  email: null,

  setSession: (token, email) =>
    set(() => ({
      token,
      email,
    })),

  clearSession: () =>
    set(() => ({
      token: null,
      email: null,
    })),
}));

// LOCATION ++++++++++++++++++++++++++++++++++++++++++
export const useDeviceLocationStore = create<DeviceLocationStore>((set) => ({
  deviceLocation: null,

  setDeviceLocation: (loc) =>
    set(() => ({
      deviceLocation: loc,
    })),

  clearDeviceLocation: () =>
    set(() => ({
      deviceLocation: null,
    })),
}));

export const useAmbulanceLocationStore = create<AmbulanceLocationStore>((set) => ({
  ambulanceLocation: null,

  setAmbulanceLocation: (loc) =>
    set(() => ({
      ambulanceLocation: loc, 
    })),

  clearAmbulanceLocation: () =>
    set(() => ({
      ambulanceLocation: null,
    })),
}));

export const useFromLocationStore = create<FromLocationStore>((set) => ({
  fromLocation: null,

  setFromLocation: (loc) =>
    set(() => ({
      fromLocation: loc,
    })),

  clearFromLocation: () =>
    set(() => ({
      fromLocation: null,
    })),
}));

export const useToLocationStore = create<ToLocationStore>((set) => ({
  toLocation: null,

  setToLocation: (loc) =>
    set(() => ({
      toLocation: loc,
    })),

  clearToLocation: () =>
    set(() => ({
      toLocation: null,
    })),
}));


// At the bottom of your zustand file

export const resetAllStores = () => {
  useRideStore.getState().clearRide?.();
  usePackageStore.getState().clearPackage?.();
  useProfileStore.getState().clearProfile?.();
  useHospitalStore.getState().clearHospital?.();
  useAmbulanceStore.getState().clearAmbulance?.();
  useAmbulanceMarkersStore.getState().clearSelectedAmbulance?.();

  useSessionStore.getState().clearSession?.();

  useDeviceLocationStore.getState().clearDeviceLocation?.();
  useFromLocationStore.getState().clearFromLocation?.();
  useToLocationStore.getState().clearToLocation?.();
  useAmbulanceLocationStore.getState().clearAmbulanceLocation?.();
  useMyRidesStore.getInitialState().clearMyRides?.();


  // Clear socket
  useSocketStore.setState({ socket: null });
};


export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],

  setMessages: (messagesArr) => set({ messages: messagesArr }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),
}));

export const useChatsStore = create<ChatsStore>((set) => ({
  chats: [],

  setChats: (chatArr) => set({ chats: chatArr }),

  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  clearChats: () => set({ chats: [] }),
}));