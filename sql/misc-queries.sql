--  SELECT PostGIS_full_version();
-- POSTGIS="2.5.2 r17328" [EXTENSION] PGSQL="110" GEOS="3.5.1-CAPI-1.9.1 r4246" PROJ="Rel. 4.9.3, 15 August 2016" GDAL="GDAL 2.1.2, released 2016/10/24" LIBXML="2.9.4" LIBJSON="0.12.1" LIBPROTOBUF="1.2.1" TOPOLOGY RASTER
-- SELECT version();
-- PostgreSQL 11.2 (Debian 11.2-1.pgdg90+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 6.3.0-18+deb9u1) 6.3.0 20170516, 64-bit

-- 2019-06-27 15:32:00.9900
INSERT INTO "public"."global_irradiance" ("id", "createdAt", "updatedAt", "dateTime", "date", "value", "comment", "bathingspotId") VALUES (5, Now(), NOW(), '02:03:04', '03/03/2014', '03/03/2014', 'swkk', 18);


SELECT email from "user";


SELECT * from "bathingspot" WHERE "userId" = 9;
SELECT id from "bathingspot" WHERE "name" = 'Foo';
SELECT * from "bathingspot" WHERE "id" = 40;
SELECT * from "bathingspot_measurement" WHERE "bathingspotId" = 40

SELECT "apiEndpoints" from bathingspot;

SELECT column_name
  FROM information_schema.columns
 -- WHERE table_schema = public
   WHERE table_name  LIKE 'bathingspot'
     ;

SELECT "apiEndpoints", "name", "createdAt" from bathingspot;

select column_name, data_type from information_schema.columns
where table_name = 'bathingspot';

DROP FUNCTION pupulate_db();

CREATE OR REPLACE FUNCTION public.populate_db() RETURNS INTEGER AS
$function$

BEGIN
-- SELECT * from g_input_measurement WHERE "genericInputId" is NULL;
-- SELECT * from g_input_measurement;

	INSERT INTO generic_input ("name","bathingspotId") VALUES('foo',1);
	 INSERT INTO g_input_measurement ("date","value","genericInputId") VALUES(now(),1,1);
	 INSERT INTO "public"."rain" ("date","value","bathingspotId") VALUES(now(),1,1);
	 INSERT into bathingspot_measurement ("date", "conc_ec", "conc_ie","bathingspotId") VALUES (now(),1,1,1);
	INSERT INTO bathingspot_prediction ("prediction","bathingspotId","date") VALUES ('gut', 1, now());
	 INSERT INTO "public"."discharge" ("date","value","bathingspotId") VALUES(now(),1,1);
	 INSERT INTO "public"."global_irradiance" ("date","value","bathingspotId") VALUES(now(),1,1);
	 INSERT INTO "public"."bathingspot_prediction" ("date","bathingspotId", "prediction") VALUES(now(),1, 'gut');
	 INSERT INTO "public"."bathingspot_model" ("bathingspotId", "parameter","comment", "evaluation", "version") VALUES(1,'conc_ec','comment','eval',1);
RETURN 1;
END;
$function$
LANGUAGE plpgsql;


SELECT populate_db();




SELECT * from g_input_measurement WHERE "genericInputId" is NULL;
SELECT * from g_input_measurement;

INSERT INTO generic_input ("name","bathingspotId") VALUES('foo',1);
INSERT INTO g_input_measurement ("date","value","genericInputId") VALUES(now(),1,6);

INSERT INTO purification_plant ("name","bathingspotId") VALUES('foo',1);
INSERT INTO p_plant_measurement ("date","value","purificationPlantId") VALUES(now(),1,4);


INSERT INTO "public"."rain" ("date","value","bathingspotId") VALUES(now(),1,1);
INSERT into bathingspot_measurement ("date", "conc_ec", "conc_ie","bathingspotId") VALUES (now(),1,1,1);
INSERT INTO bathingspot_prediction ("prediction","bathingspotId","date") VALUES ('gut', 1, now());
INSERT INTO "public"."discharge" ("date","value","bathingspotId") VALUES(now(),1,1);
INSERT INTO "public"."global_irradiance" ("date","value","bathingspotId") VALUES(now(),1,1);
INSERT INTO "public"."bathingspot_prediction" ("date","bathingspotId", "prediction") VALUES(now(),1, 'gut');
INSERT INTO "public"."bathingspot_model" ("bathingspotId", "parameter","comment", "evaluation", "version") VALUES(1,'conc_ec','comment','eval',1);


SELECT * from bathingspot_prediction;
SELECT * from bathingspot_model;

select "apiEndpoints" from bathingspot;
