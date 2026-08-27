export interface RawCountryItem {
  id: string;
  name: string;
  code: string;
  flag: string;
  lat: number;
  lng: number;
  continent: 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania';
}

export const COUNTRIES_195_RAW: RawCountryItem[] = [
  // A (11)
  { id: 'AF', name: 'Afghanistan', code: 'AFG', flag: '🇦🇫', lat: 33.9391, lng: 67.7100, continent: 'Asia' },
  { id: 'AL', name: 'Albania', code: 'ALB', flag: '🇦🇱', lat: 41.1533, lng: 20.1683, continent: 'Europe' },
  { id: 'DZ', name: 'Algeria', code: 'DZA', flag: '🇩🇿', lat: 28.0339, lng: 1.6596, continent: 'Africa' },
  { id: 'AD', name: 'Andorra', code: 'AND', flag: '🇦🇩', lat: 42.5063, lng: 1.5218, continent: 'Europe' },
  { id: 'AO', name: 'Angola', code: 'AGO', flag: '🇦🇴', lat: -11.2027, lng: 17.8739, continent: 'Africa' },
  { id: 'AG', name: 'Antigua and Barbuda', code: 'ATG', flag: '🇦🇬', lat: 17.0608, lng: -61.7964, continent: 'North America' },
  { id: 'AR', name: 'Argentina', code: 'ARG', flag: '🇦🇷', lat: -38.4161, lng: -63.6167, continent: 'South America' },
  { id: 'AM', name: 'Armenia', code: 'ARM', flag: '🇦🇲', lat: 40.0691, lng: 45.0382, continent: 'Asia' },
  { id: 'AU', name: 'Australia', code: 'AUS', flag: '🇦🇺', lat: -25.2744, lng: 133.7751, continent: 'Oceania' },
  { id: 'AT', name: 'Austria', code: 'AUT', flag: '🇦🇹', lat: 47.5162, lng: 14.5501, continent: 'Europe' },
  { id: 'AZ', name: 'Azerbaijan', code: 'AZE', flag: '🇦🇿', lat: 40.1431, lng: 47.5769, continent: 'Asia' },

  // B (17)
  { id: 'BS', name: 'Bahamas', code: 'BHS', flag: '🇧🇸', lat: 25.0343, lng: -77.3963, continent: 'North America' },
  { id: 'BH', name: 'Bahrain', code: 'BHR', flag: '🇧🇭', lat: 26.0667, lng: 50.5577, continent: 'Asia' },
  { id: 'BD', name: 'Bangladesh', code: 'BGD', flag: '🇧🇩', lat: 23.6850, lng: 90.3563, continent: 'Asia' },
  { id: 'BB', name: 'Barbados', code: 'BRB', flag: '🇧🇧', lat: 13.1939, lng: -59.5432, continent: 'North America' },
  { id: 'BY', name: 'Belarus', code: 'BLR', flag: '🇧🇾', lat: 53.7098, lng: 27.9534, continent: 'Europe' },
  { id: 'BE', name: 'Belgium', code: 'BEL', flag: '🇧🇪', lat: 50.5039, lng: 4.4699, continent: 'Europe' },
  { id: 'BZ', name: 'Belize', code: 'BLZ', flag: '🇧🇿', lat: 17.1899, lng: -88.4976, continent: 'North America' },
  { id: 'BJ', name: 'Benin', code: 'BEN', flag: '🇧🇯', lat: 9.3077, lng: 2.3158, continent: 'Africa' },
  { id: 'BT', name: 'Bhutan', code: 'BTN', flag: '🇧🇹', lat: 27.5142, lng: 90.4336, continent: 'Asia' },
  { id: 'BO', name: 'Bolivia', code: 'BOL', flag: '🇧🇴', lat: -16.2902, lng: -63.5887, continent: 'South America' },
  { id: 'BA', name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦', lat: 43.9159, lng: 17.6791, continent: 'Europe' },
  { id: 'BW', name: 'Botswana', code: 'BWA', flag: '🇧🇼', lat: -22.3285, lng: 24.6849, continent: 'Africa' },
  { id: 'BR', name: 'Brazil', code: 'BRA', flag: '🇧🇷', lat: -14.2350, lng: -51.9253, continent: 'South America' },
  { id: 'BN', name: 'Brunei', code: 'BRN', flag: '🇧🇳', lat: 4.5353, lng: 114.7277, continent: 'Asia' },
  { id: 'BG', name: 'Bulgaria', code: 'BGR', flag: '🇧🇬', lat: 42.7339, lng: 25.4858, continent: 'Europe' },
  { id: 'BF', name: 'Burkina Faso', code: 'BFA', flag: '🇧🇫', lat: 12.2383, lng: -1.5616, continent: 'Africa' },
  { id: 'BI', name: 'Burundi', code: 'BDI', flag: '🇧🇮', lat: -3.3731, lng: 29.9189, continent: 'Africa' },

  // C (17)
  { id: 'CV', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', lat: 16.5388, lng: -23.0418, continent: 'Africa' },
  { id: 'KH', name: 'Cambodia', code: 'KHM', flag: '🇰🇭', lat: 12.5657, lng: 104.9910, continent: 'Asia' },
  { id: 'CM', name: 'Cameroon', code: 'CMR', flag: '🇨🇲', lat: 7.3697, lng: 12.3547, continent: 'Africa' },
  { id: 'CA', name: 'Canada', code: 'CAN', flag: '🇨🇦', lat: 56.1304, lng: -106.3468, continent: 'North America' },
  { id: 'CF', name: 'Central African Republic', code: 'CAF', flag: '🇨🇫', lat: 6.6111, lng: 20.9394, continent: 'Africa' },
  { id: 'TD', name: 'Chad', code: 'TCD', flag: '🇹🇩', lat: 15.4542, lng: 18.7322, continent: 'Africa' },
  { id: 'CL', name: 'Chile', code: 'CHL', flag: '🇨🇱', lat: -35.6751, lng: -71.5430, continent: 'South America' },
  { id: 'CN', name: 'China', code: 'CHN', flag: '🇨🇳', lat: 35.8617, lng: 104.1954, continent: 'Asia' },
  { id: 'CO', name: 'Colombia', code: 'COL', flag: '🇨🇴', lat: 4.5709, lng: -74.2973, continent: 'South America' },
  { id: 'KM', name: 'Comoros', code: 'COM', flag: '🇰🇲', lat: -11.8753, lng: 43.8722, continent: 'Africa' },
  { id: 'CG', name: 'Congo (Congo-Brazzaville)', code: 'COG', flag: '🇨🇬', lat: -0.2280, lng: 15.8277, continent: 'Africa' },
  { id: 'CD', name: 'Congo (DRC)', code: 'COD', flag: '🇨🇩', lat: -4.0383, lng: 21.7587, continent: 'Africa' },
  { id: 'CR', name: 'Costa Rica', code: 'CRI', flag: '🇨🇷', lat: 9.7489, lng: -83.7534, continent: 'North America' },
  { id: 'HR', name: 'Croatia', code: 'HRV', flag: '🇭🇷', lat: 45.1000, lng: 15.2000, continent: 'Europe' },
  { id: 'CU', name: 'Cuba', code: 'CUB', flag: '🇨🇺', lat: 21.5218, lng: -77.7812, continent: 'North America' },
  { id: 'CY', name: 'Cyprus', code: 'CYP', flag: '🇨🇾', lat: 35.1264, lng: 33.4299, continent: 'Europe' },
  { id: 'CZ', name: 'Czech Republic', code: 'CZE', flag: '🇨🇿', lat: 49.8175, lng: 15.4730, continent: 'Europe' },

  // D (4)
  { id: 'DK', name: 'Denmark', code: 'DNK', flag: '🇩🇰', lat: 56.2639, lng: 9.5018, continent: 'Europe' },
  { id: 'DJ', name: 'Djibouti', code: 'DJI', flag: '🇩🇯', lat: 11.8251, lng: 42.5903, continent: 'Africa' },
  { id: 'DM', name: 'Dominica', code: 'DMA', flag: '🇩🇲', lat: 15.4150, lng: -61.3710, continent: 'North America' },
  { id: 'DO', name: 'Dominican Republic', code: 'DOM', flag: '🇩🇴', lat: 18.7357, lng: -70.1627, continent: 'North America' },

  // E (8)
  { id: 'EC', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', lat: -1.8312, lng: -78.1834, continent: 'South America' },
  { id: 'EG', name: 'Egypt', code: 'EGY', flag: '🇪🇬', lat: 26.8206, lng: 30.8025, continent: 'Africa' },
  { id: 'SV', name: 'El Salvador', code: 'SLV', flag: '🇸🇻', lat: 13.7942, lng: -88.8965, continent: 'North America' },
  { id: 'GQ', name: 'Equatorial Guinea', code: 'GNQ', flag: '🇬🇶', lat: 1.6508, lng: 10.2679, continent: 'Africa' },
  { id: 'ER', name: 'Eritrea', code: 'ERI', flag: '🇪🇷', lat: 15.1794, lng: 39.7823, continent: 'Africa' },
  { id: 'EE', name: 'Estonia', code: 'EST', flag: '🇪🇪', lat: 58.5953, lng: 25.0136, continent: 'Europe' },
  { id: 'SZ', name: 'Eswatini', code: 'SWZ', flag: '🇸🇿', lat: -26.5225, lng: 31.4659, continent: 'Africa' },
  { id: 'ET', name: 'Ethiopia', code: 'ETH', flag: '🇪🇹', lat: 9.1450, lng: 40.4897, continent: 'Africa' },

  // F (3)
  { id: 'FJ', name: 'Fiji', code: 'FJI', flag: '🇫🇯', lat: -17.7134, lng: 178.0650, continent: 'Oceania' },
  { id: 'FI', name: 'Finland', code: 'FIN', flag: '🇫🇮', lat: 61.9241, lng: 25.7482, continent: 'Europe' },
  { id: 'FR', name: 'France', code: 'FRA', flag: '🇫🇷', lat: 46.2276, lng: 2.2137, continent: 'Europe' },

  // G (11)
  { id: 'GA', name: 'Gabon', code: 'GAB', flag: '🇬🇦', lat: -0.8037, lng: 11.6094, continent: 'Africa' },
  { id: 'GM', name: 'Gambia', code: 'GMB', flag: '🇬🇲', lat: 13.4432, lng: -15.3101, continent: 'Africa' },
  { id: 'GE', name: 'Georgia', code: 'GEO', flag: '🇬🇪', lat: 42.3154, lng: 43.3569, continent: 'Asia' },
  { id: 'DE', name: 'Germany', code: 'DEU', flag: '🇩🇪', lat: 51.1657, lng: 10.4515, continent: 'Europe' },
  { id: 'GH', name: 'Ghana', code: 'GHA', flag: '🇬🇭', lat: 7.9465, lng: -1.0232, continent: 'Africa' },
  { id: 'GR', name: 'Greece', code: 'GRC', flag: '🇬🇷', lat: 39.0742, lng: 21.8243, continent: 'Europe' },
  { id: 'GD', name: 'Grenada', code: 'GRD', flag: '🇬🇩', lat: 12.1165, lng: -61.6790, continent: 'North America' },
  { id: 'GT', name: 'Guatemala', code: 'GTM', flag: '🇬🇹', lat: 15.7835, lng: -90.2308, continent: 'North America' },
  { id: 'GN', name: 'Guinea', code: 'GIN', flag: '🇬🇳', lat: 9.9456, lng: -9.6966, continent: 'Africa' },
  { id: 'GW', name: 'Guinea-Bissau', code: 'GNB', flag: '🇬🇼', lat: 11.8037, lng: -15.1804, continent: 'Africa' },
  { id: 'GY', name: 'Guyana', code: 'GUY', flag: '🇬🇾', lat: 4.8604, lng: -58.9302, continent: 'South America' },

  // H (3)
  { id: 'HT', name: 'Haiti', code: 'HTI', flag: '🇭🇹', lat: 18.9712, lng: -72.2852, continent: 'North America' },
  { id: 'HN', name: 'Honduras', code: 'HND', flag: '🇭🇳', lat: 15.2000, lng: -86.2419, continent: 'North America' },
  { id: 'HU', name: 'Hungary', code: 'HUN', flag: '🇭🇺', lat: 47.1625, lng: 19.5033, continent: 'Europe' },

  // I (9)
  { id: 'IS', name: 'Iceland', code: 'ISL', flag: '🇮🇸', lat: 64.9631, lng: -19.0208, continent: 'Europe' },
  { id: 'IN', name: 'India', code: 'IND', flag: '🇮🇳', lat: 20.5937, lng: 78.9629, continent: 'Asia' },
  { id: 'ID', name: 'Indonesia', code: 'IDN', flag: '🇮🇩', lat: -0.7893, lng: 113.9213, continent: 'Asia' },
  { id: 'IR', name: 'Iran', code: 'IRN', flag: '🇮🇷', lat: 32.4279, lng: 53.6880, continent: 'Asia' },
  { id: 'IQ', name: 'Iraq', code: 'IRQ', flag: '🇮🇶', lat: 33.2232, lng: 43.6793, continent: 'Asia' },
  { id: 'IE', name: 'Ireland', code: 'IRL', flag: '🇮🇪', lat: 53.1424, lng: -7.6921, continent: 'Europe' },
  { id: 'IL', name: 'Israel', code: 'ISR', flag: '🇮🇱', lat: 31.0461, lng: 34.8516, continent: 'Asia' },
  { id: 'IT', name: 'Italy', code: 'ITA', flag: '🇮🇹', lat: 41.8719, lng: 12.5674, continent: 'Europe' },
  { id: 'CI', name: 'Ivory Coast (Côte d\'Ivoire)', code: 'CIV', flag: '🇨🇮', lat: 7.5400, lng: -5.5471, continent: 'Africa' },

  // J (3)
  { id: 'JM', name: 'Jamaica', code: 'JAM', flag: '🇯🇲', lat: 18.1096, lng: -77.2975, continent: 'North America' },
  { id: 'JP', name: 'Japan', code: 'JPN', flag: '🇯🇵', lat: 36.2048, lng: 138.2529, continent: 'Asia' },
  { id: 'JO', name: 'Jordan', code: 'JOR', flag: '🇯🇴', lat: 30.5852, lng: 36.2384, continent: 'Asia' },

  // K (5)
  { id: 'KZ', name: 'Kazakhstan', code: 'KAZ', flag: '🇰🇿', lat: 48.0196, lng: 66.9237, continent: 'Asia' },
  { id: 'KE', name: 'Kenya', code: 'KEN', flag: '🇰🇪', lat: -0.0236, lng: 37.9062, continent: 'Africa' },
  { id: 'KI', name: 'Kiribati', code: 'KIR', flag: '🇰🇮', lat: -3.3704, lng: -168.7340, continent: 'Oceania' },
  { id: 'KW', name: 'Kuwait', code: 'KWT', flag: '🇰🇼', lat: 29.3117, lng: 47.4818, continent: 'Asia' },
  { id: 'KG', name: 'Kyrgyzstan', code: 'KGZ', flag: '🇰🇬', lat: 41.2044, lng: 74.7661, continent: 'Asia' },

  // L (9)
  { id: 'LA', name: 'Laos', code: 'LAO', flag: '🇱🇦', lat: 19.8563, lng: 102.4955, continent: 'Asia' },
  { id: 'LV', name: 'Latvia', code: 'LVA', flag: '🇱🇻', lat: 56.8796, lng: 24.6032, continent: 'Europe' },
  { id: 'LB', name: 'Lebanon', code: 'LBN', flag: '🇱🇧', lat: 33.8547, lng: 35.8623, continent: 'Asia' },
  { id: 'LS', name: 'Lesotho', code: 'LSO', flag: '🇱🇸', lat: -29.6099, lng: 28.2336, continent: 'Africa' },
  { id: 'LR', name: 'Liberia', code: 'LBR', flag: '🇱🇷', lat: 6.4281, lng: -9.4295, continent: 'Africa' },
  { id: 'LY', name: 'Libya', code: 'LBY', flag: '🇱🇾', lat: 26.3351, lng: 17.2283, continent: 'Africa' },
  { id: 'LI', name: 'Liechtenstein', code: 'LIE', flag: '🇱🇮', lat: 47.1660, lng: 9.5554, continent: 'Europe' },
  { id: 'LT', name: 'Lithuania', code: 'LTU', flag: '🇱🇹', lat: 55.1694, lng: 23.8813, continent: 'Europe' },
  { id: 'LU', name: 'Luxembourg', code: 'LUX', flag: '🇱🇺', lat: 49.8153, lng: 6.1296, continent: 'Europe' },

  // M (18)
  { id: 'MG', name: 'Madagascar', code: 'MDG', flag: '🇲🇬', lat: -18.7669, lng: 46.8691, continent: 'Africa' },
  { id: 'MW', name: 'Malawi', code: 'MWI', flag: '🇲🇼', lat: -13.2543, lng: 34.3015, continent: 'Africa' },
  { id: 'MY', name: 'Malaysia', code: 'MYS', flag: '🇲🇾', lat: 4.2105, lng: 101.9758, continent: 'Asia' },
  { id: 'MV', name: 'Maldives', code: 'MDV', flag: '🇲🇻', lat: 3.2028, lng: 73.2207, continent: 'Asia' },
  { id: 'ML', name: 'Mali', code: 'MLI', flag: '🇲🇱', lat: 17.5707, lng: -3.9962, continent: 'Africa' },
  { id: 'MT', name: 'Malta', code: 'MLT', flag: '🇲🇹', lat: 35.9375, lng: 14.3754, continent: 'Europe' },
  { id: 'MH', name: 'Marshall Islands', code: 'MHL', flag: '🇲🇭', lat: 7.1315, lng: 171.1845, continent: 'Oceania' },
  { id: 'MR', name: 'Mauritania', code: 'MRT', flag: '🇲🇷', lat: 21.0079, lng: -10.9408, continent: 'Africa' },
  { id: 'MU', name: 'Mauritius', code: 'MUS', flag: '🇲🇺', lat: -20.3484, lng: 57.5522, continent: 'Africa' },
  { id: 'MX', name: 'Mexico', code: 'MEX', flag: '🇲🇽', lat: 23.6345, lng: -102.5528, continent: 'North America' },
  { id: 'FM', name: 'Micronesia', code: 'FSM', flag: '🇫🇲', lat: 7.4256, lng: 150.5508, continent: 'Oceania' },
  { id: 'MD', name: 'Moldova', code: 'MDA', flag: '🇲🇩', lat: 47.4116, lng: 28.3699, continent: 'Europe' },
  { id: 'MC', name: 'Monaco', code: 'MCO', flag: '🇲🇨', lat: 43.7384, lng: 7.4246, continent: 'Europe' },
  { id: 'MN', name: 'Mongolia', code: 'MNG', flag: '🇲🇳', lat: 46.8625, lng: 103.8467, continent: 'Asia' },
  { id: 'ME', name: 'Montenegro', code: 'MNE', flag: '🇲🇪', lat: 42.7087, lng: 19.3744, continent: 'Europe' },
  { id: 'MA', name: 'Morocco', code: 'MAR', flag: '🇲🇦', lat: 31.7917, lng: -7.0926, continent: 'Africa' },
  { id: 'MZ', name: 'Mozambique', code: 'MOZ', flag: '🇲🇿', lat: -18.6657, lng: 35.5296, continent: 'Africa' },
  { id: 'MM', name: 'Myanmar (Burma)', code: 'MMR', flag: '🇲🇲', lat: 21.9162, lng: 95.9560, continent: 'Asia' },

  // N (11)
  { id: 'NA', name: 'Namibia', code: 'NAM', flag: '🇳🇦', lat: -22.9576, lng: 18.4904, continent: 'Africa' },
  { id: 'NR', name: 'Nauru', code: 'NRU', flag: '🇳🇷', lat: -0.5228, lng: 166.9315, continent: 'Oceania' },
  { id: 'NP', name: 'Nepal', code: 'NPL', flag: '🇳🇵', lat: 28.3949, lng: 84.1240, continent: 'Asia' },
  { id: 'NL', name: 'Netherlands', code: 'NLD', flag: '🇳🇱', lat: 52.1326, lng: 5.2913, continent: 'Europe' },
  { id: 'NZ', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', lat: -40.9006, lng: 174.8860, continent: 'Oceania' },
  { id: 'NI', name: 'Nicaragua', code: 'NIC', flag: '🇳🇮', lat: 12.8654, lng: -85.2072, continent: 'North America' },
  { id: 'NE', name: 'Niger', code: 'NER', flag: '🇳🇪', lat: 17.6078, lng: 8.0817, continent: 'Africa' },
  { id: 'NG', name: 'Nigeria', code: 'NGA', flag: '🇳🇬', lat: 9.0820, lng: 8.6753, continent: 'Africa' },
  { id: 'KP', name: 'North Korea', code: 'PRK', flag: '🇰🇵', lat: 40.3399, lng: 127.5101, continent: 'Asia' },
  { id: 'MK', name: 'North Macedonia', code: 'MKD', flag: '🇲🇰', lat: 41.6086, lng: 21.7453, continent: 'Europe' },
  { id: 'NO', name: 'Norway', code: 'NOR', flag: '🇳🇴', lat: 60.4720, lng: 8.4689, continent: 'Europe' },

  // O (1)
  { id: 'OM', name: 'Oman', code: 'OMN', flag: '🇴🇲', lat: 21.4735, lng: 55.9754, continent: 'Asia' },

  // P (10)
  { id: 'PK', name: 'Pakistan', code: 'PAK', flag: '🇵🇰', lat: 30.3753, lng: 69.3451, continent: 'Asia' },
  { id: 'PW', name: 'Palau', code: 'PLW', flag: '🇵🇼', lat: 7.5150, lng: 134.5825, continent: 'Oceania' },
  { id: 'PS', name: 'Palestine', code: 'PSE', flag: '🇵🇸', lat: 31.9522, lng: 35.2332, continent: 'Asia' }, // UN Observer State
  { id: 'PA', name: 'Panama', code: 'PAN', flag: '🇵🇦', lat: 8.5379, lng: -80.7821, continent: 'North America' },
  { id: 'PG', name: 'Papua New Guinea', code: 'PNG', flag: '🇵🇬', lat: -6.314993, lng: 143.95555, continent: 'Oceania' },
  { id: 'PY', name: 'Paraguay', code: 'PRY', flag: '🇵🇾', lat: -23.4425, lng: -58.4438, continent: 'South America' },
  { id: 'PE', name: 'Peru', code: 'PER', flag: '🇵🇪', lat: -9.1900, lng: -75.0152, continent: 'South America' },
  { id: 'PH', name: 'Philippines', code: 'PHL', flag: '🇵🇭', lat: 12.8797, lng: 121.7740, continent: 'Asia' },
  { id: 'PL', name: 'Poland', code: 'POL', flag: '🇵🇱', lat: 51.9194, lng: 19.1451, continent: 'Europe' },
  { id: 'PT', name: 'Portugal', code: 'PRT', flag: '🇵🇹', lat: 39.3999, lng: -8.2245, continent: 'Europe' },

  // Q (1)
  { id: 'QA', name: 'Qatar', code: 'QAT', flag: '🇶🇦', lat: 25.3548, lng: 51.1839, continent: 'Asia' },

  // R (3)
  { id: 'RO', name: 'Romania', code: 'ROU', flag: '🇷🇴', lat: 45.9432, lng: 24.9668, continent: 'Europe' },
  { id: 'RU', name: 'Russia', code: 'RUS', flag: '🇷🇺', lat: 61.5240, lng: 105.3188, continent: 'Europe' },
  { id: 'RW', name: 'Rwanda', code: 'RWA', flag: '🇷🇼', lat: -1.9403, lng: 29.8739, continent: 'Africa' },

  // S (27)
  { id: 'KN', name: 'Saint Kitts and Nevis', code: 'KNA', flag: '🇰🇳', lat: 17.3578, lng: -62.7830, continent: 'North America' },
  { id: 'LC', name: 'Saint Lucia', code: 'LCA', flag: '🇱🇨', lat: 13.9094, lng: -60.9789, continent: 'North America' },
  { id: 'VC', name: 'Saint Vincent and the Grenadines', code: 'VCT', flag: '🇻🇨', lat: 12.9843, lng: -61.2872, continent: 'North America' },
  { id: 'WS', name: 'Samoa', code: 'WSM', flag: '🇼🇸', lat: -13.7590, lng: -172.1046, continent: 'Oceania' },
  { id: 'SM', name: 'San Marino', code: 'SMR', flag: '🇸🇲', lat: 43.9424, lng: 12.4578, continent: 'Europe' },
  { id: 'ST', name: 'Sao Tome and Principe', code: 'STP', flag: '🇸🇹', lat: 0.1864, lng: 6.6131, continent: 'Africa' },
  { id: 'SA', name: 'Saudi Arabia', code: 'SAU', flag: '🇸🇦', lat: 23.8859, lng: 45.0792, continent: 'Asia' },
  { id: 'SN', name: 'Senegal', code: 'SEN', flag: '🇸🇳', lat: 14.4974, lng: -14.4524, continent: 'Africa' },
  { id: 'RS', name: 'Serbia', code: 'SRB', flag: '🇷🇸', lat: 44.0165, lng: 21.0059, continent: 'Europe' },
  { id: 'SC', name: 'Seychelles', code: 'SYC', flag: '🇸🇨', lat: -4.6796, lng: 55.4920, continent: 'Africa' },
  { id: 'SL', name: 'Sierra Leone', code: 'SLE', flag: '🇸🇱', lat: 8.4606, lng: -11.7799, continent: 'Africa' },
  { id: 'SG', name: 'Singapore', code: 'SGP', flag: '🇸🇬', lat: 1.3521, lng: 103.8198, continent: 'Asia' },
  { id: 'SK', name: 'Slovakia', code: 'SVK', flag: '🇸🇰', lat: 48.6690, lng: 19.6990, continent: 'Europe' },
  { id: 'SI', name: 'Slovenia', code: 'SVN', flag: '🇸🇮', lat: 46.1512, lng: 14.9955, continent: 'Europe' },
  { id: 'SB', name: 'Solomon Islands', code: 'SLB', flag: '🇸🇧', lat: -9.6457, lng: 160.1562, continent: 'Oceania' },
  { id: 'SO', name: 'Somalia', code: 'SOM', flag: '🇸🇴', lat: 5.1521, lng: 46.1996, continent: 'Africa' },
  { id: 'ZA', name: 'South Africa', code: 'ZAF', flag: '🇿🇦', lat: -30.5595, lng: 22.9375, continent: 'Africa' },
  { id: 'KR', name: 'South Korea', code: 'KOR', flag: '🇰🇷', lat: 35.9078, lng: 127.7669, continent: 'Asia' },
  { id: 'SS', name: 'South Sudan', code: 'SSD', flag: '🇸🇸', lat: 6.8770, lng: 31.3070, continent: 'Africa' },
  { id: 'ES', name: 'Spain', code: 'ESP', flag: '🇪🇸', lat: 40.4637, lng: -3.7492, continent: 'Europe' },
  { id: 'LK', name: 'Sri Lanka', code: 'LKA', flag: '🇱🇰', lat: 7.8731, lng: 80.7718, continent: 'Asia' },
  { id: 'SD', name: 'Sudan', code: 'SDN', flag: '🇸🇩', lat: 12.8628, lng: 30.2176, continent: 'Africa' },
  { id: 'SR', name: 'Suriname', code: 'SUR', flag: '🇸🇷', lat: 3.9193, lng: -56.0278, continent: 'South America' },
  { id: 'SE', name: 'Sweden', code: 'SWE', flag: '🇸🇪', lat: 60.1282, lng: 18.6435, continent: 'Europe' },
  { id: 'CH', name: 'Switzerland', code: 'CHE', flag: '🇨🇭', lat: 46.8182, lng: 8.2275, continent: 'Europe' },
  { id: 'SY', name: 'Syria', code: 'SYR', flag: '🇸🇾', lat: 34.8021, lng: 38.9968, continent: 'Asia' },

  // T (11)
  { id: 'TJ', name: 'Tajikistan', code: 'TJK', flag: '🇹🇯', lat: 38.8610, lng: 71.2761, continent: 'Asia' },
  { id: 'TZ', name: 'Tanzania', code: 'TZA', flag: '🇹🇿', lat: -6.3690, lng: 34.8888, continent: 'Africa' },
  { id: 'TH', name: 'Thailand', code: 'THA', flag: '🇹🇭', lat: 15.8700, lng: 100.9925, continent: 'Asia' },
  { id: 'TL', name: 'Timor-Leste', code: 'TLS', flag: '🇹🇱', lat: -8.8742, lng: 125.7275, continent: 'Asia' },
  { id: 'TG', name: 'Togo', code: 'TGO', flag: '🇹🇬', lat: 8.6195, lng: 0.8248, continent: 'Africa' },
  { id: 'TO', name: 'Tonga', code: 'TON', flag: '🇹🇴', lat: -21.1789, lng: -175.1982, continent: 'Oceania' },
  { id: 'TT', name: 'Trinidad and Tobago', code: 'TTO', flag: '🇹🇹', lat: 10.6918, lng: -61.2225, continent: 'North America' },
  { id: 'TN', name: 'Tunisia', code: 'TUN', flag: '🇹🇳', lat: 33.8869, lng: 9.5375, continent: 'Africa' },
  { id: 'TR', name: 'Turkey', code: 'TUR', flag: '🇹🇷', lat: 38.9637, lng: 35.2433, continent: 'Asia' },
  { id: 'TM', name: 'Turkmenistan', code: 'TKM', flag: '🇹🇲', lat: 38.9697, lng: 59.5563, continent: 'Asia' },
  { id: 'TV', name: 'Tuvalu', code: 'TUV', flag: '🇹🇻', lat: -7.1095, lng: 177.6493, continent: 'Oceania' },

  // U (7)
  { id: 'UG', name: 'Uganda', code: 'UGA', flag: '🇺🇬', lat: 1.3733, lng: 32.2903, continent: 'Africa' },
  { id: 'UA', name: 'Ukraine', code: 'UKR', flag: '🇺🇦', lat: 48.3794, lng: 31.1656, continent: 'Europe' },
  { id: 'AE', name: 'United Arab Emirates', code: 'ARE', flag: '🇦🇪', lat: 23.4241, lng: 53.8478, continent: 'Asia' },
  { id: 'GB', name: 'United Kingdom', code: 'GBR', flag: '🇬🇧', lat: 55.3781, lng: -3.4360, continent: 'Europe' },
  { id: 'US', name: 'United States', code: 'USA', flag: '🇺🇸', lat: 37.0902, lng: -95.7129, continent: 'North America' },
  { id: 'UY', name: 'Uruguay', code: 'URY', flag: '🇺🇾', lat: -32.5228, lng: -55.7658, continent: 'South America' },
  { id: 'UZ', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', lat: 41.3775, lng: 64.5853, continent: 'Asia' },

  // V (4)
  { id: 'VU', name: 'Vanuatu', code: 'VUT', flag: '🇻🇺', lat: -15.3767, lng: 166.9592, continent: 'Oceania' },
  { id: 'VA', name: 'Vatican City', code: 'VAT', flag: '🇻🇦', lat: 41.9029, lng: 12.4534, continent: 'Europe' }, // UN Observer State
  { id: 'VE', name: 'Venezuela', code: 'VEN', flag: '🇻🇪', lat: 6.4238, lng: -66.5897, continent: 'South America' },
  { id: 'VN', name: 'Vietnam', code: 'VNM', flag: '🇻🇳', lat: 14.0583, lng: 108.2772, continent: 'Asia' },

  // Y (1)
  { id: 'YE', name: 'Yemen', code: 'YEM', flag: '🇾🇪', lat: 15.5527, lng: 48.5164, continent: 'Asia' },

  // Z (2)
  { id: 'ZM', name: 'Zambia', code: 'ZMB', flag: '🇿🇲', lat: -13.1339, lng: 27.8493, continent: 'Africa' },
  { id: 'ZW', name: 'Zimbabwe', code: 'ZWE', flag: '🇿🇼', lat: -19.0154, lng: 29.1549, continent: 'Africa' }
];
