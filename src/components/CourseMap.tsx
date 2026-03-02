'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Course {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  isActive: boolean;
}

const DEFAULT_CENTER: [number, number] = [-86.7816, 36.1627];

const AREA_COURSES: Course[] = [
  // ── Nashville Metro ──
  { id: 'n1', name: 'Harpeth Hills Golf Course', lat: 36.0621, lng: -86.8657, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n2', name: 'McCabe Golf Course', lat: 36.1343, lng: -86.8187, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n3', name: 'Shelby Golf Course', lat: 36.1744, lng: -86.7211, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n4', name: 'Ted Rhodes Golf Course', lat: 36.1885, lng: -86.7979, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n5', name: 'Percy Warner Golf Course', lat: 36.0616, lng: -86.8903, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n6', name: 'Nashboro Golf Club', lat: 36.1076, lng: -86.6213, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n7', name: 'Hermitage Golf Course', lat: 36.2079, lng: -86.5851, city: 'Old Hickory', state: 'TN', isActive: false },
  { id: 'n8', name: 'Gaylord Springs Golf Links', lat: 36.1859, lng: -86.5897, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n9', name: 'Windtree Golf Course', lat: 36.0459, lng: -86.4783, city: 'Mt. Juliet', state: 'TN', isActive: false },
  { id: 'n10', name: 'Temple Hills Country Club', lat: 36.0259, lng: -86.7483, city: 'Franklin', state: 'TN', isActive: false },
  { id: 'n11', name: 'The Golf Club of Tennessee', lat: 35.9789, lng: -86.7252, city: 'Kingston Springs', state: 'TN', isActive: false },
  { id: 'n12', name: 'Richland Country Club', lat: 36.1290, lng: -86.8421, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n13', name: 'Old Hickory Country Club', lat: 36.2541, lng: -86.6137, city: 'Old Hickory', state: 'TN', isActive: false },
  { id: 'n14', name: 'Westhaven Golf Club', lat: 35.9950, lng: -86.8950, city: 'Franklin', state: 'TN', isActive: false },
  { id: 'n15', name: 'Greystone Golf Club', lat: 36.1502, lng: -86.4497, city: 'Dickson', state: 'TN', isActive: false },
  { id: 'n16', name: 'Nashville Golf & Athletic Club', lat: 36.1030, lng: -86.7150, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n17', name: 'Pine Creek Golf Course', lat: 36.1870, lng: -86.5100, city: 'Mt. Juliet', state: 'TN', isActive: false },
  { id: 'n18', name: 'Two Rivers Golf Course', lat: 36.1960, lng: -86.6400, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n19', name: 'Forrest Crossing Golf Course', lat: 35.9850, lng: -86.8200, city: 'Franklin', state: 'TN', isActive: false },
  { id: 'n20', name: 'Vanderbilt Legends Club', lat: 35.9540, lng: -86.8460, city: 'Franklin', state: 'TN', isActive: false },
  { id: 'n21', name: 'Indian Hills Golf Club', lat: 35.8920, lng: -86.3850, city: 'Murfreesboro', state: 'TN', isActive: false },
  { id: 'n22', name: 'Stones River Country Club', lat: 35.8740, lng: -86.4150, city: 'Murfreesboro', state: 'TN', isActive: false },
  { id: 'n23', name: 'Long Hollow Golf Course', lat: 36.3740, lng: -86.5560, city: 'Gallatin', state: 'TN', isActive: false },
  { id: 'n24', name: 'Foxland Harbor Golf Club', lat: 36.3100, lng: -86.3100, city: 'Gallatin', state: 'TN', isActive: false },
  { id: 'n25', name: 'Bluegrass Yacht & Country Club', lat: 36.3320, lng: -86.4500, city: 'Hendersonville', state: 'TN', isActive: false },
  { id: 'n26', name: 'Governors Club', lat: 35.9130, lng: -86.8710, city: 'Brentwood', state: 'TN', isActive: false },
  { id: 'n27', name: 'Brentwood Country Club', lat: 36.0140, lng: -86.7700, city: 'Brentwood', state: 'TN', isActive: false },
  { id: 'n28', name: 'Hillwood Country Club', lat: 36.1220, lng: -86.8700, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n29', name: 'Belle Meade Country Club', lat: 36.0920, lng: -86.8580, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n30', name: 'Lebanon Golf & Country Club', lat: 36.2100, lng: -86.2900, city: 'Lebanon', state: 'TN', isActive: false },
  { id: 'n31', name: 'Springhouse Golf Club', lat: 36.2920, lng: -86.6250, city: 'Nashville', state: 'TN', isActive: false },
  { id: 'n32', name: 'Deer Creek Golf Club', lat: 36.2660, lng: -86.7030, city: 'Nashville', state: 'TN', isActive: false },

  // ── Between Nashville & Knoxville ──
  { id: 'm1', name: 'Cookeville Golf Club', lat: 36.1440, lng: -85.5060, city: 'Cookeville', state: 'TN', isActive: false },
  { id: 'm2', name: 'Golden Eagle Golf Club', lat: 36.1680, lng: -85.4920, city: 'Cookeville', state: 'TN', isActive: false },
  { id: 'm3', name: 'Bear Trace at Cumberland Mountain', lat: 35.9500, lng: -85.3520, city: 'Crossville', state: 'TN', isActive: false },
  { id: 'm4', name: 'Heatherhurst Golf Club', lat: 35.9600, lng: -85.0200, city: 'Fairfield Glade', state: 'TN', isActive: false },
  { id: 'm5', name: 'Centennial Golf Course', lat: 35.9320, lng: -84.8550, city: 'Oak Ridge', state: 'TN', isActive: false },

  // ── Knoxville Metro ──
  { id: 'k1', name: 'Whittle Springs Golf Course', lat: 36.0020, lng: -83.9250, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k2', name: 'Knoxville Golf Course', lat: 35.9340, lng: -83.8420, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k3', name: 'Three Ridges Golf Course', lat: 35.8640, lng: -83.9150, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k4', name: 'Holston Hills Country Club', lat: 36.0050, lng: -83.8530, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k5', name: 'Cherokee Country Club', lat: 35.9660, lng: -83.8800, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k6', name: 'Fox Den Country Club', lat: 35.8950, lng: -84.1240, city: 'Farragut', state: 'TN', isActive: false },
  { id: 'k7', name: 'Gettysvue Golf & Country Club', lat: 35.9350, lng: -84.1100, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k8', name: 'Avalon Golf Club', lat: 35.7970, lng: -84.2700, city: 'Lenoir City', state: 'TN', isActive: false },
  { id: 'k9', name: 'Willow Creek Golf Club', lat: 35.9710, lng: -84.0150, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k10', name: 'Dead Horse Lake Golf Course', lat: 35.9400, lng: -84.0020, city: 'Knoxville', state: 'TN', isActive: false },
  { id: 'k11', name: 'Egwani Farms Golf Course', lat: 35.8350, lng: -84.0800, city: 'Rockford', state: 'TN', isActive: false },
  { id: 'k12', name: 'Sevierville Golf Club', lat: 35.8680, lng: -83.5620, city: 'Sevierville', state: 'TN', isActive: false },
  { id: 'k13', name: 'Gatlinburg Golf Course', lat: 35.7240, lng: -83.4960, city: 'Pigeon Forge', state: 'TN', isActive: false },
  { id: 'k14', name: 'River Islands Golf Club', lat: 35.7600, lng: -83.7100, city: 'Kodak', state: 'TN', isActive: false },
  { id: 'k15', name: 'Dandridge Golf & Country Club', lat: 36.0150, lng: -83.4150, city: 'Dandridge', state: 'TN', isActive: false },
  { id: 'k16', name: 'Tennessee National Golf Club', lat: 35.6800, lng: -84.1600, city: 'Loudon', state: 'TN', isActive: false },
  { id: 'k17', name: 'Avalon Country Club', lat: 35.7940, lng: -84.2650, city: 'Lenoir City', state: 'TN', isActive: false },
  { id: 'k18', name: 'Lambert Acres Golf Club', lat: 35.8420, lng: -83.8900, city: 'Maryville', state: 'TN', isActive: false },
  { id: 'k19', name: 'Green Meadow Country Club', lat: 35.8100, lng: -83.8500, city: 'Alcoa', state: 'TN', isActive: false },
  { id: 'k20', name: 'Harbour Point Golf Club', lat: 36.0480, lng: -83.7500, city: 'Knoxville', state: 'TN', isActive: false },
];

const BOUNDS_PADDING = 60;

export default function CourseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [noToken, setNoToken] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setNoToken(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = token;

      let userLngLat: [number, number] | null = null;

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
          })
        );
        userLngLat = [pos.coords.longitude, pos.coords.latitude];
      } catch {
        // Default to Nashville
      }

      if (cancelled || !containerRef.current) return;

      const center = userLngLat || DEFAULT_CENTER;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center,
        zoom: 8,
        attributionControl: false,
      });

      map.scrollZoom.disable();
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );
      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-left'
      );

      map.on('load', () => {
        if (cancelled) return;
        setLoaded(true);

        // Find courses within ~80 miles of user to fit bounds
        const nearbyCourses = AREA_COURSES.filter((c) => {
          const dlat = c.lat - center[1];
          const dlng = c.lng - center[0];
          const approxMiles = Math.sqrt(dlat * dlat + dlng * dlng) * 69;
          return approxMiles < 80;
        });

        // Fit bounds to show all nearby courses + user location
        if (nearbyCourses.length > 2) {
          const bounds = new mapboxgl.LngLatBounds();
          nearbyCourses.forEach((c) => bounds.extend([c.lng, c.lat]));
          if (userLngLat) bounds.extend(userLngLat);
          map.fitBounds(bounds, {
            padding: BOUNDS_PADDING,
            maxZoom: 11,
            duration: 1200,
          });
        }

        // User location marker
        if (userLngLat) {
          const el = document.createElement('div');
          el.className = 'tfs-user-loc';
          new mapboxgl.Marker({ element: el }).setLngLat(userLngLat).addTo(map);
        }

        // Course markers
        AREA_COURSES.forEach((c) => {
          const pin = document.createElement('div');
          pin.className = `tfs-pin ${c.isActive ? 'tfs-pin--active' : 'tfs-pin--inactive'}`;

          const html = c.isActive
            ? `<div class="tfs-pop">
                <p class="tfs-pop__name">${c.name}</p>
                <p class="tfs-pop__loc">${c.city}, ${c.state}</p>
                <div class="tfs-pop__btns">
                  <a href="/browse?course=${c.id}&type=caddie" class="tfs-pop__btn tfs-pop__btn--gold">Hire Caddie</a>
                  <a href="/browse?course=${c.id}&type=instructor" class="tfs-pop__btn tfs-pop__btn--green">Hire Instructor</a>
                </div>
              </div>`
            : `<div class="tfs-pop">
                <p class="tfs-pop__name">${c.name}</p>
                <p class="tfs-pop__loc">${c.city}, ${c.state}</p>
                <span class="tfs-pop__soon">Coming Soon</span>
              </div>`;

          const popup = new mapboxgl.Popup({
            offset: [0, -12],
            closeButton: false,
            closeOnClick: true,
            className: 'tfs-popup-wrap',
            maxWidth: '240px',
          }).setHTML(html);

          new mapboxgl.Marker({ element: pin })
            .setLngLat([c.lng, c.lat])
            .setPopup(popup)
            .addTo(map);
        });
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (noToken) {
    return (
      <div className="flex h-[50vh] items-center justify-center sm:h-[60vh] lg:h-[70vh]">
        <p className="text-sm text-white/25">Map requires NEXT_PUBLIC_MAPBOX_TOKEN</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-green-950">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold-400/20 border-t-brand-gold-400" />
            <span className="text-sm text-white/35">Loading courses near you&hellip;</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="h-[50vh] w-full sm:h-[60vh] lg:h-[70vh]" />
    </div>
  );
}
