When DemoBox is requested, we need to create its database as a copy of Production or Staging.

This can be done by running **run.js**.

The script does the followings.

1) Copy database from Production or Staging to DemoBox
	
	The connection settings can be updated in .docker/envvars.
	
	Source database: DB_URL
	
	Target database: DEMOBOXDB_URL
	
	The URLs consists of Host, Port, Database Name, Authentication (username and password, optional).

2) Set _*null*_ to **creationTime** field of all documents of **tags** and **users** collections
	
	It's to allow any newly created documents to expire in certain time while the existing documents remain.

3) Create **expireAfterSeconds** index on **creationTime** field for **tags** and **users** collections
	
	Expire seconds value can be set through **DEMOBOXDB_EXPIREAFTERSECONDS** variable in .docker/envars.
	
	Default is 3600.
