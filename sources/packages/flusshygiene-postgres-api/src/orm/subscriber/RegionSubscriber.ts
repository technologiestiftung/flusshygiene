import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from 'typeorm';
import { Region } from '../entity/Region';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Region> {

    /**
     * Indicates that this subscriber only listen to Region events.
     */
    public listenTo() {
        return Region;
    }
    /**
     * Called before Region insertion.
     */
    public beforeInsert(event: InsertEvent<Region>) {
        console.log(`BEFORE REGION INSERTED: `, event.entity);
    }

    public beforeRemove(event: RemoveEvent<Region>) {

      console.log(`BEFORE REGION DELETE: `, event.entity);
      // if (event.entity !== undefined) {
      //   const regionRepo = event.connection.getCustomRepository(RegionRepository);
      //   regionRepo.findByIdWithRelations(event.entity.id, ['bathingspots']).then(region => {
      //       if (region !== undefined) {
      //         console.log(region);
    //           this.bathingspots.forEach((spot) => {
    //             spot.isPublic = false;
    //           });
    // //         }
    //         }).catch(err => {
    //           throw err;
    //         });
    //   }
    }

}
