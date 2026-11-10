export interface MysuruLocation {
  id: string;
  title: string;
  address: string;
  distanceKm: number;
  durationMin: number;
  tag: string;
  type: 'recent' | 'saved' | 'transit' | 'hubs';
  image: string;
  coordinates: { x: number; y: number }; // Relative map coordinates (0-400, 0-480)
  gps?: { lat: number; lng: number }; // Real geographic GPS coordinates for OpenStreetMap
}

export const MYSURU_LANDMARKS: MysuruLocation[] = [
  {
    id: 'loc-vvce',
    title: 'VVCE, Gokulam',
    address: 'Gokulam 3rd Stage, Mysuru, Karnataka',
    distanceKm: 0.8,
    durationMin: 3,
    tag: 'Academic',
    type: 'saved',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZJfUqQkJFghgZADqli2xaHfNEHX0jU0iax2aksqptqZC25FfypSO8Gz7JRaAuahfMFqegLAnayF0QBAwlsGSgitztasxWadQtLaj3sETr4R9du2MuY9R8LwHZp2b1qcRGKr-btYB9r22yrrNlzlkVV2EjkL0w10t8sbUER6Pp_OQl9f4N-RgM8dIDXNRjmCSTSeAPZsfDdkdM4W35_-y1xcEAQ_52OvLtObZBzQI',
    coordinates: { x: 95, y: 355 },
    gps: { lat: 12.3364, lng: 76.6213 }
  },
  {
    id: 'loc-jss',
    title: 'JSS Medical College & Hospital',
    address: 'Bannimantap, Mysuru, Karnataka',
    distanceKm: 4.2,
    durationMin: 11,
    tag: 'Fastest',
    type: 'recent',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4aBG4_Zth2cyMUEY9o1ZdkvoKIXdgmW2VKUGDa7yfJF2IpW7pdewTuD-7YQt5CTZ2OO6gGbM35R4ZAJU-MVkh-2zzqplT_sS_A6BKXRPOI2xmB4rF-kXaBfmZby5jHMO_VynSj-zL8QwlE31CphabAl6HFcDWzhnIpvbmMg-qcidZ_UfSnqonMauj1Bfs6SFwR6DBl_z-5DSWoTSwklzdMQtvgmEix9nzPP3p8-o',
    coordinates: { x: 305, y: 95 },
    gps: { lat: 12.3392, lng: 76.6575 }
  },
  {
    id: 'loc-railway',
    title: 'Mysuru Railway Station (MYS)',
    address: 'Medar Block, Yadavagiri, Mysuru',
    distanceKm: 6.1,
    durationMin: 16,
    tag: 'Direct',
    type: 'transit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCdro_M8-gy6hjaiF_1Ez9HEA5gODnaOKNqoO22am6QYUD5hhzPj8l6PZ9l5viMhaPNFSGHDrP6h787TAuz9Rc_-53MC1f-eVxpffSIhnoSiEHZ5N54l1YjMMP-vjpmQbqCbKlxIbjwyu9WkduTg2a073IqP-7K5CHVpnr-pg5m9O32Oa0YOgEO5YAT33Dhg3uOFgcBB62MfrFvgfsOqY9BYzjCGY-r5cssQ-7-U',
    coordinates: { x: 210, y: 220 },
    gps: { lat: 12.3168, lng: 76.6436 }
  },
  {
    id: 'loc-palace',
    title: 'Mysuru Palace (Amba Vilas)',
    address: 'Sayyaji Rao Rd, Agrahara, Mysuru',
    distanceKm: 5.8,
    durationMin: 14,
    tag: 'Popular',
    type: 'hubs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvBXGv3apiDmTts6j9-SdNT9zyWceTbb3XqfXatKxVRf7-lQduZaqb1YNThaBMytdtCV_XX1SLogRLuWsoX13LizJWKojCzK4JsmC6CwMLN0UZBpd8psBAmhuUzVvm39XTzhRXGmQe1wJ1djfMQoTldCNo3Nth-_XArMNPnOWk6GAkSSPKjMti5z_1UR1gFLHMu2_zmzAGvbdfsWnmrJ8Ro6WI3p1FovwkGMt5PI4',
    coordinates: { x: 180, y: 150 },
    gps: { lat: 12.3051, lng: 76.6551 }
  },
  {
    id: 'loc-chamundi',
    title: 'Chamundi Hill Sri Chamundeshwari Temple',
    address: 'Chamundi Hill Rd, Mysuru',
    distanceKm: 11.4,
    durationMin: 26,
    tag: 'Scenic',
    type: 'hubs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGpm9AeQiLQG5LlVHb7EORaevjaqZ1oTwZRFLe2w-g9ln09iPFCctXR70CNGfrMtujRzt3ugtB_4MhMdkGq698IXwUIhmJE-VXTGbMG2u4SCfHerWXhruYnnZEsseZj4T16u1lx2xBYsIM6aSztUN8Qx7TPc_pHhk_zWD0g4fVHdgk4CHpWPui_y9GE4TtRK4ZEp2wlSOuHfnIacHeiUiifs0yp2LWv4OqayF-9iY',
    coordinates: { x: 330, y: 380 },
    gps: { lat: 12.2753, lng: 76.6703 }
  },
  {
    id: 'loc-infosys',
    title: 'Infosys Mysore Development Centre',
    address: 'Hebbal Electronic City, Hootagalli, Mysuru',
    distanceKm: 9.8,
    durationMin: 22,
    tag: 'Tech Hub',
    type: 'transit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZJfUqQkJFghgZADqli2xaHfNEHX0jU0iax2aksqptqZC25FfypSO8Gz7JRaAuahfMFqegLAnayF0QBAwlsGSgitztasxWadQtLaj3sETr4R9du2MuY9R8LwHZp2b1qcRGKr-btYB9r22yrrNlzlkVV2EjkL0w10t8sbUER6Pp_OQl9f4N-RgM8dIDXNRjmCSTSeAPZsfDdkdM4W35_-y1xcEAQ_52OvLtObZBzQI',
    coordinates: { x: 70, y: 120 },
    gps: { lat: 12.3614, lng: 76.5936 }
  },
  {
    id: 'loc-mall',
    title: 'Nexus Centre City Mall',
    address: 'Hyder Ali Rd, Nazarbad, Mysuru',
    distanceKm: 3.5,
    durationMin: 10,
    tag: 'Shopping',
    type: 'recent',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4aBG4_Zth2cyMUEY9o1ZdkvoKIXdgmW2VKUGDa7yfJF2IpW7pdewTuD-7YQt5CTZ2OO6gGbM35R4ZAJU-MVkh-2zzqplT_sS_A6BKXRPOI2xmB4rF-kXaBfmZby5jHMO_VynSj-zL8QwlE31CphabAl6HFcDWzhnIpvbmMg-qcidZ_UfSnqonMauj1Bfs6SFwR6DBl_z-5DSWoTSwklzdMQtvgmEix9nzPP3p8-o',
    coordinates: { x: 260, y: 190 },
    gps: { lat: 12.3215, lng: 76.6631 }
  },
  {
    id: 'loc-ksrtc',
    title: 'KSRTC Suburb Bus Stand',
    address: 'Bangalore-Nilgiri Rd, Lashkar Mohalla, Mysuru',
    distanceKm: 5.2,
    durationMin: 13,
    tag: 'Bus Terminal',
    type: 'transit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCdro_M8-gy6hjaiF_1Ez9HEA5gODnaOKNqoO22am6QYUD5hhzPj8l6PZ9l5viMhaPNFSGHDrP6h787TAuz9Rc_-53MC1f-eVxpffSIhnoSiEHZ5N54l1YjMMP-vjpmQbqCbKlxIbjwyu9WkduTg2a073IqP-7K5CHVpnr-pg5m9O32Oa0YOgEO5YAT33Dhg3uOFgcBB62MfrFvgfsOqY9BYzjCGY-r5cssQ-7-U',
    coordinates: { x: 220, y: 180 },
    gps: { lat: 12.3117, lng: 76.6582 }
  },
  {
    id: 'loc-zoo',
    title: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
    address: 'Indiranagar, Ittige Gudu, Mysuru',
    distanceKm: 6.5,
    durationMin: 15,
    tag: 'Heritage',
    type: 'hubs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvBXGv3apiDmTts6j9-SdNT9zyWceTbb3XqfXatKxVRf7-lQduZaqb1YNThaBMytdtCV_XX1SLogRLuWsoX13LizJWKojCzK4JsmC6CwMLN0UZBpd8psBAmhuUzVvm39XTzhRXGmQe1wJ1djfMQoTldCNo3Nth-_XArMNPnOWk6GAkSSPKjMti5z_1UR1gFLHMu2_zmzAGvbdfsWnmrJ8Ro6WI3p1FovwkGMt5PI4',
    coordinates: { x: 280, y: 260 },
    gps: { lat: 12.3023, lng: 76.6669 }
  },
  {
    id: 'loc-kukkarahalli',
    title: 'Kukkarahalli Lake Park Gate',
    address: 'Kalamandira Rd, Saraswathipuram, Mysuru',
    distanceKm: 2.1,
    durationMin: 7,
    tag: 'Park & Lake',
    type: 'recent',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGpm9AeQiLQG5LlVHb7EORaevjaqZ1oTwZRFLe2w-g9ln09iPFCctXR70CNGfrMtujRzt3ugtB_4MhMdkGq698IXwUIhmJE-VXTGbMG2u4SCfHerWXhruYnnZEsseZj4T16u1lx2xBYsIM6aSztUN8Qx7TPc_pHhk_zWD0g4fVHdgk4CHpWPui_y9GE4TtRK4ZEp2wlSOuHfnIacHeiUiifs0yp2LWv4OqayF-9iY',
    coordinates: { x: 270, y: 170 },
    gps: { lat: 12.3129, lng: 76.6318 }
  }
];

export function calculateDistanceBetween(a: { title: string }, b: { title: string }): { distanceKm: number; durationMin: number } {
  if (a.title.toLowerCase().trim() === b.title.toLowerCase().trim()) {
    return { distanceKm: 0, durationMin: 0 };
  }

  // Lookup in landmarks
  const findA = MYSURU_LANDMARKS.find((l) => l.title.toLowerCase().includes(a.title.toLowerCase()) || a.title.toLowerCase().includes(l.title.toLowerCase()));
  const findB = MYSURU_LANDMARKS.find((l) => l.title.toLowerCase().includes(b.title.toLowerCase()) || b.title.toLowerCase().includes(l.title.toLowerCase()));

  if (findA && findB) {
    const dx = findA.coordinates.x - findB.coordinates.x;
    const dy = findA.coordinates.y - findB.coordinates.y;
    const pxDist = Math.sqrt(dx * dx + dy * dy);
    // Scale: ~30px per km
    const km = Math.max(1.2, Number((pxDist / 32).toFixed(1)));
    return {
      distanceKm: km,
      durationMin: Math.max(4, Math.round(km * 2.7))
    };
  }

  return { distanceKm: 4.2, durationMin: 12 };
}

