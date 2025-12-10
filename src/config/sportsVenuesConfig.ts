export interface SportsVenue {
  name: string;
  city: string;
  state: string;
  address: string;
  sport: 'NFL' | 'NBA' | 'NHL' | 'MLB' | 'NCAA Football' | 'NCAA Basketball' | 'MLS';
  team: string;
  capacity: number;
  map_link: string;
}

// Helper to generate Google Maps search URL
const googleUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const sportsVenuesConfig: SportsVenue[] = [
  // NFL STADIUMS
  { name: "SoFi Stadium", city: "Inglewood", state: "CA", address: "1001 Stadium Dr", sport: "NFL", team: "LA Rams / Chargers", capacity: 70240, map_link: googleUrl("SoFi Stadium Inglewood CA") },
  { name: "Allegiant Stadium", city: "Las Vegas", state: "NV", address: "3333 Al Davis Way", sport: "NFL", team: "Las Vegas Raiders", capacity: 65000, map_link: googleUrl("Allegiant Stadium Las Vegas NV") },
  { name: "AT&T Stadium", city: "Arlington", state: "TX", address: "1 AT&T Way", sport: "NFL", team: "Dallas Cowboys", capacity: 80000, map_link: googleUrl("AT&T Stadium Arlington TX") },
  { name: "MetLife Stadium", city: "East Rutherford", state: "NJ", address: "1 MetLife Stadium Dr", sport: "NFL", team: "NY Giants / Jets", capacity: 82500, map_link: googleUrl("MetLife Stadium East Rutherford NJ") },
  { name: "Hard Rock Stadium", city: "Miami Gardens", state: "FL", address: "347 Don Shula Dr", sport: "NFL", team: "Miami Dolphins", capacity: 65326, map_link: googleUrl("Hard Rock Stadium Miami Gardens FL") },
  { name: "Raymond James Stadium", city: "Tampa", state: "FL", address: "4201 N Dale Mabry Hwy", sport: "NFL", team: "Tampa Bay Buccaneers", capacity: 65890, map_link: googleUrl("Raymond James Stadium Tampa FL") },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", state: "GA", address: "1 AMB Dr NW", sport: "NFL", team: "Atlanta Falcons", capacity: 71000, map_link: googleUrl("Mercedes-Benz Stadium Atlanta GA") },
  { name: "Lumen Field", city: "Seattle", state: "WA", address: "800 Occidental Ave S", sport: "NFL", team: "Seattle Seahawks", capacity: 68740, map_link: googleUrl("Lumen Field Seattle WA") },
  { name: "Arrowhead Stadium", city: "Kansas City", state: "MO", address: "1 Arrowhead Dr", sport: "NFL", team: "Kansas City Chiefs", capacity: 76416, map_link: googleUrl("Arrowhead Stadium Kansas City MO") },
  { name: "Gillette Stadium", city: "Foxborough", state: "MA", address: "1 Patriot Pl", sport: "NFL", team: "New England Patriots", capacity: 65878, map_link: googleUrl("Gillette Stadium Foxborough MA") },
  { name: "Highmark Stadium", city: "Orchard Park", state: "NY", address: "1 Bills Dr", sport: "NFL", team: "Buffalo Bills", capacity: 71608, map_link: googleUrl("Highmark Stadium Orchard Park NY") },
  { name: "Lincoln Financial Field", city: "Philadelphia", state: "PA", address: "1 Lincoln Financial Field Way", sport: "NFL", team: "Philadelphia Eagles", capacity: 69796, map_link: googleUrl("Lincoln Financial Field Philadelphia PA") },
  { name: "M&T Bank Stadium", city: "Baltimore", state: "MD", address: "1101 Russell St", sport: "NFL", team: "Baltimore Ravens", capacity: 71008, map_link: googleUrl("M&T Bank Stadium Baltimore MD") },
  { name: "Empower Field at Mile High", city: "Denver", state: "CO", address: "1701 Bryant St", sport: "NFL", team: "Denver Broncos", capacity: 76125, map_link: googleUrl("Empower Field at Mile High Denver CO") },
  { name: "U.S. Bank Stadium", city: "Minneapolis", state: "MN", address: "401 Chicago Ave", sport: "NFL", team: "Minnesota Vikings", capacity: 66860, map_link: googleUrl("U.S. Bank Stadium Minneapolis MN") },
  { name: "Lambeau Field", city: "Green Bay", state: "WI", address: "1265 Lombardi Ave", sport: "NFL", team: "Green Bay Packers", capacity: 81441, map_link: googleUrl("Lambeau Field Green Bay WI") },
  { name: "Soldier Field", city: "Chicago", state: "IL", address: "1410 Special Olympics Dr", sport: "NFL", team: "Chicago Bears", capacity: 61500, map_link: googleUrl("Soldier Field Chicago IL") },
  { name: "Ford Field", city: "Detroit", state: "MI", address: "2000 Brush St", sport: "NFL", team: "Detroit Lions", capacity: 65000, map_link: googleUrl("Ford Field Detroit MI") },
  { name: "Bank of America Stadium", city: "Charlotte", state: "NC", address: "800 S Mint St", sport: "NFL", team: "Carolina Panthers", capacity: 74867, map_link: googleUrl("Bank of America Stadium Charlotte NC") },
  { name: "Caesars Superdome", city: "New Orleans", state: "LA", address: "1500 Sugar Bowl Dr", sport: "NFL", team: "New Orleans Saints", capacity: 73208, map_link: googleUrl("Caesars Superdome New Orleans LA") },
  { name: "State Farm Stadium", city: "Glendale", state: "AZ", address: "1 Cardinals Dr", sport: "NFL", team: "Arizona Cardinals", capacity: 63400, map_link: googleUrl("State Farm Stadium Glendale AZ") },
  { name: "Levi's Stadium", city: "Santa Clara", state: "CA", address: "4900 Marie P DeBartolo Way", sport: "NFL", team: "San Francisco 49ers", capacity: 68500, map_link: googleUrl("Levi's Stadium Santa Clara CA") },
  { name: "NRG Stadium", city: "Houston", state: "TX", address: "NRG Pkwy", sport: "NFL", team: "Houston Texans", capacity: 72220, map_link: googleUrl("NRG Stadium Houston TX") },
  { name: "Lucas Oil Stadium", city: "Indianapolis", state: "IN", address: "500 S Capitol Ave", sport: "NFL", team: "Indianapolis Colts", capacity: 67000, map_link: googleUrl("Lucas Oil Stadium Indianapolis IN") },
  { name: "Nissan Stadium", city: "Nashville", state: "TN", address: "1 Titans Way", sport: "NFL", team: "Tennessee Titans", capacity: 69143, map_link: googleUrl("Nissan Stadium Nashville TN") },
  { name: "Paycor Stadium", city: "Cincinnati", state: "OH", address: "1 Paul Brown Stadium", sport: "NFL", team: "Cincinnati Bengals", capacity: 65515, map_link: googleUrl("Paycor Stadium Cincinnati OH") },
  { name: "Huntington Bank Field", city: "Cleveland", state: "OH", address: "100 Alfred Lerner Way", sport: "NFL", team: "Cleveland Browns", capacity: 67431, map_link: googleUrl("Huntington Bank Field Cleveland OH") },
  { name: "Acrisure Stadium", city: "Pittsburgh", state: "PA", address: "100 Art Rooney Ave", sport: "NFL", team: "Pittsburgh Steelers", capacity: 68400, map_link: googleUrl("Acrisure Stadium Pittsburgh PA") },
  { name: "TIAA Bank Field", city: "Jacksonville", state: "FL", address: "1 TIAA Bank Field Dr", sport: "NFL", team: "Jacksonville Jaguars", capacity: 67814, map_link: googleUrl("TIAA Bank Field Jacksonville FL") },
  { name: "FedExField", city: "Landover", state: "MD", address: "1600 FedEx Way", sport: "NFL", team: "Washington Commanders", capacity: 67617, map_link: googleUrl("FedExField Landover MD") },
  
  // NBA ARENAS
  { name: "Madison Square Garden", city: "New York", state: "NY", address: "4 Pennsylvania Plaza", sport: "NBA", team: "New York Knicks", capacity: 19812, map_link: googleUrl("Madison Square Garden New York NY") },
  { name: "Crypto.com Arena", city: "Los Angeles", state: "CA", address: "1111 S Figueroa St", sport: "NBA", team: "LA Lakers / Clippers", capacity: 19068, map_link: googleUrl("Crypto.com Arena Los Angeles CA") },
  { name: "United Center", city: "Chicago", state: "IL", address: "1901 W Madison St", sport: "NBA", team: "Chicago Bulls", capacity: 20917, map_link: googleUrl("United Center Chicago IL") },
  { name: "Chase Center", city: "San Francisco", state: "CA", address: "1 Warriors Way", sport: "NBA", team: "Golden State Warriors", capacity: 18064, map_link: googleUrl("Chase Center San Francisco CA") },
  { name: "TD Garden", city: "Boston", state: "MA", address: "100 Legends Way", sport: "NBA", team: "Boston Celtics", capacity: 19580, map_link: googleUrl("TD Garden Boston MA") },
  { name: "American Airlines Center", city: "Dallas", state: "TX", address: "2500 Victory Ave", sport: "NBA", team: "Dallas Mavericks", capacity: 19200, map_link: googleUrl("American Airlines Center Dallas TX") },
  { name: "Kaseya Center", city: "Miami", state: "FL", address: "601 Biscayne Blvd", sport: "NBA", team: "Miami Heat", capacity: 19600, map_link: googleUrl("Kaseya Center Miami FL") },
  { name: "Wells Fargo Center", city: "Philadelphia", state: "PA", address: "3601 S Broad St", sport: "NBA", team: "Philadelphia 76ers", capacity: 20478, map_link: googleUrl("Wells Fargo Center Philadelphia PA") },
  { name: "Toyota Center", city: "Houston", state: "TX", address: "1510 Polk St", sport: "NBA", team: "Houston Rockets", capacity: 18055, map_link: googleUrl("Toyota Center Houston TX") },
  { name: "Frost Bank Center", city: "San Antonio", state: "TX", address: "1 AT&T Center Pkwy", sport: "NBA", team: "San Antonio Spurs", capacity: 18581, map_link: googleUrl("Frost Bank Center San Antonio TX") },
  { name: "State Farm Arena", city: "Atlanta", state: "GA", address: "1 State Farm Dr", sport: "NBA", team: "Atlanta Hawks", capacity: 18118, map_link: googleUrl("State Farm Arena Atlanta GA") },
  { name: "Target Center", city: "Minneapolis", state: "MN", address: "600 N 1st Ave", sport: "NBA", team: "Minnesota Timberwolves", capacity: 18798, map_link: googleUrl("Target Center Minneapolis MN") },
  { name: "Ball Arena", city: "Denver", state: "CO", address: "1000 Chopper Cir", sport: "NBA", team: "Denver Nuggets", capacity: 19520, map_link: googleUrl("Ball Arena Denver CO") },
  { name: "Footprint Center", city: "Phoenix", state: "AZ", address: "201 E Jefferson St", sport: "NBA", team: "Phoenix Suns", capacity: 18055, map_link: googleUrl("Footprint Center Phoenix AZ") },
  { name: "Little Caesars Arena", city: "Detroit", state: "MI", address: "2645 Woodward Ave", sport: "NBA", team: "Detroit Pistons", capacity: 20332, map_link: googleUrl("Little Caesars Arena Detroit MI") },
  { name: "Barclays Center", city: "Brooklyn", state: "NY", address: "620 Atlantic Ave", sport: "NBA", team: "Brooklyn Nets", capacity: 17732, map_link: googleUrl("Barclays Center Brooklyn NY") },
  { name: "Smoothie King Center", city: "New Orleans", state: "LA", address: "1501 Dave Dixon Dr", sport: "NBA", team: "New Orleans Pelicans", capacity: 16867, map_link: googleUrl("Smoothie King Center New Orleans LA") },
  { name: "Fiserv Forum", city: "Milwaukee", state: "WI", address: "1111 Vel R. Phillips Ave", sport: "NBA", team: "Milwaukee Bucks", capacity: 17341, map_link: googleUrl("Fiserv Forum Milwaukee WI") },
  { name: "Gainbridge Fieldhouse", city: "Indianapolis", state: "IN", address: "125 S Pennsylvania St", sport: "NBA", team: "Indiana Pacers", capacity: 17923, map_link: googleUrl("Gainbridge Fieldhouse Indianapolis IN") },
  { name: "Spectrum Center", city: "Charlotte", state: "NC", address: "333 E Trade St", sport: "NBA", team: "Charlotte Hornets", capacity: 19077, map_link: googleUrl("Spectrum Center Charlotte NC") },
  { name: "Rocket Mortgage FieldHouse", city: "Cleveland", state: "OH", address: "1 Center Court", sport: "NBA", team: "Cleveland Cavaliers", capacity: 19432, map_link: googleUrl("Rocket Mortgage FieldHouse Cleveland OH") },
  { name: "Moda Center", city: "Portland", state: "OR", address: "1 N Center Court St", sport: "NBA", team: "Portland Trail Blazers", capacity: 19441, map_link: googleUrl("Moda Center Portland OR") },
  { name: "Delta Center", city: "Salt Lake City", state: "UT", address: "301 S Temple", sport: "NBA", team: "Utah Jazz", capacity: 18306, map_link: googleUrl("Delta Center Salt Lake City UT") },
  { name: "Climate Pledge Arena", city: "Seattle", state: "WA", address: "334 1st Ave N", sport: "NBA", team: "Seattle SuperSonics (Future)", capacity: 18100, map_link: googleUrl("Climate Pledge Arena Seattle WA") },
  { name: "Intuit Dome", city: "Inglewood", state: "CA", address: "3930 W Century Blvd", sport: "NBA", team: "LA Clippers", capacity: 18000, map_link: googleUrl("Intuit Dome Inglewood CA") },
  { name: "Amway Center", city: "Orlando", state: "FL", address: "400 W Church St", sport: "NBA", team: "Orlando Magic", capacity: 18846, map_link: googleUrl("Amway Center Orlando FL") },
  { name: "FedExForum", city: "Memphis", state: "TN", address: "191 Beale St", sport: "NBA", team: "Memphis Grizzlies", capacity: 17794, map_link: googleUrl("FedExForum Memphis TN") },
  { name: "Paycom Center", city: "Oklahoma City", state: "OK", address: "100 W Reno Ave", sport: "NBA", team: "Oklahoma City Thunder", capacity: 18203, map_link: googleUrl("Paycom Center Oklahoma City OK") },
  { name: "Golden 1 Center", city: "Sacramento", state: "CA", address: "500 David J Stern Walk", sport: "NBA", team: "Sacramento Kings", capacity: 17608, map_link: googleUrl("Golden 1 Center Sacramento CA") },
  
  // MLB STADIUMS
  { name: "Yankee Stadium", city: "Bronx", state: "NY", address: "1 E 161st St", sport: "MLB", team: "New York Yankees", capacity: 46537, map_link: googleUrl("Yankee Stadium Bronx NY") },
  { name: "Dodger Stadium", city: "Los Angeles", state: "CA", address: "1000 Vin Scully Ave", sport: "MLB", team: "Los Angeles Dodgers", capacity: 56000, map_link: googleUrl("Dodger Stadium Los Angeles CA") },
  { name: "Fenway Park", city: "Boston", state: "MA", address: "4 Jersey St", sport: "MLB", team: "Boston Red Sox", capacity: 37755, map_link: googleUrl("Fenway Park Boston MA") },
  { name: "Wrigley Field", city: "Chicago", state: "IL", address: "1060 W Addison St", sport: "MLB", team: "Chicago Cubs", capacity: 41649, map_link: googleUrl("Wrigley Field Chicago IL") },
  { name: "Oracle Park", city: "San Francisco", state: "CA", address: "24 Willie Mays Plaza", sport: "MLB", team: "San Francisco Giants", capacity: 41265, map_link: googleUrl("Oracle Park San Francisco CA") },
  { name: "Truist Park", city: "Atlanta", state: "GA", address: "755 Battery Ave SE", sport: "MLB", team: "Atlanta Braves", capacity: 41084, map_link: googleUrl("Truist Park Atlanta GA") },
  { name: "Minute Maid Park", city: "Houston", state: "TX", address: "501 Crawford St", sport: "MLB", team: "Houston Astros", capacity: 41168, map_link: googleUrl("Minute Maid Park Houston TX") },
  { name: "Citi Field", city: "Queens", state: "NY", address: "41 Seaver Way", sport: "MLB", team: "New York Mets", capacity: 41922, map_link: googleUrl("Citi Field Queens NY") },
  { name: "Citizens Bank Park", city: "Philadelphia", state: "PA", address: "1 Citizens Bank Way", sport: "MLB", team: "Philadelphia Phillies", capacity: 42792, map_link: googleUrl("Citizens Bank Park Philadelphia PA") },
  { name: "Petco Park", city: "San Diego", state: "CA", address: "100 Park Blvd", sport: "MLB", team: "San Diego Padres", capacity: 40209, map_link: googleUrl("Petco Park San Diego CA") },
  { name: "Globe Life Field", city: "Arlington", state: "TX", address: "734 Stadium Dr", sport: "MLB", team: "Texas Rangers", capacity: 40300, map_link: googleUrl("Globe Life Field Arlington TX") },
  { name: "T-Mobile Park", city: "Seattle", state: "WA", address: "1250 1st Ave S", sport: "MLB", team: "Seattle Mariners", capacity: 47929, map_link: googleUrl("T-Mobile Park Seattle WA") },
  { name: "Comerica Park", city: "Detroit", state: "MI", address: "2100 Woodward Ave", sport: "MLB", team: "Detroit Tigers", capacity: 41083, map_link: googleUrl("Comerica Park Detroit MI") },
  { name: "Target Field", city: "Minneapolis", state: "MN", address: "1 Twins Way", sport: "MLB", team: "Minnesota Twins", capacity: 38544, map_link: googleUrl("Target Field Minneapolis MN") },
  { name: "Busch Stadium", city: "St. Louis", state: "MO", address: "700 Clark Ave", sport: "MLB", team: "St. Louis Cardinals", capacity: 44494, map_link: googleUrl("Busch Stadium St. Louis MO") },
  { name: "Coors Field", city: "Denver", state: "CO", address: "2001 Blake St", sport: "MLB", team: "Colorado Rockies", capacity: 50144, map_link: googleUrl("Coors Field Denver CO") },
  { name: "American Family Field", city: "Milwaukee", state: "WI", address: "1 Brewers Way", sport: "MLB", team: "Milwaukee Brewers", capacity: 41900, map_link: googleUrl("American Family Field Milwaukee WI") },
  { name: "PNC Park", city: "Pittsburgh", state: "PA", address: "115 Federal St", sport: "MLB", team: "Pittsburgh Pirates", capacity: 38362, map_link: googleUrl("PNC Park Pittsburgh PA") },
  { name: "Progressive Field", city: "Cleveland", state: "OH", address: "2401 Ontario St", sport: "MLB", team: "Cleveland Guardians", capacity: 34830, map_link: googleUrl("Progressive Field Cleveland OH") },
  { name: "Guaranteed Rate Field", city: "Chicago", state: "IL", address: "333 W 35th St", sport: "MLB", team: "Chicago White Sox", capacity: 40615, map_link: googleUrl("Guaranteed Rate Field Chicago IL") },
  { name: "Oriole Park at Camden Yards", city: "Baltimore", state: "MD", address: "333 W Camden St", sport: "MLB", team: "Baltimore Orioles", capacity: 45971, map_link: googleUrl("Oriole Park at Camden Yards Baltimore MD") },
  { name: "Kauffman Stadium", city: "Kansas City", state: "MO", address: "1 Royal Way", sport: "MLB", team: "Kansas City Royals", capacity: 37903, map_link: googleUrl("Kauffman Stadium Kansas City MO") },
  { name: "Tropicana Field", city: "St. Petersburg", state: "FL", address: "1 Tropicana Dr", sport: "MLB", team: "Tampa Bay Rays", capacity: 25000, map_link: googleUrl("Tropicana Field St. Petersburg FL") },
  { name: "loanDepot Park", city: "Miami", state: "FL", address: "501 Marlins Way", sport: "MLB", team: "Miami Marlins", capacity: 36742, map_link: googleUrl("loanDepot Park Miami FL") },
  { name: "Chase Field", city: "Phoenix", state: "AZ", address: "401 E Jefferson St", sport: "MLB", team: "Arizona Diamondbacks", capacity: 48519, map_link: googleUrl("Chase Field Phoenix AZ") },
  { name: "Oakland Coliseum", city: "Oakland", state: "CA", address: "7000 Coliseum Way", sport: "MLB", team: "Oakland Athletics", capacity: 46847, map_link: googleUrl("Oakland Coliseum Oakland CA") },
  { name: "Angel Stadium", city: "Anaheim", state: "CA", address: "2000 E Gene Autry Way", sport: "MLB", team: "Los Angeles Angels", capacity: 45517, map_link: googleUrl("Angel Stadium Anaheim CA") },
  { name: "Nationals Park", city: "Washington", state: "DC", address: "1500 S Capitol St SE", sport: "MLB", team: "Washington Nationals", capacity: 41339, map_link: googleUrl("Nationals Park Washington DC") },
  { name: "Great American Ball Park", city: "Cincinnati", state: "OH", address: "100 Joe Nuxhall Way", sport: "MLB", team: "Cincinnati Reds", capacity: 42319, map_link: googleUrl("Great American Ball Park Cincinnati OH") },
  { name: "Rogers Centre", city: "Toronto", state: "ON", address: "1 Blue Jays Way", sport: "MLB", team: "Toronto Blue Jays", capacity: 49282, map_link: googleUrl("Rogers Centre Toronto ON Canada") },
  
  // NHL ARENAS (Many share with NBA)
  { name: "Bell Centre", city: "Montreal", state: "QC", address: "1909 Avenue des Canadiens-de-Montréal", sport: "NHL", team: "Montreal Canadiens", capacity: 21302, map_link: googleUrl("Bell Centre Montreal QC Canada") },
  { name: "Scotiabank Arena", city: "Toronto", state: "ON", address: "40 Bay St", sport: "NHL", team: "Toronto Maple Leafs", capacity: 18819, map_link: googleUrl("Scotiabank Arena Toronto ON Canada") },
  { name: "PPG Paints Arena", city: "Pittsburgh", state: "PA", address: "1001 Fifth Ave", sport: "NHL", team: "Pittsburgh Penguins", capacity: 18387, map_link: googleUrl("PPG Paints Arena Pittsburgh PA") },
  { name: "Enterprise Center", city: "St. Louis", state: "MO", address: "1401 Clark Ave", sport: "NHL", team: "St. Louis Blues", capacity: 18096, map_link: googleUrl("Enterprise Center St. Louis MO") },
  { name: "Amerant Bank Arena", city: "Sunrise", state: "FL", address: "1 Panther Pkwy", sport: "NHL", team: "Florida Panthers", capacity: 19250, map_link: googleUrl("Amerant Bank Arena Sunrise FL") },
  { name: "Amalie Arena", city: "Tampa", state: "FL", address: "401 Channelside Dr", sport: "NHL", team: "Tampa Bay Lightning", capacity: 19092, map_link: googleUrl("Amalie Arena Tampa FL") },
  { name: "Capital One Arena", city: "Washington", state: "DC", address: "601 F St NW", sport: "NHL", team: "Washington Capitals", capacity: 18573, map_link: googleUrl("Capital One Arena Washington DC") },
  { name: "Honda Center", city: "Anaheim", state: "CA", address: "2695 E Katella Ave", sport: "NHL", team: "Anaheim Ducks", capacity: 17174, map_link: googleUrl("Honda Center Anaheim CA") },
  { name: "SAP Center", city: "San Jose", state: "CA", address: "525 W Santa Clara St", sport: "NHL", team: "San Jose Sharks", capacity: 17562, map_link: googleUrl("SAP Center San Jose CA") },
  { name: "T-Mobile Arena", city: "Las Vegas", state: "NV", address: "3780 S Las Vegas Blvd", sport: "NHL", team: "Vegas Golden Knights", capacity: 17500, map_link: googleUrl("T-Mobile Arena Las Vegas NV") },
  { name: "Rogers Arena", city: "Vancouver", state: "BC", address: "800 Griffiths Way", sport: "NHL", team: "Vancouver Canucks", capacity: 18910, map_link: googleUrl("Rogers Arena Vancouver BC Canada") },
  { name: "Canadian Tire Centre", city: "Ottawa", state: "ON", address: "1000 Palladium Dr", sport: "NHL", team: "Ottawa Senators", capacity: 18652, map_link: googleUrl("Canadian Tire Centre Ottawa ON Canada") },
  { name: "PNC Arena", city: "Raleigh", state: "NC", address: "1400 Edwards Mill Rd", sport: "NHL", team: "Carolina Hurricanes", capacity: 18680, map_link: googleUrl("PNC Arena Raleigh NC") },
  { name: "Bridgestone Arena", city: "Nashville", state: "TN", address: "501 Broadway", sport: "NHL", team: "Nashville Predators", capacity: 17159, map_link: googleUrl("Bridgestone Arena Nashville TN") },
  { name: "Nationwide Arena", city: "Columbus", state: "OH", address: "200 W Nationwide Blvd", sport: "NHL", team: "Columbus Blue Jackets", capacity: 18144, map_link: googleUrl("Nationwide Arena Columbus OH") },
  { name: "KeyBank Center", city: "Buffalo", state: "NY", address: "1 Seymour H. Knox III Plaza", sport: "NHL", team: "Buffalo Sabres", capacity: 19070, map_link: googleUrl("KeyBank Center Buffalo NY") },
  { name: "Prudential Center", city: "Newark", state: "NJ", address: "25 Lafayette St", sport: "NHL", team: "New Jersey Devils", capacity: 16514, map_link: googleUrl("Prudential Center Newark NJ") },
  { name: "UBS Arena", city: "Elmont", state: "NY", address: "2400 Hempstead Tpke", sport: "NHL", team: "New York Islanders", capacity: 17113, map_link: googleUrl("UBS Arena Elmont NY") },
  { name: "Lenovo Center", city: "Raleigh", state: "NC", address: "1400 Edwards Mill Rd", sport: "NHL", team: "Carolina Hurricanes", capacity: 18680, map_link: googleUrl("Lenovo Center Raleigh NC") },
  { name: "Xcel Energy Center", city: "St. Paul", state: "MN", address: "199 Kellogg Blvd W", sport: "NHL", team: "Minnesota Wild", capacity: 17954, map_link: googleUrl("Xcel Energy Center St. Paul MN") },
  
  // NCAA FOOTBALL - Major Stadiums
  { name: "Michigan Stadium", city: "Ann Arbor", state: "MI", address: "1201 S Main St", sport: "NCAA Football", team: "Michigan Wolverines", capacity: 107601, map_link: googleUrl("Michigan Stadium Ann Arbor MI") },
  { name: "Ohio Stadium", city: "Columbus", state: "OH", address: "411 Woody Hayes Dr", sport: "NCAA Football", team: "Ohio State Buckeyes", capacity: 102780, map_link: googleUrl("Ohio Stadium Columbus OH") },
  { name: "Beaver Stadium", city: "University Park", state: "PA", address: "1 Beaver Stadium", sport: "NCAA Football", team: "Penn State Nittany Lions", capacity: 106572, map_link: googleUrl("Beaver Stadium University Park PA") },
  { name: "Kyle Field", city: "College Station", state: "TX", address: "756 Houston St", sport: "NCAA Football", team: "Texas A&M Aggies", capacity: 102733, map_link: googleUrl("Kyle Field College Station TX") },
  { name: "Neyland Stadium", city: "Knoxville", state: "TN", address: "1235 Phillip Fulmer Way", sport: "NCAA Football", team: "Tennessee Volunteers", capacity: 101915, map_link: googleUrl("Neyland Stadium Knoxville TN") },
  { name: "Tiger Stadium", city: "Baton Rouge", state: "LA", address: "N Stadium Dr", sport: "NCAA Football", team: "LSU Tigers", capacity: 102321, map_link: googleUrl("Tiger Stadium Baton Rouge LA") },
  { name: "Sanford Stadium", city: "Athens", state: "GA", address: "100 Sanford Dr", sport: "NCAA Football", team: "Georgia Bulldogs", capacity: 92746, map_link: googleUrl("Sanford Stadium Athens GA") },
  { name: "Bryant-Denny Stadium", city: "Tuscaloosa", state: "AL", address: "920 Paul W Bryant Dr", sport: "NCAA Football", team: "Alabama Crimson Tide", capacity: 100077, map_link: googleUrl("Bryant-Denny Stadium Tuscaloosa AL") },
  { name: "Darrell K Royal-Texas Memorial Stadium", city: "Austin", state: "TX", address: "2139 San Jacinto Blvd", sport: "NCAA Football", team: "Texas Longhorns", capacity: 100119, map_link: googleUrl("Darrell K Royal-Texas Memorial Stadium Austin TX") },
  { name: "Rose Bowl", city: "Pasadena", state: "CA", address: "1001 Rose Bowl Dr", sport: "NCAA Football", team: "UCLA Bruins", capacity: 88565, map_link: googleUrl("Rose Bowl Pasadena CA") },
  { name: "Los Angeles Memorial Coliseum", city: "Los Angeles", state: "CA", address: "3911 S Figueroa St", sport: "NCAA Football", team: "USC Trojans", capacity: 77500, map_link: googleUrl("Los Angeles Memorial Coliseum Los Angeles CA") },
  { name: "Notre Dame Stadium", city: "South Bend", state: "IN", address: "Juniper Rd", sport: "NCAA Football", team: "Notre Dame Fighting Irish", capacity: 77622, map_link: googleUrl("Notre Dame Stadium South Bend IN") },
  { name: "Camp Randall Stadium", city: "Madison", state: "WI", address: "1440 Monroe St", sport: "NCAA Football", team: "Wisconsin Badgers", capacity: 80321, map_link: googleUrl("Camp Randall Stadium Madison WI") },
  { name: "Memorial Stadium", city: "Lincoln", state: "NE", address: "1 Memorial Stadium Dr", sport: "NCAA Football", team: "Nebraska Cornhuskers", capacity: 85458, map_link: googleUrl("Memorial Stadium Lincoln NE") },
  { name: "Jordan-Hare Stadium", city: "Auburn", state: "AL", address: "251 S Donahue Dr", sport: "NCAA Football", team: "Auburn Tigers", capacity: 87451, map_link: googleUrl("Jordan-Hare Stadium Auburn AL") },
  { name: "Ben Hill Griffin Stadium", city: "Gainesville", state: "FL", address: "157 Gale Lemerand Dr", sport: "NCAA Football", team: "Florida Gators", capacity: 88548, map_link: googleUrl("Ben Hill Griffin Stadium Gainesville FL") },
  { name: "Autzen Stadium", city: "Eugene", state: "OR", address: "2700 MLK Jr Blvd", sport: "NCAA Football", team: "Oregon Ducks", capacity: 54000, map_link: googleUrl("Autzen Stadium Eugene OR") },
  { name: "Williams-Brice Stadium", city: "Columbia", state: "SC", address: "1127 George Rogers Blvd", sport: "NCAA Football", team: "South Carolina Gamecocks", capacity: 77559, map_link: googleUrl("Williams-Brice Stadium Columbia SC") },
  { name: "Doak Campbell Stadium", city: "Tallahassee", state: "FL", address: "403 Stadium Dr", sport: "NCAA Football", team: "Florida State Seminoles", capacity: 79560, map_link: googleUrl("Doak Campbell Stadium Tallahassee FL") },
  { name: "Husky Stadium", city: "Seattle", state: "WA", address: "3800 Montlake Blvd NE", sport: "NCAA Football", team: "Washington Huskies", capacity: 70083, map_link: googleUrl("Husky Stadium Seattle WA") },
  
  // MLS STADIUMS
  { name: "Inter&Co Stadium", city: "Orlando", state: "FL", address: "655 W Church St", sport: "MLS", team: "Orlando City SC", capacity: 25500, map_link: googleUrl("Inter&Co Stadium Orlando FL") },
  { name: "Dignity Health Sports Park", city: "Carson", state: "CA", address: "18400 S Avalon Blvd", sport: "MLS", team: "LA Galaxy", capacity: 27000, map_link: googleUrl("Dignity Health Sports Park Carson CA") },
  { name: "BMO Stadium", city: "Los Angeles", state: "CA", address: "3939 S Figueroa St", sport: "MLS", team: "LAFC", capacity: 22000, map_link: googleUrl("BMO Stadium Los Angeles CA") },
  { name: "Providence Park", city: "Portland", state: "OR", address: "1844 SW Morrison St", sport: "MLS", team: "Portland Timbers", capacity: 25218, map_link: googleUrl("Providence Park Portland OR") },
  { name: "Q2 Stadium", city: "Austin", state: "TX", address: "10414 McKalla Pl", sport: "MLS", team: "Austin FC", capacity: 20738, map_link: googleUrl("Q2 Stadium Austin TX") },
  { name: "Audi Field", city: "Washington", state: "DC", address: "100 Potomac Ave SW", sport: "MLS", team: "D.C. United", capacity: 20000, map_link: googleUrl("Audi Field Washington DC") },
  { name: "Allianz Field", city: "St. Paul", state: "MN", address: "400 Snelling Ave N", sport: "MLS", team: "Minnesota United FC", capacity: 19400, map_link: googleUrl("Allianz Field St. Paul MN") },
  { name: "Children's Mercy Park", city: "Kansas City", state: "KS", address: "1 Sporting Way", sport: "MLS", team: "Sporting Kansas City", capacity: 18467, map_link: googleUrl("Children's Mercy Park Kansas City KS") },
  { name: "Red Bull Arena", city: "Harrison", state: "NJ", address: "600 Cape May St", sport: "MLS", team: "New York Red Bulls", capacity: 25000, map_link: googleUrl("Red Bull Arena Harrison NJ") },
  { name: "Subaru Park", city: "Chester", state: "PA", address: "1 Stadium Dr", sport: "MLS", team: "Philadelphia Union", capacity: 18500, map_link: googleUrl("Subaru Park Chester PA") },
  { name: "DRV PNK Stadium", city: "Fort Lauderdale", state: "FL", address: "1350 NW 55th St", sport: "MLS", team: "Inter Miami CF", capacity: 21000, map_link: googleUrl("DRV PNK Stadium Fort Lauderdale FL") },
  { name: "Lower.com Field", city: "Columbus", state: "OH", address: "96 Columbus Crew Way", sport: "MLS", team: "Columbus Crew", capacity: 20371, map_link: googleUrl("Lower.com Field Columbus OH") },
  { name: "TQL Stadium", city: "Cincinnati", state: "OH", address: "1501 Central Pkwy", sport: "MLS", team: "FC Cincinnati", capacity: 26000, map_link: googleUrl("TQL Stadium Cincinnati OH") },
  { name: "Geodis Park", city: "Nashville", state: "TN", address: "501 Benton Ave", sport: "MLS", team: "Nashville SC", capacity: 30000, map_link: googleUrl("Geodis Park Nashville TN") },
  { name: "Toyota Stadium", city: "Frisco", state: "TX", address: "9200 World Cup Way", sport: "MLS", team: "FC Dallas", capacity: 20500, map_link: googleUrl("Toyota Stadium Frisco TX") },
  { name: "Shell Energy Stadium", city: "Houston", state: "TX", address: "2200 Texas Ave", sport: "MLS", team: "Houston Dynamo FC", capacity: 22039, map_link: googleUrl("Shell Energy Stadium Houston TX") },
  { name: "Dick's Sporting Goods Park", city: "Commerce City", state: "CO", address: "6000 Victory Way", sport: "MLS", team: "Colorado Rapids", capacity: 18061, map_link: googleUrl("Dick's Sporting Goods Park Commerce City CO") },
  { name: "PayPal Park", city: "San Jose", state: "CA", address: "1123 Coleman Ave", sport: "MLS", team: "San Jose Earthquakes", capacity: 18000, map_link: googleUrl("PayPal Park San Jose CA") },
  { name: "BC Place", city: "Vancouver", state: "BC", address: "777 Pacific Blvd", sport: "MLS", team: "Vancouver Whitecaps FC", capacity: 22120, map_link: googleUrl("BC Place Vancouver BC Canada") },
  { name: "BMO Field", city: "Toronto", state: "ON", address: "170 Princes' Blvd", sport: "MLS", team: "Toronto FC", capacity: 30000, map_link: googleUrl("BMO Field Toronto ON Canada") },
];

// Get unique sports for filtering
export const getSportsList = (): string[] => {
  return [...new Set(sportsVenuesConfig.map(v => v.sport))].sort();
};

// Get unique states for filtering
export const getStatesList = (): string[] => {
  return [...new Set(sportsVenuesConfig.map(v => v.state))].sort();
};

// Find sports venue by name and city
export const findSportsVenue = (name: string, city: string): SportsVenue | null => {
  return sportsVenuesConfig.find(v => 
    v.name.toLowerCase() === name.toLowerCase() && 
    v.city.toLowerCase() === city.toLowerCase()
  ) || null;
};

// Generate SEO-friendly slug
export const generateSportsVenueSlug = (name: string, city: string, state: string): string => {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
