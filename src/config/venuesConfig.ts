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

export const venuesConfig: CityVenues[] = [
  {
    city: 'Bogotá',
    venues: [
      {
        name: 'Theatron',
        address: 'Cl. 58 #10-32, Chapinero',
        phone_number: '+57 322 3617300',
        map_link: 'https://www.google.com/search?q=Theatron + Cl. 58 #10-32 + Bogotá + google business'
      },
      {
        name: 'Armando Records',
        address: 'Cl. 85 #14-46, Chapinero',
        phone_number: '+57 310 8731720',
        map_link: 'https://www.google.com/search?q=Armando Records + Cl. 85 #14-46 + Bogotá + google business'
      },
      {
        name: 'Baum',
        address: 'Cl. 33 #6-24, Teusaquillo',
        phone_number: '+57 312 2167448',
        map_link: 'https://www.google.com/search?q=Baum + Cl. 33 #6-24 + Bogotá + google business'
      }
    ]
  },
  {
    city: 'Medellín',
    venues: [
      {
        name: 'Dulce Jesús Mio',
        address: 'Cr. 38 #19-150, El Poblado',
        phone_number: '+57 312 8585934',
        map_link: 'https://www.google.com/search?q=Dulce Jesús Mio + Cr. 38 #19-150 + Medellín + google business'
      },
      {
        name: 'The Blue',
        address: 'Cl. 10 #40-20, El Poblado',
        phone_number: '+57 310 8943210',
        map_link: 'https://www.google.com/search?q=The Blue + Cl. 10 #40-20 + Medellín + google business'
      },
      {
        name: 'Vintrash',
        address: 'Cr. 36 #8a-39, El Poblado',
        phone_number: '+57 301 7894560',
        map_link: 'https://www.google.com/search?q=Vintrash + Cr. 36 #8a-39 + Medellín + google business'
      }
    ]
  },
  {
    city: 'Cartagena',
    venues: [
      {
        name: 'Café Havana',
        address: 'Cra. 10 #ESQUINA, Getsemaní',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=Café+Havana+Cra.+10+#ESQUINA,+Getsemaní,+Cartagena+google+business'
      },
      {
        name: 'Bazurto Social Club',
        address: 'Getsemaní, Av. del Centenario, Cra 9 #30-42',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=Bazurto+Social+Club+Cra+9+#30-42,+Cartagena+google+business'
      },
      {
        name: 'La Jugada Club House',
        address: 'Calle del Colegio, Cra. 6 #34-25',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=La+Jugada+Club+House+Calle+del+Colegio,+Cra.+6+#34-25,+Cartagena+google+business'
      },
      {
        name: 'La Movida',
        address: 'Cl. 31 #3-37, El Centro',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=La+Movida+Cl.+31+#3-37,+El+Centro,+Cartagena+google+business'
      },
      {
        name: 'Alquímico',
        address: 'Cl. del Colegio # 34-24',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=Alquímico+Cl.+del+Colegio+#34-24,+Cartagena+google+business'
      },
      {
        name: 'Seven Times',
        address: 'Calle Media Luna #9-79',
        phone_number: '',
        map_link: 'https://www.google.com/search?q=Seven+Times+Calle+Media+Luna+#9-79,+Cartagena+google+business'
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
