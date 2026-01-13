'use client';

import { useReservationWatcher } from '@/hooks/useReservationWatcher';

export default function ReservationWatcher() {
  useReservationWatcher();
  return null; // Ce composant ne rend rien, il surveille juste les réservations
}

