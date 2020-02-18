# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.5.2](https://github.com/technologiestiftung/flusshygiene/compare/v2.5.1...v2.5.2) (2020-02-18)


### Bug Fixes

* **santize values:** If upload headers have whitespace we got an error ([7376c6b](https://github.com/technologiestiftung/flusshygiene/commit/7376c6b09b18d6ad82b098b6bbf4ec27b8464b12))





## [2.5.1](https://github.com/technologiestiftung/flusshygiene/compare/v2.5.0...v2.5.1) (2020-02-17)


### Bug Fixes

* **duplicate spots:** GET for Bathingspot does get all the spots ([4edc94e](https://github.com/technologiestiftung/flusshygiene/commit/4edc94e7e027ca4dccac10c08b4faf18e36c92ac)), closes [#182](https://github.com/technologiestiftung/flusshygiene/issues/182)
* **GIs is not PP:** GI where posted as PP ([64a1bd8](https://github.com/technologiestiftung/flusshygiene/commit/64a1bd8f29a8a8005e50eb171e11cdda05c606d3))
* **link:** URL was wrong ([12c1af8](https://github.com/technologiestiftung/flusshygiene/commit/12c1af8b6d78f05635f2622a1756e65e8c191aac))
* **point is not polygon:** PUT was rejected due to wrong type ([d7b1e38](https://github.com/technologiestiftung/flusshygiene/commit/d7b1e38b998ccec913b304dc9219dd2f9ac1f533))
* **tests:** unused import ([97bd31d](https://github.com/technologiestiftung/flusshygiene/commit/97bd31d0b42314f3ced3cf9d1c51c13f153f1136))
* **upload:** Had wrong yup validation ([b4ea747](https://github.com/technologiestiftung/flusshygiene/commit/b4ea74737e5895155d43b1d49327b68c4c162973))





# [2.5.0](https://github.com/technologiestiftung/flusshygiene/compare/v2.4.0...v2.5.0) (2020-02-13)


### Bug Fixes

* **gi and pp:** Adds fi and pp with atachment ([d3eaacb](https://github.com/technologiestiftung/flusshygiene/commit/d3eaacb7c577f25f9840bf9c3fa9820b80485933))
* **map style:** Make marker bigger ([d31f4c3](https://github.com/technologiestiftung/flusshygiene/commit/d31f4c373a9f4daf9f5a3edbf113114d15113a63))





# [2.4.0](https://github.com/technologiestiftung/flusshygiene/compare/v2.3.2...v2.4.0) (2020-02-05)


### Bug Fixes

* **apiEndpoints type:** migrate column from json to text ([097f98b](https://github.com/technologiestiftung/flusshygiene/commit/097f98be73eceacb28948a4c7ec1b8e77ef1d21f))
* **auth0id in profile:** Makes id conditinoal ([5624354](https://github.com/technologiestiftung/flusshygiene/commit/562435470fa49e05b2a9d055058980723350fa0b))
* **buton wording:** Renames button ([44983c4](https://github.com/technologiestiftung/flusshygiene/commit/44983c49cfbb83bfa4c52b6d25a6ff4ca02a87d9))
* **no location:** Make location display conditional ([28e06f3](https://github.com/technologiestiftung/flusshygiene/commit/28e06f3276472636367cf688e275e256cca9be5e))
* packages/cms-spa/package.json & packages/cms-spa/package-lock.json to reduce vulnerabilities ([a883281](https://github.com/technologiestiftung/flusshygiene/commit/a88328165398f8c57444ab58178b7aa6fe42cfdc))


### Features

* **latest working state:** update cronbot to latest state for testing ([86c299a](https://github.com/technologiestiftung/flusshygiene/commit/86c299ab3764252ca850c6d7cbdd66a941750f05))





## [2.3.2](https://github.com/technologiestiftung/flusshygiene/compare/v2.3.1...v2.3.2) (2019-12-19)

**Note:** Version bump only for package @tsb/flusshygiene





## [2.3.1](https://github.com/technologiestiftung/flusshygiene/compare/v2.3.0...v2.3.1) (2019-12-19)


### Bug Fixes

* **banner:** Set message to nothing when clikked away 🔥 ([0834666](https://github.com/technologiestiftung/flusshygiene/commit/08346666d861427da8b2aeb02c33aab160233504))
* **fix(rights for pgapi): could not create folder for logs:** had an error creating log folder ([dc93d26](https://github.com/technologiestiftung/flusshygiene/commit/dc93d26cfff31fb36329cfd9ff4dc5565e304450))
* **null constrains api:** migrations remove null constrains ([3f06bfc](https://github.com/technologiestiftung/flusshygiene/commit/3f06bfce33ac6e111f99c7220bb95ce002133344))





# [2.3.0](https://github.com/technologiestiftung/flusshygiene/compare/v2.2.1...v2.3.0) (2019-12-19)


### Bug Fixes

* **actions postgres api:** Needs redis as well ([750211c](https://github.com/technologiestiftung/flusshygiene/commit/750211c2d2e4823af6a251f6d4a6ce2652181644))
* **map in spot:** fixes map display in spot ([a63c1f7](https://github.com/technologiestiftung/flusshygiene/commit/a63c1f787c8ac8bedd90bb9da0ffed323a21874b))
* **test:** q removed from call ([8edc3c0](https://github.com/technologiestiftung/flusshygiene/commit/8edc3c01a2cd76a0f4b48545df3e318584913235))


### Features

* **apiendoints:** define apiendpoints in Bathingspoit ([fe98e71](https://github.com/technologiestiftung/flusshygiene/commit/fe98e7129b9cb7c6367d308b4ae1304abe2ff941))
* **data posting:** data posting for globalIrradiance, discharges and measurements works ([bd9cd29](https://github.com/technologiestiftung/flusshygiene/commit/bd9cd291db7694c05cdcb340e46aaf6cca4c4d3d))
* **data upload:** adds multiple upload boxes ([7168dfd](https://github.com/technologiestiftung/flusshygiene/commit/7168dfdd69874513531810890e18b6418d355e69)), closes [#20](https://github.com/technologiestiftung/flusshygiene/issues/20) [#135](https://github.com/technologiestiftung/flusshygiene/issues/135)
* **display pplants:** adds table for displaying pplants and its values ([6f969ce](https://github.com/technologiestiftung/flusshygiene/commit/6f969ced40911142962e204a80c903fa3cbb0b50))
* **gi inputs:** adds git inputs table ([b22f597](https://github.com/technologiestiftung/flusshygiene/commit/b22f59728821b2ca3158a24615f1a52322c42d6a))
* **pgapi error handler:** make the error handler send back JSON ([6937b17](https://github.com/technologiestiftung/flusshygiene/commit/6937b1746c4be04f1503076c1518b02dd8574eb1))
* **pplant measurements:** get the PPlant measuremenrts ([7957146](https://github.com/technologiestiftung/flusshygiene/commit/7957146c4556cfb503c320b06539a67cf76e80f5))
* **purificationplants:** adds setup for purification plants form ([f1d448e](https://github.com/technologiestiftung/flusshygiene/commit/f1d448eb9297ba909b785c45c71a32ae918eb38c))
* **reload data:** adds reload of all data associated with spot ([b479b69](https://github.com/technologiestiftung/flusshygiene/commit/b479b69a2bf0c093da4f5c7291929b0dca54765a))
* **sessions:** adds session storage to identify user requests ([6785647](https://github.com/technologiestiftung/flusshygiene/commit/6785647518f48aa3925a02593b98ceccc3884f43))
* **spot count:** adds spot count route to postgres-api ([62e487f](https://github.com/technologiestiftung/flusshygiene/commit/62e487fe1fffee5e15c5714b3cede5647749695b))
* **tables:** adds tables for discharges and GlobalIrradinces ([04271f3](https://github.com/technologiestiftung/flusshygiene/commit/04271f3c1eff0b76da699c7574a6a74868868aec))





## [2.2.1](https://github.com/technologiestiftung/flusshygiene/compare/v2.2.0...v2.2.1) (2019-11-21)

**Note:** Version bump only for package @tsb/flusshygiene





# [2.2.0](https://github.com/technologiestiftung/flusshygiene/compare/v2.1.1...v2.2.0) (2019-11-21)


### Bug Fixes

* **hotfix:** uses currently dev branch of fhpredict package ([ff16079](https://github.com/technologiestiftung/flusshygiene/commit/ff16079faf0c0b214f9f6cc4b6ebeef1ffc14def))
* **url to pg api for fhpredict:** end of url was missing. Got lost in the move ([213f6e1](https://github.com/technologiestiftung/flusshygiene/commit/213f6e16bfb2402db6d243c87213f269bdebc27f))


### Features

* **ocpu basic auth:** adds basic auth to the ocpu container ([2667f4b](https://github.com/technologiestiftung/flusshygiene/commit/2667f4bb55a15e0fb77ec05b6027367c2c6ab0a6)), closes [#22](https://github.com/technologiestiftung/flusshygiene/issues/22)
* **ocpu server:** enable ocpu server for testing again ([3ab956e](https://github.com/technologiestiftung/flusshygiene/commit/3ab956ec069d514ca61a79bf8b0ac7736bba68b8))
* **update fhpredict to 0.9.0:** this updates fhpredict to 0.9.0 ([5e76a44](https://github.com/technologiestiftung/flusshygiene/commit/5e76a4406a3c44cb940138017cf2b16560e1358c)), closes [#83](https://github.com/technologiestiftung/flusshygiene/issues/83)





# [2.2.0](https://github.com/technologiestiftung/flusshygiene/compare/v2.1.1...v2.2.0) (2019-11-21)


### Bug Fixes

* **hotfix:** uses currently dev branch of fhpredict package ([ff16079](https://github.com/technologiestiftung/flusshygiene/commit/ff16079faf0c0b214f9f6cc4b6ebeef1ffc14def))
* **url to pg api for fhpredict:** end of url was missing. Got lost in the move ([213f6e1](https://github.com/technologiestiftung/flusshygiene/commit/213f6e16bfb2402db6d243c87213f269bdebc27f))


### Features

* **ocpu basic auth:** adds basic auth to the ocpu container ([2667f4b](https://github.com/technologiestiftung/flusshygiene/commit/2667f4bb55a15e0fb77ec05b6027367c2c6ab0a6)), closes [#22](https://github.com/technologiestiftung/flusshygiene/issues/22)
* **ocpu server:** enable ocpu server for testing again ([3ab956e](https://github.com/technologiestiftung/flusshygiene/commit/3ab956ec069d514ca61a79bf8b0ac7736bba68b8))
* **update fhpredict to 0.9.0:** this updates fhpredict to 0.9.0 ([5e76a44](https://github.com/technologiestiftung/flusshygiene/commit/5e76a4406a3c44cb940138017cf2b16560e1358c)), closes [#83](https://github.com/technologiestiftung/flusshygiene/issues/83)
