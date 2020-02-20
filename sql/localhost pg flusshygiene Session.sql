
INSERT INTO bathingspot ("name","version","isPublic","userId") VALUES('foo',1, false, 1);

SELECT "image" from bathingspot;

SELECT * from bathingspot_prediction where "bathingspotId" = 1;

SELECT * from purification_plant;
SELECT * from p_plant_measurement;
INSERT INTO p_plant_measurement ("date","value", "purificationPlantId") VALUES(now(),1,1);

SELECT * from generic_input;
SELECT * from g_input_measurement;
INSERT INTO g_input_measurement ("date","value", "genericInputId") VALUES(now(),1,1);

SELECT * from "image_file";
INSERT INTO "image_file" ("version","bathingspotId","type","url") VALUES(1,1, 'png','http://placekitten.com/200/300');