import { create } from "zustand";

import { DriverStore, Ride, LocationStore, DeviceLocationStore, FromLocationStore,
   ToLocationStore, HospitalStore, AmbulanceStore, AmbulanceMarker, SessionStore,
    MarkerData, PackageStore, ProfileStore, SocketStore, RideStore, 
    AmbulanceMarkersStore} from "@/types/type";
import { Socket } from "socket.io-client";

// export const useLocationStore = create<LocationStore>((set) => ({
//   userLatitude: null,
//   userLongitude: null,
//   userAddress: null,
//   originLatitude: null,
//   originLongitude: null,
//   originAddress: null,
//   destinationLatitude: null,
//   destinationLongitude: null,
//   destinationAddress: null,

//   setUserLocation: ({
//     latitude,
//     longitude,
//     address,
//   }: {
//     latitude: number;
//     longitude: number;
//     address?: string;
//   }) => {
//     set(() => ({
//       userLatitude: latitude,
//       userLongitude: longitude,
//       userAddress: address ?? null,
//     }));

//     // if driver is selected and now new location is set, clear the selected driver
//     const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
//     if (selectedDriver) clearSelectedDriver();
//   },

//   setOriginLocation: ({
//     latitude,
//     longitude,
//     address,
//   }: {
//     latitude: number; 
//     longitude: number;
//     address: string;
//   }) => {
//     set(() => ({
//       originLatitude: latitude,
//       originLongitude: longitude,
//       originAddress: address,
//     }));

//     // if driver is selected and now new location is set, clear the selected driver
//     const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
//     if (selectedDriver) clearSelectedDriver();
    
//   }, 

//   setDestinationLocation: ({
//     latitude,
//     longitude,
//     address,
//   }: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   }) => {
//     set(() => ({
//       destinationLatitude: latitude,
//       destinationLongitude: longitude,
//       destinationAddress: address,
//     }));

//     // if driver is selected and now new location is set, clear the selected driver
//     const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
//     if (selectedDriver) clearSelectedDriver();
    
//   }, 

//     /** 🔥 clears destination only */
//     clearOrigin: () =>
//       set({
//         originLatitude: null,
//         originLongitude: null,
//         originAddress: null,
//     }),
  
//     /** 🔥 clears destination only */
//     clearDestination: () =>
//       set({
//         destinationLatitude: null,
//         destinationLongitude: null,
//         destinationAddress: null,
//     }),


// }));

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
  id: null,
  origin_address: null,
  destination_address: null,
  origin_latitude: null,
  origin_longitude: null,
  destination_latitude: null,
  destination_longitude: null,
  ride_state: null,
  service_type: 3,
  price: null,
  trip_estimate_minutes: null,
  trip_duration_minutes: null,
  pickup_estimate_minutes: null,
  pickup_duration_minutes: null,
  created_at: null,
  description: null,
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




