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