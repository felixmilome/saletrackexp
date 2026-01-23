import { create } from "zustand";

import { DriverStore, LocationStore, MarkerData, PackageStore, ProfileStore, SocketStore, RideStore } from "@/types/type";
import { Socket } from "socket.io-client";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  originLatitude: null,
  originLongitude: null,
  originAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address ?? null,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setOriginLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number; 
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      originLatitude: latitude,
      originLongitude: longitude,
      originAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
    
  }, 

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
    
  }, 

    /** 🔥 clears destination only */
    clearOrigin: () =>
      set({
        originLatitude: null,
        originLongitude: null,
        originAddress: null,
    }),
  
    /** 🔥 clears destination only */
    clearDestination: () =>
      set({
        destinationLatitude: null,
        destinationLongitude: null,
        destinationAddress: null,
    }),


}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
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



export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));

export const useRideStore = create<RideStore>((set) => ({
  ride: null,

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





