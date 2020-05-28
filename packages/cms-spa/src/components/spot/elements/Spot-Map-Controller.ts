import { Controller } from "@deck.gl/core";

const controllerOpts = {
  doubleClickZoom: false,
  scrollZoom: true,
  dragPan: true,
  keyboard: true,
  touchZoom: true,
};
export class SpotMapController extends Controller {
  constructor(options = controllerOpts) {
    super({}, options);
    // this.events = ["press", "wheel"];
  }
}
