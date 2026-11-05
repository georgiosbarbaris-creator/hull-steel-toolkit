# -*- coding: utf-8 -*-
"""Sea-route network + main bulk ports for the Voyage Calc app.
Distances are ESTIMATES (great-circle legs through a waypoint network) — the user overrides them with BP/Netpas figures
and the app remembers his own distances. Run: python3 tools/voyage_ports.py  -> voyage/ports.json (+ self-test)."""
import json, math, heapq, pathlib

N = {  # waypoint: (lat, lon)
 "DOVER":(51.0,1.6),"NSEA":(53.5,2.6),"GBIGHT":(54.1,7.6),"SKAW":(57.9,10.9),"GBELT":(55.4,10.95),"BALT":(55.6,17.0),"GOF":(59.8,25.0),
 "USHANT":(48.4,-5.8),"FINIS":(43.3,-9.9),"STVINC":(36.9,-9.4),"GIB":(35.95,-5.5),"CGATA":(36.6,-2.0),"WMED":(38.6,4.5),
 "CBON":(37.45,11.3),"MESS":(38.1,15.65),"IONIAN":(37.3,20.6),"MATAPAN":(36.1,22.5),"MALEA":(36.3,23.3),"OTRANTO":(39.9,18.9),
 "CAFIREAS":(38.0,24.7),"AEGN":(39.7,24.0),"DARD":(39.95,26.05),"BOSP":(41.25,29.15),"PSAID":(31.45,32.35),"SUEZS":(29.85,32.55),
 "REDN":(27.4,34.1),"BAB":(12.6,43.35),"GUARD":(12.2,52.0),"HORMUZ":(26.4,56.6),"DONDRA":(5.6,80.6),"WEH":(6.2,95.0),"SING":(1.2,104.1),
 "SUNDA":(-6.1,105.8),"KARIMATA":(-1.8,108.3),"JAVA":(-5.0,112.0),"LOMBOK":(-8.9,115.8),"MAKASSAR":(-2.5,117.9),"SIBUTU":(4.8,119.4),
 "MINDORO":(12.5,120.2),"VUNGTAU":(9.5,109.5),"HAINANS":(17.3,110.5),"TONKIN":(19.5,107.3),"HKOFF":(21.5,114.8),"TAIWANST":(24.6,119.8),
 "LUZON":(20.5,121.5),"ECS":(30.8,123.5),"YELLOW":(35.5,123.3),"BOHAI":(38.4,121.3),"KOREAST":(34.6,129.6),"SJAPAN":(33.0,135.0),"JPNE":(34.8,140.8),
 "PALAU":(5.0,132.0),"VITIAZ":(-5.8,147.6),"JOMARD":(-11.3,152.2),"EAUS":(-25.0,154.2),
 "CGH":(-35.1,18.4),"ALGOA":(-34.8,26.0),"MOZCH":(-20.0,40.5),"LEEUWIN":(-35.3,114.8),"NWCAPE":(-21.0,113.5),
 "DAKAR":(14.6,-17.8),"OFFSL":(7.0,-14.5),"LIBERIA":(4.0,-9.5),"GUINEA":(4.0,3.0),
 "SAOROQUE":(-5.0,-34.7),"CABOFRIO":(-23.1,-41.8),"PLATE":(-35.1,-55.5),"TRIN":(11.5,-60.5),
 "MONA":(18.3,-67.8),"WINDWARD":(20.0,-73.9),"COLON":(9.45,-79.9),"PANPAC":(8.8,-79.5),"YUCATAN":(21.9,-85.8),"GULF":(26.0,-88.0),
 "FLSTR":(24.3,-81.8),"MIAMI":(26.0,-79.8),"HATTERAS":(35.0,-75.0),"CHES":(36.95,-75.9),"DELA":(38.75,-74.9),"NYOFF":(40.3,-73.6),
 "CABOT":(47.4,-59.6),"GASPE":(49.2,-64.3),"MEX":(15.0,-96.0),"CSL":(22.6,-110.0),"SFOFF":(37.7,-123.2),"JDF":(48.5,-124.9),"HARO":(48.35,-123.3),
 "PERUOFF":(-6.0,-82.0),"RHODES":(36.45,28.3),"DODEC":(37.6,26.5),"MIYAKO":(25.0,125.5),"EQATL":(0.0,-9.0),"THERM":(39.9,23.15),
}
# edges; third element = canal name for avoid-options
E = [("DOVER","NSEA"),("NSEA","GBIGHT"),("GBIGHT","SKAW"),("DOVER","GBIGHT"),("NSEA","SKAW"),("SKAW","GBELT"),("GBELT","BALT"),("BALT","GOF"),
 ("DOVER","USHANT"),("USHANT","FINIS"),("FINIS","STVINC"),("STVINC","GIB"),("GIB","CGATA"),("CGATA","WMED"),("WMED","CBON"),("WMED","MESS"),
 ("MESS","IONIAN"),("CBON","IONIAN"),("CBON","MATAPAN"),("IONIAN","MATAPAN"),("IONIAN","OTRANTO"),("MATAPAN","MALEA"),("CBON","PSAID"),
 ("MATAPAN","PSAID"),("MALEA","PSAID"),("MALEA","CAFIREAS"),("CAFIREAS","AEGN"),("CAFIREAS","DARD"),("AEGN","DARD"),("MALEA","DARD"),
 ("CAFIREAS","PSAID"),("DARD","BOSP"),
 ("PSAID","SUEZS","Suez"),("SUEZS","REDN"),("REDN","BAB"),("BAB","GUARD"),("GUARD","HORMUZ"),("GUARD","DONDRA"),("HORMUZ","DONDRA"),
 ("GUARD","MOZCH"),("MOZCH","ALGOA"),("ALGOA","CGH"),("MOZCH","DONDRA"),("DONDRA","WEH"),("WEH","SING"),("CGH","SUNDA"),("CGH","LOMBOK"),
 ("CGH","WEH"),("CGH","DONDRA"),("CGH","LEEUWIN"),("ALGOA","LEEUWIN"),("ALGOA","SUNDA"),("LEEUWIN","NWCAPE"),("NWCAPE","LOMBOK"),("NWCAPE","SUNDA"),
 ("SUNDA","JAVA"),("JAVA","KARIMATA"),("KARIMATA","SING"),("JAVA","LOMBOK"),("JAVA","MAKASSAR"),("LOMBOK","MAKASSAR"),("MAKASSAR","SIBUTU"),
 ("SIBUTU","MINDORO"),("MINDORO","HKOFF"),("MINDORO","LUZON"),("SIBUTU","PALAU"),
 ("SING","VUNGTAU"),("VUNGTAU","HAINANS"),("HAINANS","TONKIN"),("HAINANS","HKOFF"),("VUNGTAU","MINDORO"),("HKOFF","TAIWANST"),("TAIWANST","ECS"),
 ("ECS","YELLOW"),("YELLOW","BOHAI"),("ECS","KOREAST"),("YELLOW","KOREAST"),("HKOFF","LUZON"),("LUZON","ECS"),("LUZON","SJAPAN"),
 ("KOREAST","SJAPAN"),("SJAPAN","JPNE"),("ECS","SJAPAN"),("LUZON","PALAU"),("PALAU","VITIAZ"),("VITIAZ","JOMARD"),("JOMARD","EAUS"),
 ("JPNE","JDF"),("JPNE","SFOFF"),("JPNE","PANPAC"),("SJAPAN","PANPAC"),("PANPAC","MEX"),("MEX","CSL"),("CSL","SFOFF"),("SFOFF","JDF"),("JDF","HARO"),
 ("PANPAC","EAUS"),("PANPAC","PERUOFF"),("PERUOFF","LUZON"),("PERUOFF","JPNE"),("PERUOFF","EAUS"),
 ("PANPAC","COLON","Panama"),("COLON","MONA"),("COLON","WINDWARD"),("COLON","YUCATAN"),("COLON","TRIN"),("TRIN","SAOROQUE"),("TRIN","MONA"),
 ("YUCATAN","GULF"),("YUCATAN","WINDWARD"),("GULF","FLSTR"),("FLSTR","MIAMI"),("MIAMI","HATTERAS"),("WINDWARD","HATTERAS"),("MONA","HATTERAS"),
 ("HATTERAS","CHES"),("CHES","DELA"),("DELA","NYOFF"),("HATTERAS","DELA"),("NYOFF","CABOT"),("CABOT","GASPE"),("HATTERAS","NYOFF"),
 ("USHANT","HATTERAS"),("USHANT","NYOFF"),("USHANT","CABOT"),("FINIS","HATTERAS"),("STVINC","HATTERAS"),("STVINC","MONA"),("GIB","MONA"),
 ("MONA","SAOROQUE"),("HATTERAS","SAOROQUE"),("STVINC","DAKAR"),("GIB","DAKAR"),("DAKAR","SAOROQUE"),("STVINC","SAOROQUE"),("FINIS","SAOROQUE"),
 ("USHANT","SAOROQUE"),("SAOROQUE","CABOFRIO"),("CABOFRIO","PLATE"),("CABOFRIO","CGH"),("PLATE","CGH"),("SAOROQUE","CGH"),
 ("DAKAR","OFFSL"),("OFFSL","LIBERIA"),("LIBERIA","GUINEA"),("GUINEA","CGH"),("LIBERIA","CGH"),("OFFSL","SAOROQUE"),("MONA","DAKAR"),
 ("USHANT","DAKAR"),("RHODES","DODEC"),("THERM","AEGN"),("THERM","CAFIREAS"),("RHODES","PSAID"),("RHODES","MALEA"),("DODEC","AEGN"),("DODEC","DARD"),("DODEC","CAFIREAS"),
 ("SUNDA","KARIMATA"),("KARIMATA","VUNGTAU"),("PALAU","MIYAKO"),("VITIAZ","MIYAKO"),("MIYAKO","ECS"),("MIYAKO","YELLOW"),("MIYAKO","LUZON"),("MIYAKO","KOREAST"),
 ("CGH","EQATL"),("EQATL","DAKAR"),("EQATL","GUINEA"),("EQATL","SAOROQUE"),("EQATL","LIBERIA"),("FINIS","DAKAR"),("FLSTR","HATTERAS"),("GULF","YUCATAN"),("WINDWARD","MONA"),("TRIN","DAKAR"),("TRIN","HATTERAS"),
]
# ports: name, country, lat, lon, gates
P = [
 # Brazil / River Plate
 ("Rio Grande","BR",-32.15,-52.08,["PLATE","CABOFRIO","CGH"]),("Paranagua","BR",-25.55,-48.3,["CABOFRIO","CGH"]),("Santos","BR",-24.05,-46.3,["CABOFRIO","CGH"]),
 ("Rio de Janeiro","BR",-22.95,-43.15,["CABOFRIO","CGH"]),("Itaguai / Sepetiba","BR",-23.05,-43.85,["CABOFRIO","CGH"]),("Tubarao / Vitoria","BR",-20.3,-40.2,["CABOFRIO","SAOROQUE","CGH"]),
 ("Salvador","BR",-13.0,-38.5,["SAOROQUE","CABOFRIO","CGH"]),("Suape / Recife","BR",-8.4,-34.95,["SAOROQUE"]),("Itaqui / Ponta da Madeira","BR",-2.55,-44.35,["SAOROQUE","DAKAR","TRIN"]),
 ("Vila do Conde / Barcarena","BR",-1.55,-48.75,["SAOROQUE","DAKAR","TRIN"],60),("Santarem","BR",-2.43,-54.7,["SAOROQUE","DAKAR","TRIN"],350),
 ("San Lorenzo / Rosario","AR",-32.75,-60.7,["PLATE"],150),("Buenos Aires","AR",-34.6,-58.37,["PLATE"],25),("Bahia Blanca","AR",-38.8,-62.3,["PLATE"]),
 ("Necochea","AR",-38.57,-58.7,["PLATE"]),("Montevideo","UY",-34.9,-56.2,["PLATE"]),("Nueva Palmira","UY",-33.88,-58.42,["PLATE"],40),
 # NW Europe / Baltic
 ("Rotterdam","NL",51.98,4.05,["DOVER","NSEA"]),("Amsterdam","NL",52.47,4.58,["NSEA","DOVER"]),("Antwerp","BE",51.3,4.3,["DOVER"]),("Ghent","BE",51.1,3.75,["DOVER"]),
 ("Dunkirk","FR",51.05,2.35,["DOVER"]),("Hamburg","DE",53.55,9.95,["GBIGHT"]),("Bremen / Brake","DE",53.33,8.5,["GBIGHT"]),("Immingham","GB",53.63,-0.2,["NSEA"]),
 ("Tyne / Blyth","GB",55.0,-1.4,["NSEA"]),("Liverpool","GB",53.45,-3.0,["USHANT"]),("Montoir / St Nazaire","FR",47.3,-2.15,["USHANT","FINIS"]),
 ("Gdansk","PL",54.4,18.67,["BALT"]),("Klaipeda","LT",55.7,21.1,["BALT"]),("Riga","LV",57.05,24.0,["BALT"]),("Ust-Luga","RU",59.68,28.4,["GOF"]),
 ("St Petersburg","RU",59.9,30.2,["GOF"]),("Szczecin / Swinoujscie","PL",53.9,14.27,["BALT"]),
 # Iberia / W Med
 ("Bilbao","ES",43.35,-3.05,["FINIS","USHANT"]),("Gijon","ES",43.56,-5.7,["FINIS","USHANT"]),("Lisbon","PT",38.7,-9.1,["STVINC","FINIS"]),
 ("Sines","PT",37.95,-8.87,["STVINC"]),("Huelva","ES",37.2,-6.95,["STVINC","GIB"]),("Algeciras / Gibraltar","GI",36.13,-5.4,["GIB"]),
 ("Cartagena (ES)","ES",37.58,-0.98,["CGATA","WMED"]),("Valencia","ES",39.44,-0.32,["WMED","CGATA"]),("Castellon","ES",39.97,0.02,["WMED"]),
 ("Tarragona","ES",41.1,1.23,["WMED"]),("Barcelona","ES",41.35,2.17,["WMED"]),("Fos / Marseille","FR",43.4,4.87,["WMED"]),
 ("Genoa","IT",44.4,8.92,["WMED"]),("Livorno","IT",43.55,10.3,["WMED"]),("Civitavecchia","IT",42.1,11.78,["WMED","CBON"]),("Naples / Salerno","IT",40.8,14.25,["CBON","MESS"]),
 ("Algiers","DZ",36.77,3.07,["CGATA","WMED","CBON"]),("Annaba","DZ",36.9,7.77,["CBON","WMED"]),("Tunis / Rades","TN",36.8,10.3,["CBON"]),
 ("Jorf Lasfar","MA",33.1,-8.63,["STVINC","GIB","DAKAR"]),("Casablanca","MA",33.6,-7.6,["STVINC","GIB","DAKAR"]),
 ("Las Palmas","ES",28.15,-15.4,["GIB","STVINC","DAKAR","SAOROQUE"]),
 # C/E Med, Adriatic, Black Sea
 ("Taranto","IT",40.45,17.2,["OTRANTO","IONIAN"]),("Ravenna","IT",44.5,12.28,["OTRANTO"]),("Venice / Marghera","IT",45.4,12.4,["OTRANTO"]),
 ("Monfalcone","IT",45.78,13.55,["OTRANTO"]),("Koper","SI",45.55,13.73,["OTRANTO"]),("Rijeka","HR",45.32,14.43,["OTRANTO"]),("Ploce","HR",43.05,17.42,["OTRANTO"]),
 ("Bar","ME",42.08,19.08,["OTRANTO"]),("Durres","AL",41.3,19.43,["OTRANTO"]),
 ("Preveza","GR",38.95,20.75,["IONIAN"]),("Patras","GR",38.25,21.73,["IONIAN"]),("Piraeus / Elefsis","GR",37.93,23.6,["MALEA","CAFIREAS"]),
 ("Volos","GR",39.35,22.95,["THERM","AEGN"]),("Thessaloniki","GR",40.6,22.9,["THERM"]),("Kavala","GR",40.9,24.4,["AEGN","DARD"]),("Heraklion","GR",35.35,25.15,["MALEA","CAFIREAS","PSAID","DODEC"]),
 ("Larnaca","CY",34.9,33.65,["MALEA","PSAID","RHODES"]),("Limassol","CY",34.65,33.02,["MALEA","PSAID","RHODES"]),
 ("Izmir / Aliaga","TR",38.8,26.9,["CAFIREAS","DARD","DODEC"]),("Iskenderun","TR",36.6,36.15,["PSAID","MALEA","RHODES"]),("Mersin","TR",36.78,34.65,["PSAID","MALEA","RHODES"]),
 ("Gemlik / Marmara","TR",40.4,29.05,["DARD","BOSP"]),("Constanta","RO",44.1,28.67,["BOSP"]),("Varna","BG",43.2,27.95,["BOSP"]),
 ("Odessa / Chornomorsk","UA",46.4,30.75,["BOSP"]),("Novorossiysk","RU",44.7,37.8,["BOSP"]),("Samsun","TR",41.3,36.35,["BOSP"]),
 ("Alexandria","EG",31.2,29.85,["PSAID","MALEA","RHODES"]),("Damietta","EG",31.47,31.75,["PSAID"]),("Haifa / Ashdod","IL",32.8,35.0,["PSAID","RHODES"]),
 ("Beirut","LB",33.9,35.5,["PSAID","MALEA","RHODES"]),
 # Red Sea, Gulf, Indian subcontinent
 ("Aqaba","JO",29.5,35.0,["REDN"]),("Jeddah","SA",21.48,39.15,["REDN","BAB"]),("Djibouti","DJ",11.6,43.15,["BAB"]),("Salalah","OM",16.95,54.0,["GUARD"]),
 ("Sohar","OM",24.5,56.6,["HORMUZ"]),("Fujairah","AE",25.15,56.4,["HORMUZ"]),("Jebel Ali / Dubai","AE",25.0,55.05,["HORMUZ"]),("Bandar Abbas","IR",27.15,56.2,["HORMUZ"]),
 ("Dammam / Jubail","SA",26.9,49.8,["HORMUZ"]),("Umm Qasr","IQ",29.9,48.5,["HORMUZ"]),
 ("Karachi","PK",24.8,66.97,["HORMUZ","DONDRA","GUARD"]),("Kandla / Mundra","IN",22.8,69.8,["HORMUZ","DONDRA","GUARD"]),("Mumbai","IN",18.95,72.8,["DONDRA","GUARD","HORMUZ"]),
 ("Mormugao / Goa","IN",15.4,73.8,["DONDRA","GUARD"]),("New Mangalore","IN",12.9,74.8,["DONDRA","GUARD"]),("Chennai","IN",13.1,80.3,["DONDRA","WEH"]),
 ("Visakhapatnam","IN",17.68,83.3,["DONDRA","WEH"]),("Paradip","IN",20.26,86.7,["DONDRA","WEH"]),("Haldia / Kolkata","IN",21.8,88.1,["DONDRA","WEH"],40),
 ("Chittagong","BD",22.2,91.8,["WEH","DONDRA"]),("Colombo","LK",6.95,79.85,["DONDRA"]),
 # SE Asia
 ("Singapore","SG",1.26,103.8,["SING"]),("Port Klang","MY",3.0,101.35,["WEH","SING"]),("Laem Chabang / Map Ta Phut","TH",13.05,100.9,["VUNGTAU","SING"]),
 ("Vung Tau / Ho Chi Minh","VN",10.35,107.05,["VUNGTAU"]),("Haiphong","VN",20.8,106.8,["TONKIN"]),("Manila","PH",14.55,120.9,["MINDORO","HKOFF"]),
 ("Jakarta (Tanjung Priok)","ID",-6.1,106.88,["SUNDA","KARIMATA","JAVA"]),("Surabaya","ID",-7.2,112.73,["JAVA"]),("Taboneo (S. Kalimantan)","ID",-3.9,114.6,["JAVA","MAKASSAR"]),
 ("Muara Berau / Samarinda","ID",-0.3,117.6,["MAKASSAR"]),("Balikpapan","ID",-1.27,116.82,["MAKASSAR"]),("Bunati / Kotabaru","ID",-3.7,116.2,["MAKASSAR","JAVA","LOMBOK"]),
 # China / Korea / Japan / Taiwan / Russia FE
 ("Qingdao","CN",36.0,120.4,["YELLOW"]),("Rizhao","CN",35.35,119.6,["YELLOW"]),("Lianyungang","CN",34.75,119.5,["YELLOW"]),("Yantai / Longkou","CN",37.65,121.4,["BOHAI","YELLOW"]),
 ("Dalian","CN",38.9,121.75,["BOHAI","YELLOW"]),("Bayuquan / Yingkou","CN",40.25,122.0,["BOHAI"]),("Qinhuangdao","CN",39.9,119.6,["BOHAI"]),
 ("Caofeidian / Jingtang","CN",38.95,118.5,["BOHAI"]),("Tianjin","CN",38.97,117.85,["BOHAI"]),("Huanghua","CN",38.4,117.95,["BOHAI"]),
 ("Shanghai","CN",31.0,122.2,["ECS"]),("Ningbo-Zhoushan","CN",29.9,122.2,["ECS"]),("Fuzhou","CN",26.0,119.6,["TAIWANST","ECS"]),("Xiamen","CN",24.45,118.1,["TAIWANST","HKOFF"]),
 ("Guangzhou","CN",22.6,113.7,["HKOFF"]),("Hong Kong","HK",22.3,114.15,["HKOFF"]),("Zhanjiang","CN",20.9,110.7,["HKOFF","HAINANS"]),("Fangcheng","CN",21.6,108.35,["TONKIN"]),
 ("Kaohsiung","TW",22.6,120.25,["TAIWANST","LUZON","HKOFF"]),("Taichung","TW",24.27,120.5,["TAIWANST"]),
 ("Pohang","KR",36.03,129.4,["KOREAST"]),("Busan","KR",35.1,129.05,["KOREAST"]),("Gwangyang","KR",34.9,127.7,["KOREAST","ECS"]),("Dangjin / Pyeongtaek","KR",37.0,126.6,["YELLOW"]),
 ("Kashima","JP",35.9,140.7,["JPNE"]),("Chiba / Tokyo Bay","JP",35.5,139.9,["JPNE"]),("Nagoya","JP",34.9,136.9,["SJAPAN","JPNE"]),("Kobe / Osaka","JP",34.65,135.2,["SJAPAN"]),
 ("Vostochny / Nakhodka","RU",42.75,133.05,["KOREAST"]),("Vladivostok","RU",43.1,131.9,["KOREAST"]),
 # Australia / Pacific
 ("Port Hedland","AU",-20.2,118.6,["NWCAPE","LOMBOK"]),("Dampier","AU",-20.6,116.75,["NWCAPE","LOMBOK"]),("Cape Lambert / Port Walcott","AU",-20.6,117.2,["NWCAPE","LOMBOK"]),
 ("Geraldton","AU",-28.8,114.6,["LEEUWIN","NWCAPE"]),("Kwinana / Fremantle","AU",-32.2,115.7,["LEEUWIN","NWCAPE"]),("Esperance","AU",-33.87,121.9,["LEEUWIN"]),
 ("Newcastle (AU)","AU",-32.92,151.8,["EAUS"]),("Port Kembla","AU",-34.47,150.92,["EAUS"]),("Gladstone","AU",-23.83,151.3,["EAUS","JOMARD"]),
 ("Hay Point / Dalrymple Bay","AU",-21.25,149.35,["JOMARD","EAUS"]),("Abbot Point","AU",-19.85,148.08,["JOMARD"]),
 # Africa
 ("Richards Bay","ZA",-28.8,32.1,["MOZCH","ALGOA"]),("Durban","ZA",-29.87,31.05,["ALGOA","MOZCH"]),("Saldanha Bay","ZA",-33.0,17.9,["CGH"]),("Cape Town","ZA",-33.9,18.43,["CGH"]),
 ("Maputo","MZ",-25.97,32.6,["MOZCH","ALGOA"]),("Beira","MZ",-19.8,34.85,["MOZCH"]),("Nacala","MZ",-14.5,40.7,["MOZCH","GUARD"]),("Dar es Salaam","TZ",-6.8,39.3,["MOZCH","GUARD"]),
 ("Mombasa","KE",-4.05,39.68,["GUARD","MOZCH"]),("Walvis Bay","NA",-22.95,14.5,["CGH","GUINEA"]),("Lagos / Apapa","NG",6.4,3.4,["GUINEA"]),("Tema","GH",5.6,0.0,["GUINEA"]),
 ("Abidjan / San Pedro","CI",5.25,-4.0,["GUINEA","LIBERIA"]),("Conakry / Kamsar","GN",10.65,-14.62,["OFFSL","DAKAR"]),("Dakar","SN",14.68,-17.43,["DAKAR"]),
 ("Nouadhibou","MR",20.9,-17.05,["DAKAR","STVINC"]),
 # North America
 ("Houston / Galveston","US",29.3,-94.7,["GULF"]),("Corpus Christi","US",27.8,-97.05,["GULF"]),("Mississippi River (SW Pass)","US",28.9,-89.4,["GULF"]),
 ("New Orleans","US",29.95,-90.05,["GULF"],15),("Mobile","US",30.15,-88.05,["GULF"]),("Tampa","US",27.6,-82.75,["GULF","FLSTR"]),("Veracruz","MX",19.2,-96.1,["GULF","YUCATAN"]),
 ("Altamira","MX",22.5,-97.8,["GULF"]),("Savannah","US",32.0,-80.9,["MIAMI","HATTERAS"]),("Charleston","US",32.75,-79.85,["HATTERAS","MIAMI"]),
 ("Norfolk / Hampton Roads","US",36.95,-76.1,["CHES"]),("Baltimore","US",39.25,-76.55,["CHES"]),("Philadelphia","US",39.9,-75.15,["DELA"]),("New York","US",40.5,-74.0,["NYOFF"]),
 ("Halifax","CA",44.6,-63.5,["CABOT","NYOFF"]),("Sept-Iles","CA",50.2,-66.35,["GASPE","CABOT"]),("Port-Cartier","CA",50.0,-66.85,["GASPE"]),("Baie-Comeau","CA",49.2,-68.15,["GASPE"]),
 ("Quebec","CA",46.8,-71.2,["GASPE"],20),("Sorel","CA",46.05,-73.1,["GASPE"],40),("Montreal","CA",45.5,-73.55,["GASPE"],60),
 ("Vancouver","CA",49.3,-123.1,["HARO"]),("Prince Rupert","CA",54.3,-130.4,["JPNE","JDF"]),("Columbia River (Astoria)","US",46.25,-123.9,["JDF","SFOFF"],0),
 ("Long Beach / Los Angeles","US",33.7,-118.25,["SFOFF","CSL","JPNE"]),
 # Central/South America west & Caribbean
 ("Cartagena (CO)","CO",10.4,-75.55,["COLON","WINDWARD"]),("Puerto Bolivar","CO",12.25,-71.95,["WINDWARD","COLON","MONA"]),("Callao","PE",-12.05,-77.15,["PERUOFF"]),
 ("San Antonio / Valparaiso","CL",-33.3,-71.7,["PERUOFF"]),("Antofagasta / Mejillones","CL",-23.1,-70.45,["PERUOFF"]),("Balboa / Panama Pacific","PA",8.9,-79.55,["PANPAC"]),
 ("Cristobal / Colon","PA",9.35,-79.9,["COLON"]),
]

def gc(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    d = 2*math.asin(math.sqrt(math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2))
    return d*3440.065

def route(p1, p2, avoid=()):
    A = {p[0]: p for p in P}; a, b = A[p1], A[p2]
    xa = a[5] if len(a) > 5 else 0; xb = b[5] if len(b) > 5 else 0
    adj = {}
    for e in E:
        if len(e) > 2 and e[2] in avoid: continue
        w = gc(N[e[0]], N[e[1]]); adj.setdefault(e[0], []).append((e[1], w)); adj.setdefault(e[1], []).append((e[0], w))
    best = gc(a[2:4], b[2:4]) if set(a[4]) & set(b[4]) and len(set(a[4]) & set(b[4])) else None
    pq = [(gc(a[2:4], N[g]), g) for g in a[4]]; dist = {g: d for d, g in pq}; heapq.heapify(pq)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, 1e18): continue
        for v, w in adj.get(u, []):
            if d+w < dist.get(v, 1e18): dist[v] = d+w; heapq.heappush(pq, (d+w, v))
    via = min(dist[g]+gc(N[g], b[2:4]) for g in b[4] if g in dist)
    return (min(via, best) if best else via) + xa + xb

if __name__ == "__main__":
    out = {"n": N, "e": [list(e) for e in E], "p": [list(p) for p in P]}
    pathlib.Path(__file__).resolve().parent.parent.joinpath("voyage").mkdir(exist_ok=True)
    pathlib.Path(__file__).resolve().parent.parent.joinpath("voyage/ports.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    T = [("Rio Grande","San Lorenzo / Rosario",595),("San Lorenzo / Rosario","Las Palmas",4794),("Las Palmas","Preveza",1995),("Preveza","Larnaca",777),("Larnaca","Thessaloniki",700),
         ("Rotterdam","Singapore",8288),("Santos","Qingdao",11050),("Tubarao / Vitoria","Qingdao",10900),("Newcastle (AU)","Qingdao",4600),("Port Hedland","Qingdao",3620),
         ("Richards Bay","Rotterdam",6780),("Houston / Galveston","Rotterdam",5030),("Mississippi River (SW Pass)","Qingdao",10300),("Vancouver","Qingdao",5200),
         ("Piraeus / Elefsis","Rotterdam",3000),("Gibraltar","x",0)]
    print(len(P), "ports,", len(N), "nodes")
    for a, b, k in T:
        if b == "x": continue
        d = route(a, b); print(f"{a:28s} {b:28s} est {d:7.0f}  ref {k:6d}  {100*(d-k)/k:+.1f}%")
