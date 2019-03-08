# mongoQueriesForStatsHospital
Set of JS functions to be run inside the mongo docker container

1) docker cp thisFile.js <mongoContainerName>:/
1) docker exec <mongoContainerName> /bin/bash
2) mongo db <dbName> thisFile.js [>outFile.whatEver]
