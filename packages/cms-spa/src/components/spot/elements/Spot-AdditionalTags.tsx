import { IBathingspot } from '../../../lib/common/interfaces';
import { SpotBodyAddonTagGroup } from './Spot-AddonTag-Group';
import React from 'react';
export function SpotAdditionalTags(spot: IBathingspot): React.ReactNode {
  return (
    <div className='bathingspot__body-addon'>
      <h3>Weitere Angaben zur Badesstelle</h3>
      <SpotBodyAddonTagGroup
        cyanoPossible={spot.cyanoPossible}
        lifeguard={spot.lifeguard}
        disabilityAccess={spot.disabilityAccess}
        hasDisabilityAccesableEntrence={spot.hasDisabilityAccesableEntrence}
        restaurant={spot.restaurant}
        snack={spot.snack}
        parkingSpots={spot.parkingSpots}
        bathrooms={spot.bathrooms}
        disabilityAccessBathrooms={spot.disabilityAccessBathrooms}
        bathroomsMobile={spot.bathroomsMobile}
        dogban={spot.dogban}
      />
    </div>
  );
}
