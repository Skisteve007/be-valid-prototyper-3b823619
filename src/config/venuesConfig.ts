export interface VenueDetails {
  name: string;
  address: string;
  phone_number: string;
  map_link: string;
}

export interface CityVenues {
  city: string;
  venues: VenueDetails[];
}

// Helper to generate OpenStreetMap search URL
const osmUrl = (query: string) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;

export const venuesConfig: CityVenues[] = [
  {
    city: 'Bogotá',
    venues: [
      {
        name: 'Theatron',
        address: 'Cl. 58 #10-32, Chapinero',
        phone_number: '+57 322 3617300',
        map_link: osmUrl('Theatron Cl. 58 #10-32 Bogotá Colombia')
      },
      {
        name: 'Armando Records',
        address: 'Cl. 85 #14-46, Chapinero',
        phone_number: '+57 310 8731720',
        map_link: osmUrl('Armando Records Cl. 85 #14-46 Bogotá Colombia')
      },
      {
        name: 'Baum',
        address: 'Cl. 33 #6-24, Teusaquillo',
        phone_number: '+57 312 2167448',
        map_link: osmUrl('Baum Cl. 33 #6-24 Bogotá Colombia')
      },
      {
        name: 'Casa Quiebra-Canto',
        address: 'Cra. 5 #17-76, Bogotá',
        phone_number: '+57 601 243 16 30',
        map_link: osmUrl('Casa Quiebra-Canto Cra. 5 #17-76 Bogotá Colombia')
      }
    ]
  },
  {
    city: 'Medellín',
    venues: [
      {
        name: 'La House Provenza',
        address: 'Cra. 35 #8A - 31',
        phone_number: '+57 310 499 4804',
        map_link: osmUrl('La House Provenza Cra. 35 #8A-31 Medellín Colombia')
      },
      {
        name: 'Envy Rooftop',
        address: 'Cl. 9A #37-16',
        phone_number: '+57 4444 968 121',
        map_link: osmUrl('Envy Rooftop Cl. 9A #37-16 Medellín Colombia')
      },
      {
        name: 'Salón Amador',
        address: 'Cl 10 #40-30',
        phone_number: '+57 310 526 0880',
        map_link: osmUrl('Salón Amador Cl 10 #40-30 Medellín Colombia')
      },
      {
        name: '360 Rooftop bar',
        address: 'Cl 10A #36-29',
        phone_number: '+57 312 627 3647',
        map_link: osmUrl('360 Rooftop bar Cl 10A #36-29 Medellín Colombia')
      },
      {
        name: 'Gusto Night Club',
        address: 'Calle 9 A #38-26, Parque Lleras',
        phone_number: '+57 324 674 9484',
        map_link: osmUrl('Gusto Night Club Calle 9A Medellín Colombia')
      },
      {
        name: 'Sonorama Club',
        address: 'Cra. 37 #10-37',
        phone_number: '+57 305 333 3903',
        map_link: osmUrl('Sonorama Club Cra. 37 #10-37 Medellín Colombia')
      },
      {
        name: 'Dulce Jesús Mio',
        address: 'Cr. 38 #19-150, El Poblado',
        phone_number: '+57 312 8585934',
        map_link: osmUrl('Dulce Jesús Mio Cr. 38 #19-150 Medellín Colombia')
      },
      {
        name: 'The Blue',
        address: 'Cl. 10 #40-20, El Poblado',
        phone_number: '+57 310 8943210',
        map_link: osmUrl('The Blue Cl. 10 #40-20 Medellín Colombia')
      },
      {
        name: 'Vintrash',
        address: 'Cr. 36 #8a-39, El Poblado',
        phone_number: '+57 301 7894560',
        map_link: osmUrl('Vintrash Cr. 36 #8a-39 Medellín Colombia')
      }
    ]
  },
  {
    city: 'Cartagena',
    venues: [
      {
        name: 'Café Havana',
        address: 'Calle del Guerrero con Media Luna, Getsemaní',
        phone_number: '+57 310 610 2324',
        map_link: osmUrl('Café Havana Getsemaní Cartagena Colombia')
      },
      {
        name: 'Bazurto Social Club',
        address: 'Calle Del Centenario, Cra 9 N# 30-42, Getsemaní',
        phone_number: '+57 317 648 1183',
        map_link: osmUrl('Bazurto Social Club Cra 9 #30-42 Cartagena Colombia')
      },
      {
        name: 'La Jugada Club House',
        address: 'Calle del Colegio, 34-25, Centro Histórico',
        phone_number: '+57 321 587 5983',
        map_link: osmUrl('La Jugada Club House Calle del Colegio 34-25 Cartagena Colombia')
      },
      {
        name: 'La Movida',
        address: 'Cl. 31 #3-37, El Centro',
        phone_number: '+57 316 587 5350',
        map_link: osmUrl('La Movida Cl. 31 #3-37 Cartagena Colombia')
      },
      {
        name: 'Alquímico',
        address: 'Calle del Colegio 34-24',
        phone_number: '+57 316 533 1932',
        map_link: osmUrl('Alquímico Calle del Colegio 34-24 Cartagena Colombia')
      },
      {
        name: 'Seven Times',
        address: 'Calle Media Luna #9-79, Getsemaní',
        phone_number: '+57 312 256 3705',
        map_link: osmUrl('Seven Times Calle Media Luna #9-79 Cartagena Colombia')
      }
    ]
  }
];

// Helper function to find venue details by name and city
export const findVenueDetails = (venueName: string, city: string): VenueDetails | null => {
  const cityConfig = venuesConfig.find(c => c.city.toLowerCase() === city.toLowerCase());
  if (!cityConfig) return null;
  
  return cityConfig.venues.find(v => 
    v.name.toLowerCase() === venueName.toLowerCase()
  ) || null;
};
